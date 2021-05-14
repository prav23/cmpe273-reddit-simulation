const Member = require("../../models/member");

const create = (msg, callback) => {
  let response = {};
  let error = {};

  Member.insertMany(msg.body, (err, data) => {
    if (err) {
      error.status = 400;
      error.data = err.toString();
      return callback(error, null);
    }

    response.status = 200;
    response.data = data;
    return callback(null, response);
  });
};

exports.create = create;
