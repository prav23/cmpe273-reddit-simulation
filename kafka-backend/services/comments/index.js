"use strict";
const { createRootComment } = require("./createRootComment");
const { createSubComment } = require("./createSubComment");
const { deleteComment } = require("./deleteComment");
const { loadPostComments } = require("./loadPostComments");
const { voteComment } = require("./voteComment");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "create_rootcomment":
      createRootComment(msg, callback);
      break;
    case "create_subcomment":
      createSubComment(msg, callback);
      break;
    case "delete_comment":
      deleteComment(msg, callback);
      break;
    case "load_postcomments":
      loadPostComments(msg, callback);
      break;
    case "vote_comment":
      voteComment(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
