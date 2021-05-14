"use strict";
const { create } = require("./createPost");
const { deletePost } = require("./deletePost");
const { listCommunityPosts } = require("./listCommunityPosts");
const { listPosts } = require("./listPosts");
const { loadPost } = require("./loadPost");
const { votePost } = require("./votePost");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "create_post":
      create(msg, callback);
      break;
    case "delete_post":
      deletePost(msg, callback);
      break;
    case "list_community_posts":
      listCommunityPosts(msg, callback);
      break;
    case "list_posts":
      listPosts(msg, callback);
      break;
    case "load_post":
      loadPost(msg, callback);
      break;
    case "vote_post":
      votePost(msg, callback);
      break;

  }
};

exports.handle_request = handle_request;
