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
  if (!req.query.communityId || !req.query.createdBy) {
    return res.status(400).send('communityId and createdBy are required');
  }

  const community = await Community.find({
    _id: req.query.communityId,
    createdBy: req.query.createdBy,
  }).exec();

  if (community.length === 0) {
    return res.status(400).send(`Community ${req.query.communityId} doesn't exist`);
  }

  return res.status(200).send(community[0]);
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
  if (!req.query.communityId && !req.query.createdby) {
    return res.status(400).send('communityId and createdby are required');
  }

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

const addPost = async (req, res) => {
  const error = addPostValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const communities = await Community.find({ name: req.body.communityName });
  if (!communities || communities.length === 0) {
    return res.status(400).send(`Community ${req.body.communityName} does not exist`);
  }

  // increased num users in the community
  const community = communities[0];
  community.numPosts += 1;

  return res.status(200).send(community);
}

module.exports = {
  createCommunity,
  getCommunities,
  getCommunity,
  addCommunityRule,
  updateCommunity,
  getCommunityMembers,
  approveMembers,
  addPost,
};
