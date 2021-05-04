const User = require('../../models/users');

const getAllUsers = (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    User.find({ }, (error, user) => {
        if (error) {
            err.status = 500;
            err.data = "Error";
            console.log(err);
            return callback(err, null);
        }
        if (user) {
            results.status = 200;
            results.data = JSON.stringify(user);
            console.log(results);
            return callback(null, results);
        }
    });
};

exports.getAllUsers = getAllUsers;