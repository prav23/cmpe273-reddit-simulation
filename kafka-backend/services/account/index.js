"use strict";
const { deactivateAccount } = require("./deactivateAccount");
const { activateAccount } = require("././activateAccount");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "deactivate_account":
      deactivateAccount(msg, callback);
      break;
    case "login":
      activateAccount(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;