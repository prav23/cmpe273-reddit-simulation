const express = require('express');
const router = express.Router();

const Community = require("../models/community");
const {
  newCommunityValidation,
  newCommunityRuleValidation,
  updateCommunityValidation,
  addPostValidation,
} = require("../validation/communityValidation");

const Member = require("../models/member");
const Post = require("../models/post");
const Comment = require("../models/comment");

// create a new community
const createCommunity = async (req, res) => {
  const error = newCommunityValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const existingComm = await Community.find({ name: req.body.name }).exec();
  if (existingComm.length > 0) {
    return res.status(400).send(`Community with name ${req.body.name} already exists`);
  }

  const newComm = new Community({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.body.createdBy,
    numUsers: 0,
    numPosts: 0,
  });
  await newComm.save();
  return res.status(200).send({ name: newComm.name, description: newComm.description });
};

// get communities created by a user
const getCommunities = async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send('Admin is required');
  }

  const communities = await Community.find({ createdBy: req.query.createdBy }).exec();
  return res.status(200).send(communities);
};

// get community by name
const getCommunity = async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send('createdBy is required');
  }

  let communities = [];
  if (req.query.communityId) {
    communities = await Community.find({
      _id: req.query.communityId,
      createdBy: req.query.createdBy,
    }).exec();
  } else {
    communities = await Community.find({
      createdBy: req.query.createdBy,
    }).exec();
  }

  if (communities.length === 0) {
    return res.status(400).send(`Community ${req.query.communityId} doesn't exist`);
  }

  if (communities.length === 1) {
    return res.status(200).send(communities[0]);
  }
  return res.status(200).send(communities);
};

// add a new rule to the community
const addCommunityRule = async (req, res) => {
  const error = newCommunityRuleValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const communities = await Community.find({ _id: req.body.communityId }).exec();
  if (communities.length === 0) {
    return res.status(400).send(`Community ${req.body.communityId} doesn't exist`);
  }

  const community = communities[0];
  if (!community.rules) {
    community.rules = [];
  }

  community.rules.push({
    title: req.body.title,
    description: req.body.description,
  });
  await community.save();

  return res.status(200).send(community);
};

// update a community's name or description
const updateCommunity = async (req, res) => {
  const error = updateCommunityValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const communities = await Community.find({ _id: req.body.communityId }).exec();
  if (communities.length === 0) {
    return res.status(400).send(`Community ${req.body.communityId} doesn't exist`);
  }

  const community = communities[0];
  if (req.body.newName) {
    const existingCommunities = await Community.find({ name: req.body.newName }).exec();
    if (existingCommunities.length > 0) {
      return res.status(400).send(`Community with name ${req.body.newName} already exists`);
    } else {
      community.name = req.body.newName;
    }
  }

  if (req.body.description) {
    community.description = req.body.description;
  }

  await community.save();
  return res.status(200).send(community);
};

// get community members (optionally specify status)
const getCommunityMembers = async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send('createdby is required');
  }

  if (req.query.communityId) {
    const communities = await Community.find({ _id: req.query.communityId });
    if (!communities || communities.length === 0) {
      return res.status(400).send(`Community ${req.query.communityId} does not exist`);
    }

    const community = communities[0];
    if (community.createdBy !== req.query.createdBy) {
      return res.status(403).send(`User ${req.query.createdBy} is not community ${req.query.communityId} admin`);
    }

    const status = req.query.status ? req.query.status : 'invited';
    const members = await Member.find({ communityId: community._id, status: status });
    return res.status(200).send(members);
  } else {
    const communities = await Community.find({ createdBy: req.query.createdBy });
    if (!communities || communities.length === 0) {
      return res.status(400).send(`User ${req.query.createdBy} has not created communities`);
    }

    const status = req.query.status ? req.query.status : 'invited';
    const members = await Member.find({
      communityId: { $in: communities.map((community) => community._id) },
      status: status
    });
    return res.status(200).send(members);
  }
}

// approve community members that have requested to join
const approveMembers = async (req, res) => {
  if (!req.body.communityId || !req.body.members) {
    return res.status(400).send('communityId and members are required');
  }

  const communities = await Community.find({ _id: req.body.communityId });
  if (!communities || communities.length === 0) {
    return res.status(400).send(`Community ${req.body.communityId} does not exist`);
  }

  // increased num users in the community
  const community = communities[0];
  community.numUsers += req.body.members.length;
  await community.save();

  await Member.update(
    // find correct members
    { _id: { $in: req.body.members } },
    // update status to joined
    { status: 'joined' },
    // update multiple documents
    { multi: true }
  );

  return res.status(200).send(`Approved ${req.body.members.length} community members`);
}

