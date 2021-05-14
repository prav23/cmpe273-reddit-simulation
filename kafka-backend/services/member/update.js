const Member = require("../../models/member");
const Community = require("../../models/community");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const update = (msg, callback) => {
  let response = {};
  let error = {};

  Member.findByIdAndUpdate(
    msg.params.id,
    { status: msg.body.status },
    (err, data) => {
      if (err) {
        error.status = 400;
        error.data = err.toString();
        return callback(error, null);
      }

      Community.find({ _id: data.communityId })
        .then((communities) => {
          if (communities.length > 0) {
            const community = communities[0];
            if (req.body.status === "joined") {
              community.numUsers += 1;
            } else if (
              req.body.status === "rejected" &&
              community.numUsers > 0
            ) {
              community.numUsers -= 1;
            }

            community
              .save()
              .then(() => {
                response.status = 200;
                response.data = data;
                return callback(null, response);
              })
              .catch((err) => {
                error.status = 400;
                error.data = err.toString();
                return callback(error, null);
              });
          } else {
            error.status = 400;
            error.data = `Community ${req.body.communityName} does not exist`;
            return callback(error, null);
          }
        })
        .catch((err) => {
          error.status = 500;
          error.data = err.toString();
          return callback(error, null);
        });
    }
  );

  /* Member.findByIdAndUpdate(
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
  ); */
};

exports.update = update;
