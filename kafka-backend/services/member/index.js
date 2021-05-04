"use strict";
const { create } = require("./create");
const { getNewInvites } = require("./getNewInvites");
const { update } = require("./update");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "create":
      create(msg, callback);
      break;
    case "update":
      update(msg, callback);
      break;
    case "get_new_invites_for_user":
      getNewInvites(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
