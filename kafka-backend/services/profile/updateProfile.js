const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const updateProfile = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  const user_email = msg.input.user_email;
  const name = msg.input.name;
  const gender = msg.input.gender;
  const location = msg.input.location;
  const description = msg.input.description;
  const password = msg.input.password;
  const topics = msg.input.topics;
  
  let results = {};
  let err = {};
  try {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
          err.status = 500;
          err.message = "Error";
          return callback(err, null);
      }
      else{
        User.updateOne({ email: user_email }, {$set: {
          "name": name, "gender": gender, "location": location, "description": description, "password": hash, "topics": topics
        }}, (error, result) => {
            if (error) {
              err.status = 500;
              err.data = "Error";
              return callback(err, null);
            }
            else {
              results.status = 200;
              results.data = result;
              return callback(null, results);
            }
        }); 
      }
    });
  } 
  catch (error) {
    err.status = 400;
    err.data = "Unable to update";
    console.log(error);
    return callback(err, null);
  }
};

exports.updateProfile = updateProfile;