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

  const newComm = new Community({ name: req.body.name, description: req.body.description });
  await newComm.save();
  res.status(200).send({ name: newComm.name, description: newComm.description });
});

module.exports = router;
