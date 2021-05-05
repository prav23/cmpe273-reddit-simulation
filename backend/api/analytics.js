const Community = require("../models/community");
const Post = require("../models/post");
const Member = require("../models/member");

exports.getNumOfPosts = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  const postCount = await Post.aggregate([
    {
      $match: {
        communityName: req.params.communityName,
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
  return res.status(200).send({
    count,
  });
};

exports.getNumOfMembers = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  const memberCount = await Member.aggregate([
    {
      $match: {
        $and: [
          {
            communityName: req.params.communityName,
            status: "joined",
          },
        ],
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);

  const count = memberCount[0] ? memberCount[0].count : 0;
  return res.status(200).send({
    count,
  });
};

exports.mostUpvotedPost = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  const post = await Post.aggregate([
    {
      $match: { communityName: req.params.communityName },
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
  ]);

  console.log(post);
  return res.status(200).send({
    ...post,
  });
};

exports.userWithMaximumNumPosts = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  const user = await Post.aggregate([
    {
      $match: {
        communityName: req.params.communityName,
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

  return res.status(200).send({
    authorName: user[0] ? user[0]._id : "",
    numPosts: user[0] ? user[0].postCount : 0,
  });
};

exports.communityWithMaxPosts = async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send({
      message: "Community Admin missing in query parameter",
    });
  }

  const adminCommunities = await Community.find({
    createdBy: req.query.createdBy,
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
      $limit: 1,
    },
  ]);

  return res.status(200).send({
    ...community,
  });
};
