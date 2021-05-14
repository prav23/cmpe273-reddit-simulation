const Post = require("../../models/posts");

const activeUser = async (msg, callback) => {
  let response = {};
  let error = {};
  try {
    const user = await Post.aggregate([
      {
        $match: {
          communityName: msg.params.communityName,
        },
      },
      {
        $group: {
          _id: "$author",
          authorPosts: { $push: "$title" },
        },
      },
      {
        $project: {
          postCount: { $size: "$authorPosts" },
        },
      },
      {
        $sort: {
          postCount: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);

    response.status = 200;
    response.data = {
      authorName: user[0] ? user[0]._id : "",
      numPosts: user[0] ? user[0].postCount : 0,
    };
    return callback(null, response);
  } catch (err) {
    error.status = 400;
    error.data = err.toString();
    return callback(error, null);
  }
};

exports.activeUser = activeUser;
