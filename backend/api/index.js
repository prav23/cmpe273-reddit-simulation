const express = require("express");
const passport = require("passport");
const user = require("./users");
const member = require("./member");

const Community = require("../models/community");
const {
  newCommunityValidation,
} = require("../validation/communityValidation");

const Member = require("../models/member");

const router = express.Router();

router.post("/login", user.login);
router.post("/register", user.register);
router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  user.findUser
);
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  user.findAllUsers
);

router.post(
  "/invites",
  passport.authenticate("jwt", { session: false }),
  member.create
);
router.get(
  "/communities/:id/invites",
  passport.authenticate("jwt", { session: false }),
  member.getAllInvitesForCommunity
);
router.get(
  "/users/:id/invites",
  passport.authenticate("jwt", { session: false }),
  member.getAllInvitesForUser
);
router.put(
  "/invites/:id",
  passport.authenticate("jwt", { session: false }),
  member.updateInvite
);

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
