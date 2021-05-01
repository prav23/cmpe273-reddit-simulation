const express = require("express");
const passport = require("passport");
const user = require("./users");
const member = require("./member");
const community = require("./community");

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
// TODO: add jwt auth
router.post(
  "/community",
  community.createCommunity,
);
// TODO: add jwt auth
router.get(
  "/community",
  community.getCommunities,
);

module.exports = router;
