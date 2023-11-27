const Movie = require("../model/movies");
const {
  HTTPStatus: { OK_STATUS, BAD_REQUEST },
  QUERY: { find },
  common_error_message,
  commonQuery,
} = require("../helper/common_helper");

exports.getMovieList = async (req, res, next) => {
  try {
    let { perPage = 10, page = 1 } = req.query;
    const movies = await commonQuery(
      Movie,
      find,
      {},
      {},
      "",
      [],
      perPage,
      page
    );
    if (movies.status == 1) {
      res.status(OK_STATUS).json({
        status: 1,
        message: "Movies fetched successfully.",
        totalPostsPerPage: perPage,
        pageNumber: page,
        posts: movies.data,
      });
    } else if (movies.status == 2) {
      res.status(OK_STATUS).json({
        status: 1,
        message: "Movies fetched successfully.",
        totalPostsPerPage: perPage,
        pageNumber: page,
        posts: [],
      });
    } else {
      return res
        .status(BAD_REQUEST)
        .json({ status: 0, message: common_error_message });
    }
  } catch (error) {
    return res.status(BAD_REQUEST).json({ status: 0, message: error });
  }
};
