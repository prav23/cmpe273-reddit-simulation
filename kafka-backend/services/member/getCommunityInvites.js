const Member = require("../../models/member");
const Community = require("../../models/community");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getCommunityInvites = (msg, callback) => {
  let response = {};
  let error = {};

  Member.find(
    { communityId: msg.params.id, sentBy: msg.query.createdBy },
    (err, data) => {
      if (err) {
        error.status = 400;
        error.data = err.toString();
        return callback(error, null);
      }

      response.status = 200;
      response.data = data;
      return callback(null, response);
    }
  );
};

exports.getCommunityInvites = getCommunityInvites;