// update num posts in community
const updatePostCount = async (req, res) => {
  const error = addPostValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const communities = await Community.find({ name: req.body.communityName });
  if (!communities || communities.length === 0) {
    return res.status(400).send(`Community ${req.body.communityName} does not exist`);
  }

  // increased num posts in the community
  const community = communities[0];
  community.numPosts += 1;
  await community.save();

  return res.status(200).send(community);
}

const getCommunitiesForUser = async(req, res) => {
  if (!req.query.userId || !req.query.createdBy) {
    return res.status(400).send('userId and createdBy are required');
  }

  // find all communities created by admin
  const communities = await Community.find({ createdBy: req.query.createdBy });
  if (communities.length > 0) {
    const communityIds = communities.map((community) => {
      return community._id;
    });

    // find all memberships for user in communities created by admin
    const members = await Member.find({
      userId: req.query.userId,
      communityId: { $in: communityIds },
      status: 'joined',
    });

    const memberIds = members.map((member) => member.communityId);
    const userCommunities = await Community.find({
      _id: { $in: memberIds },
    });

    return res.status(200).send({ communities: userCommunities });
  }

  return res.status(200).send({ communities: [] })
}

// delete all of a user's posts, comments, and memberships from a community
const leaveCommunity = async(req, res) => {
  if (!req.query.userId && !req.query.communityIds) {
    return res.status.send('userId and communityIds are required');
  }

  // find user
  const users = await User.find({ _id: req.query.userId });
  if (!users || users.length === 0) {
    return res.status(400).send(`User ${req.query.userId} does not exist`);
  }

  // find communities
  const communities = await Community.find({ _id: { $in: req.query.communityIds.split(',') } });
  if (!communities || communities.length === 0) {
    return res.status(400).send(`No communities ${req.query.communityIds} found`);
  }

  const user = users[0];
  const communityNames = communities.map((community) => community.name);

  // find posts
  const posts = await Post.find({
    author: req.query.userId,
    communityName: { $in: communityNames },
  });
  const postIds = posts.map((post) => post._id);

  // delete comments and posts
  await Comment.deleteMany({ postId: { $in: postIds } });
  await Post.deleteMany({
    author: req.query.userId,
    communityName: { $in: communityNames },
  });

  // delete memberships
  await Member.deleteMany({
    userId: req.query.userId,
    communityId: { $in: req.query.communityIds.split(',') },
  });

  return res.status(200).send(`removed ${req.query.userId} from communities ${req.query.communityIds}`);
}

// search for communities based off query from navbar
const searchForCommunities = async(req, res) => {
  if(!req.query.q){
    return res.status(400).send('search query required');
  }

  try {
    const communities = await Community.find(
      { name: { $regex: req.query.q, $options: "i" }, },
      null,
      { sort: { createdAt: -1 } },
    );
    res.json(communities);
  } catch (e) {
    res.status(500);
  }
}

// get community posts for user dashboard
const getDashboard = async(req, res) => {
  if(!req.query.id){
    return res.status(400).send('user required');
  }

  try {
    // get Member (communities that user is a part of)
    const userIsMemberOf = await Member.find(
      { userId: req.query.id },
    );
    
    // get community names array from Member
    const communityNames = userIsMemberOf.map((u) => u.communityName);

    // get posts that have the same community name
    const posts = await Post.find(
      { communityName: { $in: communityNames } },
      null,
      { sort: { createdAt: -1 } },
    );

    // get # of users in community
    const communities = await Community.find();
    
    const retPosts = [];
    posts.forEach((p) => {
      let community = communities.find(c => c.name === p.communityName);
      
      retPosts.push({
        _id: p._id,
        postType: p.postType,
        url: p.url,
        text: p.text,
        image: p.image,
        score: p.score,
        numComments: p.numComments,
        communityName: p.communityName,
        author: p.author,
        title: p.title,
        votes: p.votes,
        createdAt: p.createdAt,
        numCommunityUsers: community.numUsers,
        __v: p.__v,
      });
    });

    res.json(retPosts);
  } catch (e) {
    res.status(500);
  }
}

module.exports = {
  createCommunity,
  getCommunities,
  getCommunity,
  addCommunityRule,
  updateCommunity,
  getCommunityMembers,
  approveMembers,
  updatePostCount,
  getCommunitiesForUser,
  leaveCommunity,
  searchForCommunities,
  getDashboard,
};
