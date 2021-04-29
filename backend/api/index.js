const express = require("express");
const passport = require("passport");
const user = require("./users");
const { checkAuth } = require("../utils/passport");
const member = require("./member");

const router = express.Router();

router.post("/login", user.login);
router.post("/register", user.register);
router.get("/users/:id", checkAuth, user.findUser);
router.get("/users", checkAuth, user.findAllUsers);

router.post("/communities/:id/invites", checkAuth, member.create);
router.get("/communities/:id/invites", checkAuth, member.getAllInvitesForUser);
router.put(
  "/communities/:id/invites/:inviteId",
  checkAuth,
  member.updateInvite
);

module.exports = router;
