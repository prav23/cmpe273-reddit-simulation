const Post = require("../../models/posts");

const mostUpvoted = async (msg, callback) => {
  let response = {};
  let error = {};

  try {
    const post = await Post.aggregate([
      {
        $match: { communityName: msg.params.communityName },
      },
      {
        $unwind: "$votes",
      },
      {
        $group: {
          _id: 1,
          communityName: { $first: "$communityName" },
          author: { $first: "$author" },
          title: { $first: "$title" },
          createdAt: { $first: "$createdAt" },
          url: { $first: "$url" },
          text: { $first: "$text" },
          link: { $first: "$link" },
          image: { $first: "$image" },
          postType: { $first: "$postType" },
          score: { $first: "$score" },
          votes: { $push: "$votes" },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    response.status = 200;
    response.data = post;
    return callback(null, response);
  } catch (err) {
    error.status = 400;
    error.data = err.toString();
    return callback(error, null);
  }
};

exports.mostUpvoted = mostUpvoted;
