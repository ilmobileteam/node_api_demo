const User = require("../model/user");
const Post = require("../model/post");
const {
  HTTPStatus: { OK_STATUS, BAD_REQUEST },
  QUERY: { findOne, create, find, findOneAndUpdate, findOneAndDelete },
  common_error_message,
  commonQuery,
} = require("../helper/common_helper");

exports.getPosts = async (req, res, next) => {
  const userId = req.user.verify.userId;
  const posts = await commonQuery(
    Post,
    find,
    {
      creator: userId,
    },
    { createdAt: -1 }
  );
  console.log(posts.status);
  if (posts.status == 1) {
    res.status(OK_STATUS).json({
      status: 1,
      message: "Posts fetched successfully.",
      totalPosts: posts.data.length,
      posts: posts.data,
    });
  } else if (posts.status == 2) {
    res.status(OK_STATUS).json({
      status: 1,
      message: "Posts fetched successfully.",
      totalItems: 0,
      post: [],
    });
  } else {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: common_error_message });
  }
};

exports.creatPosts = async (req, res, next) => {
  try {
    const title = req.body.title;
    const subTitle = req.body.subTitle;
    const userId = req.user.verify.userId;

    const createPost = await commonQuery(Post, create, {
      title: title,
      subTitle: subTitle,
      creator: userId,
    });

    if (createPost.status == 1) {
      const user = await commonQuery(User, findOne, {
        _id: userId,
      });
      if (user.status == 1) {
        const updated = await commonQuery(
          User,
          findOneAndUpdate,
          {
            _id: userId,
          },
          { $push: { posts: createPost.data._id } }
        );
        if (updated.status == 1) {
          res.status(OK_STATUS).json({
            status: 1,
            message: "Post created successfully.",
            post: createPost.data,
          });
        }
      }
    }
  } catch (error) {
    res.status(BAD_REQUEST).json({
      status: 0,
      message: common_error_message,
    });
  }
};

exports.getSinglePost = async (req, res, next) => {
  const postId = req.body.postId;
  const singlePost = await commonQuery(Post, findOne, { _id: postId });
  if (singlePost.status == 1) {
    res.status(OK_STATUS).json({
      status: 1,
      message: "Post fetched successfully.",
      post: singlePost.data,
    });
  } else {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: common_error_message });
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const title = req.body.title;
    const subTitle = req.body.subTitle;
    const imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path;
    }

    if (!imageUrl) {
      const err = Error("Please select the file!");
      err.statusCode = 422;
      throw err;
    }

    const singlePost = await Post.findById(postId);

    if (!singlePost) {
      const err = Error("Not able to find post with this id!");
      err.statusCode = 422;
      throw err;
    }

    if (singlePost.creator.toString() !== req.userId) {
      const err = Error("Not Authorised for edit!");
      err.statusCode = 403;
      throw err;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    singlePost.title = title;
    singlePost.subTitle = subTitle;
    singlePost.imageUrl = imageUrl;

    await singlePost.save();

    res.status(200).json({
      message: "Successfully Fetched!",
      data: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.body;
  const deleptePost = await commonQuery(Post, findOneAndDelete, {
    _id: postId,
  });

  if (deleptePost.status == 1) {
    res.status(OK_STATUS).json({
      status: 1,
      message: "Post deleted successfully.",
    });
  } else {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: common_error_message });
  }
};
