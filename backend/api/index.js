const express = require("express");
const passport = require("passport");
const user = require("./users");
const member = require("./member");
const community = require("./community");
const analytics = require("./analytics");
const posts = require("./post");
const comment = require("./comment");
const message = require("./message");
const userprofile = require("./userprofile");
const profile = require("./profile");
const performance = require("./performance");

const router = express.Router();

// measure performance api requests
router.get("/performance/createusers/:userCount", performance.createFakeUsers);
router.get(
  "/performance/createmessages/:messageCount",
  performance.createFakeMessages
);
router.get(
  "/performance/createuserskafka/:userCount",
  performance.createFakeUsersKafka
);
router.get(
  "/performance/createmessageskafka/:messageCount",
  performance.createFakeMessagesKafka
);
router.get("/performance/users", performance.getAllUsers);
router.get("/performance/messages", performance.getAllMessages);
router.get("/performance/messages/redis", performance.getAllMessagesRedis);
router.get(
  "/performance/messages/redis/kafka",
  performance.getAllMessagesRedisKafka
);

// profile
router.get("/profile/:user_email", profile.getProfile);
router.post("/profile", profile.updateProfile);
router.get("/image/:user_email", profile.getImage);
router.get("/image/path/:profilePicture", profile.getImagePath);
router.post("/image/:user_email", profile.uploadImage);

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
  //passport.authenticate("jwt", { session: false }),
  user.findAllUsers
);

// Create invite
router.post(
  "/invites",
  passport.authenticate("jwt", { session: false }),
  member.create
);

// Create multiple invites
router.post(
  "/invites/create",
  passport.authenticate("jwt", { session: false }),
  member.createMany
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
  //passport.authenticate("jwt", { session: false }),
  community.createCommunity
);
router.get(
  "/communities",
  //passport.authenticate("jwt", { session: false }),
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
router.put(
  "/community/vote",
  passport.authenticate("jwt", { session: false }),
  community.voteCommunity
);
router.get(
  "/user/communities",
  passport.authenticate("jwt", { session: false }),
  community.getCommunitiesForUser
);
router.post(
  "/user/communities",
  passport.authenticate("jwt", { session: false }),
  community.joinCommunity
);
router.delete(
  "/user/communities",
  passport.authenticate("jwt", { session: false }),
  community.leaveCommunity
);
router.delete(
  "/community/community",
  passport.authenticate("jwt", { session: false }),
  community.deleteCommunity
);

// Search for communities based off navbar query
router.get(
  "/findcommunities",
  passport.authenticate("jwt", { session: false }),
  community.searchForCommunities
);

// Get Dashboard posts
router.get(
  "/dashboard", 
  //passport.authenticate("jwt", { session: false }),
  community.getDashboard
);

//message
router.get("/message/:email", message.getMessage);
router.post("/message", message.sendMessage);

//user profile
router.get("/userprofile/:user_name", userprofile.getProfile);
router.get("/userprofile/community/:user_name", userprofile.getCommunity);

// Get number of posts for a community
router.get("/communities/:communityName/numPosts", analytics.getNumOfPosts);

// Get number of users for a community
router.get("/communities/:communityName/numUsers", analytics.getNumOfMembers);

// Get the most upvoted post for a community
router.get(
  "/communities/:communityName/mostUpvotedPost",
  analytics.mostUpvotedPost
);

// Get user who has created maximum number of posts in a community
router.get(
  "/communities/:communityName/mostActiveUser",
  analytics.userWithMaximumNumPosts
);

// Get admin's community with maximum number of posts
router.get("/communities/mostActiveCommunity", analytics.communityWithMaxPosts);

module.exports = router;
