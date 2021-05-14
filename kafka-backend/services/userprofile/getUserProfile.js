const User = require("../../models/User");

const getUserProfile = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  const user_name = msg.user_name;
  let results = {};
  let err = {};
  try {
    const user = await User.findOne({ name : user_name});
    if (user) {
      results.status = 200;
      results.data = user;
      return callback(null, results);
    } else {
      err.status = 400;
      err.data = "Unable to get the user profile";
      //console.log(error);
      return callback(err, null);
    }
  } 
  catch (error) {
    err.status = 400;
    err.data = "Unable to get the user profile";
    console.log(error);
    return callback(err, null);
  }
};

exports.getUserProfile = getUserProfile;