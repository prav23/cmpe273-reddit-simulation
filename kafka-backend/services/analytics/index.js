"use strict";
const { numPost } = require("./numPost");
const { numUser } = require("./numUser");
const { activeUser } = require("./activeUser");
const { mostUpvoted } = require("./upvotePost");
const { activeCommunity } = require("./activeCommunity");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "numUsers":
      numUser(msg, callback);
      break;
    case "numPosts":
      numPost(msg, callback);
      break;
    case "upvotedPost":
      mostUpvoted(msg, callback);
      break;
    case "activeUser":
      activeUser(msg, callback);
      break;
    case "activeCommunity":
      activeCommunity(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
