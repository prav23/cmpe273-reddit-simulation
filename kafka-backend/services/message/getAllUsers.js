const Users = require('../../models/users');

const getAllUsers = (msg, callback) => {
  let response = {};
  let error = {};
  Users.find(msg.body, (err, user) => {
    if (err) {
      error.status = 500;
      error.data = saveError.toString();
      console.log(err);
      return callback(error, null);
    }
    if (user){
      response.status = 200;
      response.data = JSON.stringify(user);
      return callback(null, response);
    }
  });
};

exports.getAllUsers = getAllUsers;