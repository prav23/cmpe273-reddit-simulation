const express = require("express");
const passport = require("passport");
const user = require("./users");
const member = require("./member");
const community = require("./community");

const posts = require("./post");
const comment = require("./comment");
const message = require("./message");

const router = express.Router();

// post route requests
router.post("/posts", posts.create);
router.get("/posts", posts.list);
router.get("/posts/:communityName", posts.listByCommunity);
router.get("/post/:post_id", posts.load);
router.delete("/post/:post_id", posts.deletePost);
router.put("/posts/vote", posts.votePost);

//comment route requests
router.post("/comments", comment.createRootComment);
router.post("/comments/subcomment", comment.createSubComment);
router.delete("/comment/:comment_id", comment.deleteComment);
router.get("/comments/:postId", comment.load);
router.put("/comment/vote", comment.voteComment);

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

// Create invite
router.post(
  "/invites",
  passport.authenticate("jwt", { session: false }),
  member.create
);

// Get invites sent out by community admin
router.get(
  "/communities/:id/invites",
  passport.authenticate("jwt", { session: false }),
  member.getAllInvitesForCommunity
);

// Get invites received by user
router.get(
  "/users/:id/invites",
  passport.authenticate("jwt", { session: false }),
  member.getAllNewInvitesForUser
);

// Update invite status to joined, rejected
router.put(
  "/invites/:id",
  passport.authenticate("jwt", { session: false }),
  member.updateInvite
);

router.post(
  "/community",
  passport.authenticate("jwt", { session: false }),
  community.createCommunity
);
router.get(
  "/communities",
  passport.authenticate("jwt", { session: false }),
  community.getCommunities
);
router.get(
  "/community",
  passport.authenticate("jwt", { session: false }),
  community.getCommunity
);
router.put(
  "/community",
  passport.authenticate("jwt", { session: false }),
  community.updateCommunity
);
router.put(
  "/community/rule",
  passport.authenticate("jwt", { session: false }),
  community.addCommunityRule
);
router.get(
  "/community/members",
  passport.authenticate("jwt", { session: false }),
  community.getCommunityMembers
);
router.put(
  "/community/members/approve",
  passport.authenticate("jwt", { session: false }),
  community.approveMembers
);
router.put(
  "/community/posts",
  passport.authenticate("jwt", { session: false }),
  community.updatePostCount
);
router.get(
  "/user/communities",
  passport.authenticate("jwt", { session: false }),
  community.getCommunitiesForUser,
);
router.delete(
  "/user/communities",
  passport.authenticate("jwt", { session: false }),
  community.leaveCommunity,
);

//message
router.get("/message", 
  passport.authenticate("jwt", { session: false }),
  message.getMessage
);
router.post("/message", 
  passport.authenticate("jwt", { session: false }),
  message.sendMessage
);

module.exports = router;
