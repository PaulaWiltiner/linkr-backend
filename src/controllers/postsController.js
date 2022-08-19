import {
  addPosts,
  createLike,
  deleteLike,
  deletePostById,
  getLikesPost,
  getIdForEmail,
  getPosts,
  getPostsByUserId,
  getPostsWithoutLimit,
  getRePost,
  insertHashtags,
  insertPost,
  insertTrending,
  reePost,
  searchIdTrending,
  setComment,
  updateDescription,
  getHashtag,
} from "../repositories/postsRepository.js";
import { getUserById } from "../repositories/usersRepository.js";
import { getQtdComments } from "../repositories/postsRepository.js";

export async function createPost(req, res) {
  const post = req.body;
  const email = req.email;
  const {
    title: titleURL,
    description: descriptionURL,
    image: imageURL,
  } = res.infosUrl;
  try {
    let arrayHashtagsId = [];
    const descriptionArray = post.description.split(" ");
    const userHashtags = descriptionArray.filter(
      (hashtag) => hashtag[0] === "#"
    );

    const { rows: dbHashtags } = await getHashtag();

    const alreadyExistHashtags = dbHashtags.map((user) => user.hashtag);

    const hashtagsToInsert = userHashtags.filter((userHashtag) => {
      let existHashtag = false;

      alreadyExistHashtags.map((dbHashtag) => {
        if (userHashtag === dbHashtag) {
          existHashtag = true;
        }
      });

      if (existHashtag == false) {
        return userHashtag;
      }
    });
    post.description, post.link, titleURL, descriptionURL, imageURL;
    const { rows: user } = await getIdForEmail(email);
    const {
      rows: [postId],
    } = await addPosts(
      post.description,
      post.link,
      titleURL,
      descriptionURL,
      imageURL
    );

    hashtagsToInsert.map(async (hashtag) => {
      await insertTrending(hashtag);
    });

    for (let i = 0; i < userHashtags.length; i++) {
      const {
        rows: [hashtagId],
      } = await searchIdTrending(userHashtags[i]);

      arrayHashtagsId.push(hashtagId.id);
    }

    arrayHashtagsId.map(async (id) => {
      await insertHashtags(postId.id, id);
    });

    await insertPost(postId.id, user[0].id);

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function pullPosts(req, res) {
  const { userId } = res.locals;
  const { start } = req.query;

  try {
    let startLimit = start;
    const allposts = await getPostsWithoutLimit(userId);
    if (!allposts.length) {
      return res
        .send({
          errFollower: res.locals.validateErrFollower,
          postList: [],
          length: 0,
        })
        .status(200);
    }

    if (!start) {
      startLimit = allposts[0].id + 1;
    }

    const postList = await getPosts(res.locals.userId, startLimit);

    return res
      .send({
        errFollower: res.locals.validateErrFollower,
        postList: postList,
        length: allposts.length,
      })
      .status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function updatePost(req, res) {
  const { description } = req.body;
  const { id } = req.params;

  try {
    updateDescription(id, description);

    return res.status(200).send("successfully updated");
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  const { id } = req.params;

  await deletePostById(id);

  return res.status(200).send("Post deleted!");
}

export async function likePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    await createLike(postId, userId);
    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function unlikePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    await deleteLike(postId, userId);
    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function postsByUserId(req, res) {
  const { id } = req.params;
  const { start } = req.query;

  try {
    const {
      rows: [user],
    } = await getUserById(id);

    if (!user) return res.sendStatus(404);

    let startLimit = start;
    const allposts = await getPostsByUserId(user.id);
    if (!allposts.length) {
      //errFollower: res.locals.validateErrFollower,
      return res
        .send({
          postList: [],
          length: 0,
        })
        .status(200);
    }

    if (!start) {
      startLimit = allposts[0].id + 1;
    }

    const userPosts = await getPostsByUserId(user.id, startLimit);

    //errFollower: res.locals.validateErrFollower,
    return res
      .send({
        userInfo: {
          username: user.username,
          picture: user.picture,
        },
        postList: userPosts,
        length: allposts.length,
      })
      .status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function reloadPosts(req, res) {
  const userId = res.locals.userId;

  const posts = await getPostsWithoutLimit(userId);

  return res.status(200).send(posts);
}

export async function rePost(req, res) {
  const { userId } = res.locals;
  const { postId } = req.params;
  try {
    await reePost(postId, userId, res.locals.post);
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function reePosts(req, res) {
  const { postId } = req.params;
  try {
    const response = await getRePost(postId);
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getComments(req, res) {
  const { postId } = req.params;
  const postAuthor = res.locals.userId;

  const {
    rows: [qtdComments],
  } = await getQtdComments(postId);

  const comments = qtdComments ? qtdComments.qtd : 0;

  return res.status(200).send({
    postAuthor,
    postId: postId,
    comments: res.locals.comments,
    qtdOfComments: comments,
  });
}

export async function createComment(req, res) {
  const { comment } = req.body;
  const { postId } = req.params;
  const userId = res.locals.userId;

  setComment(comment, userId, postId);

  return res.sendStatus(200);
}

export async function likesPost(req, res) {
  const { postId } = req.params;
  const userId = res.locals.userId;

  const response = await getLikesPost(postId, userId);

  return res.send(response).status(200);
}
