const Member = require("../../models/member");

const numUser = async (msg, callback) => {
  let response = {};
  let error = {};

  try {
    const memberCount = await Member.aggregate([
      {
        $match: {
          $and: [
            {
              communityName: msg.params.communityName,
              status: "joined",
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);

    const count = memberCount[0] ? memberCount[0].count : 0;
    response.status = 200;
    response.data = count;
    return callback(null, response);
  } catch (err) {
    error.status = 400;
    error.data = err.toString();
    return callback(error, null);
  }
};

exports.numUser = numUser;
