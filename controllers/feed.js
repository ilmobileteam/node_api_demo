const { validationResult } = require("express-validator");
const User = require("../model/user");
const Post = require("../model/post");
const {
  HTTPStatus: { OK_STATUS, BAD_REQUEST },
  QUERY: { findOne, create, countDocuments, find, findOneAndUpdate },
  commonQuery,
} = require("../helper/common_helper");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  const totalPost = await commonQuery(Post, countDocuments);
  const posts = await commonQuery(
    Post,
    find,
    {},
    {},
    "",
    [],
    perPage,
    currentPage
  );
  if (posts.status == 1) {
    res.status(OK_STATUS).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: totalPost.data,
    });
  } else {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: "Please check the params" });
  }
  //   try {
  //     const totalCount = await Post.find().count();
  //     const posts = await Post.find()
  //       .skip((currentPage - 1) * perPage)
  //       .limit(perPage);

  //     res.status(200).json({
  //       message: "Fetched posts successfully.",
  //       posts: posts,
  //       totalItems: totalCount,
  //     });
  //   } catch (error) {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   }
};

exports.creatPosts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: "Please select the image!" });
    }

    const title = req.body.title;
    const subTitle = req.body.subTitle;
    const imageUrl = req.file.destination + "/" + req.file.filename;

    const createPost = await commonQuery(Post, create, {
      title: title,
      subTitle: subTitle,
      imageUrl: imageUrl,
      creator: req.user.verify.userId,
    });

    if (createPost.status == 1) {
      const user = await commonQuery(User, findOne, {
        _id: req.user.verify.userId,
      });
      if (user.status == 1) {
        // console.log("user :>> ", user.data.posts);
        // user.data.posts.push(createPost);
        const updated = await commonQuery(
          User,
          findOneAndUpdate,
          {
            _id: req.user.verify.userId,
          },
          { $push: { posts: createPost.data._id } }
        );
        if (updated.status == 1) {
          res.status(OK_STATUS).json({
            message: "Successfully Created!",
            userId: req.user.verify.userId,
            post: createPost.data,
          });
        }
      }
    }

    // const user = await User.findById({ _id: req.user.verify.userId });
    // user.posts.push(post);
    // await user.save();

    // res.status(200).json({
    //   message: "Successfully Created!",
    //   data: post,
    //   userId: req.user.verify.userId,
    // });
  } catch (error) {
    console.log("error :>> ", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const { postId } = req.body;
  const singlePost = await commonQuery(Post, findOne, { _id: postId });
  console.log("singlePost :>> ", postId);
  if (singlePost.status == 1) {
    res.status(OK_STATUS).json({
      message: "Successfully Fetched!",
      data: singlePost,
    });
  } else {
    return res
      .status(BAD_REQUEST)
      .json({ status: 0, message: "Please check the postId." });
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
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const err = Error("Not able to find post with this id!");
      err.statusCode = 422;
      throw err;
    }

    if (post.creator.toString() !== req.userId) {
      const err = Error("Not Authorised for edit!");
      err.statusCode = 403;
      throw err;
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);
    const user = await User.findById({ _id: req.userId });
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "Successfully Deleted!",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
