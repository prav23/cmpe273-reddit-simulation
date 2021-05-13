"use strict";
const { getUserProfile } = require("./getUserProfile");
const { getUserCommunity } = require("./getUserCommunity");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "get_userprofile":
      getUserProfile(msg, callback);
      break;
    case "get_usercommunity":
      getUserCommunity(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
