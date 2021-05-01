"use strict";
const { getAllUsers } = require("./getAllUsers");
const { getMessageList } = require("./getMessageList");
const { sendMessage } = require("./sendMessage");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "users":
      getAllUsers(msg, callback);
      break;
    case "":
      getMessageList(msg, callback);
      break;
    case "":
      sendMessage(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
