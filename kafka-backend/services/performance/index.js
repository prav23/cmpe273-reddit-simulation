"use strict";
const { createUsers } = require("./createUsers");
const { createMessages } = require("./createMessages");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "create_users":
      createUsers(msg, callback);
      break;
    case "create_messages":
      createMessages(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;
