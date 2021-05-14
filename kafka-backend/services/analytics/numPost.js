const Post = require("../models/post");

const numPost = async (msg, callback) => {
  let response = {};
  let error = {};

  try {
    const postCount = await Post.aggregate([
      {
        $match: {
          communityName: msg.params.communityName,
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const count = postCount[0] ? postCount[0].count : 0;
    response.status = 200;
    response.data = count;
    return callback(null, response);
  } catch (err) {
    error.status = 400;
    error.data = err.toString();
    return callback(error, null);
  }
};

exports.numPost = numPost;
