"use strict";
const { getDashboard } = require("./getDashboard");
const { searchForCommunities } = require("./searchForCommunities");
const { voteCommunity } = require("./voteCommunity");
const { createCommunity } = require("./communityAdmin");

let handle_request = (msg, callback) => {
  switch (msg.route) {
    case "get_dashboard":
      getDashboard(msg, callback);
      break;
    case "search_for_communities":
      searchForCommunities(msg, callback);
      break;
    case "vote_community":
      voteCommunity(msg, callback);
      break;
    case "create_community":
      createCommunity(msg, callback);
      break;
  }
};

exports.handle_request = handle_request;