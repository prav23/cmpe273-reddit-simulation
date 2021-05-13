const Member = require("../../models/member");

const getUserCommunity = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  const user_id = msg.user_id;
  let results = {};
  let err = {};
  try {
    const communities = await Member.find({ userId : user_id, status: "joined"});
    if (communities) {
      results.status = 200;
      results.data = communities;
      return callback(null, results);
    } else {
      err.status = 400;
      err.data = "Unable to get the user communities";
      //console.log(error);
      return callback(err, null);
    }
  } 
  catch (error) {
    err.status = 400;
    err.data = "Unable to get the user communities";
    console.log(error);
    return callback(err, null);
  }
};

exports.getUserCommunity = getUserCommunity;