const express = require('express');
const router = express.Router();

const Community = require("../models/community");
const {
  newCommunityValidation,
} = require("../validation/communityValidation");

const Member = require("../models/member");

router.post('/community', async (req, res) => {
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
  });
  await newComm.save();
  return res.status(200).send({ name: newComm.name, description: newComm.description });
});

router.get('/community', async (req, res) => {
  if (!req.query.createdBy) {
    return res.status(400).send('Admin name is required');
  }

  const communities = await Community.find({ createdBy: req.query.createdBy }).exec();
  return res.status(200).send(communities);
});

module.exports = router;
