const express = require("express");
const passport = require("passport");
const user = require("./users");
const member = require("./member");
const community = require("./community");
const message = require("./message");

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
  //passport.authenticate("jwt", { session: false }),
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
// TODO: add jwt auth
router.post(
  "/community",
  community.createCommunity,
);
// TODO: add jwt auth
router.get(
  "/communities",
  community.getCommunities,
);
// TODO: add jwt auth
router.get(
  "/community",
  community.getCommunity,
);
// TODO: add jwt auth
router.put(
  "/community",
  community.updateCommunity,
);
// TODO: add jwt auth
router.put(
  "/community/rule",
  community.addCommunityRule,
);
// TODO: add jwt auth
router.get(
  "/community/members",
  community.getCommunityMembers,
);

//message
router.get("/message", message.getUsers);
router.get("/message/:email/:receivedBy", message.getMessage);
router.post("/message", message.sendMessage);


module.exports = router;
