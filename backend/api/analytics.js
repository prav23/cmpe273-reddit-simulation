const Community = require("../models/community");
const Post = require("../models/post");
const Member = require("../models/member");
const kafka = require("../kafka/client");

exports.getNumOfPosts = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  let msg = {
    params: req.params,
    route: "numPosts",
  };

  kafka.make_request("analytic", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).send({
      count: results.data,
    });
  });

  /* const postCount = await Post.aggregate([
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
  }); */
};

exports.getNumOfMembers = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  let msg = {
    params: req.params,
    route: "numUsers",
  };

  kafka.make_request("analytic", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).send({
      count: results.data,
    });
  });

  /* const memberCount = await Member.aggregate([
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
  }); */
};

exports.mostUpvotedPost = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  let msg = {
    params: req.params,
    route: "upvotedPost",
  };

  kafka.make_request("analytic", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).json(results.data);
  });

  /* const post = await Post.aggregate([
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
    {
      $limit: 5,
    },
  ]);

  return res.status(200).json(post); */
};

exports.userWithMaximumNumPosts = async (req, res) => {
  if (!req.params.communityName) {
    return res.status(400).send({
      message: "Community name parameter missing!",
    });
  }

  let msg = {
    params: req.params,
    route: "activeUser",
  };

  kafka.make_request("analytic", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).send({
      authorName: results.data.authorName,
      numPosts: results.data.numPosts,
    });
  });

  /* const user = await Post.aggregate([
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
  }); */
};

exports.communityWithMaxPosts = async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send({
      message: "Community Admin missing in query parameter",
    });
  }

  let msg = {
    query: req.query,
    route: "activeCommunity",
  };

  kafka.make_request("analytic", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).json(results.data);
  });

  /* const adminCommunities = await Community.find({
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
      $limit: 5,
    },
  ]);

  return res.status(200).json(community); */
};
