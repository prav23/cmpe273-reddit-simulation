const Post = require("../models/post");

const activeCommunity = async (msg, callback) => {
  let response = {};
  let error = {};
  try {
    const adminCommunities = await Community.find({
      createdBy: msg.query.createdBy,
    }).exec();

    const communityNames = adminCommunities.map(function (x) {
      return x.name;
    });

    const community = await Post.aggregate([
      {
        $match: {
          communityName: { $in: communityNames },
        },
      },
      {
        $group: {
          _id: "$communityName",
          communityPosts: { $push: "$title" },
        },
      },
      {
        $project: {
          postCount: { $size: "$communityPosts" },
        },
      },
      {
        $sort: {
          postCount: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    response.status = 200;
    response.data = community;
    return callback(null, response);
  } catch (err) {
    error.status = 400;
    error.data = err.toString();
    return callback(error, null);
  }
};

exports.activeCommunity = activeCommunity;
