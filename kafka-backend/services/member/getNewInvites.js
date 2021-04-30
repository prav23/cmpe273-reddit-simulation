const Member = require("../../models/member");
const Community = require("../../models/community");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const getNewInvites = (msg, callback) => {
  let response = {};
  let error = {};

  Member.aggregate(
    [
      {
        $match: {
          userId: ObjectId(msg.params.userId),
          status: "new",
        },
      },
      {
        $lookup: {
          from: Community.collection.name,
          localField: "communityId",
          foreignField: "_id",
          as: "community_info",
        },
      },
      {
        $unwind: {
          path: "$community_info",
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          userId: 1,
          communityId: 1,
          "community.name": 1,
          "community.photo": 1,
          status: 1,
          createdAt: 1,
        },
      },
    ],
    (err, data) => {
      if (err) {
        error.status = 400;
        error.data = saveError.toString();
        return callback(error, null);
      }

      response.status = 200;
      response.data = data;
      return callback(null, response);
    }
  );
};

exports.getNewInvites = getNewInvites;
