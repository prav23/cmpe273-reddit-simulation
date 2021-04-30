const Member = require("../../models/member");

const update = (msg, callback) => {
  let response = {};
  let error = {};

  Member.findByIdAndUpdate(
    msg.params.id,
    { status: msg.body.status },
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

exports.update = update;
