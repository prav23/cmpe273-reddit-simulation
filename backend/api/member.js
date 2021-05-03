const Member = require("../models/member");
const User = require("../models/User");
const Community = require("../models/community");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const kafka = require("../kafka/client");
const {
  createValidation,
  createManyValidation,
  updateValidation,
} = require("../validation/memberValidation");

const defaultAvatars = require('../utils/defaultImages');

exports.create = (req, res) => {
  const error = createValidation(req.body);
  if (error) {
    return res.status(400).send({
      message: "Invalid payload!" + error.toString(),
    });
  }

  User.find({ _id: req.body.userId }).then((users) => {
    if (!users || users.length === 0) {
      return res.status(400).send(`User with id ${req.body.userId} does not exist`);
    }
    const user = users[0];
    req.body.userName = user.name;
    req.body.photo = user.profilePicture ? user.profilePicture : defaultAvatars.userAvatar;

    const newMember = new Member({ ...req.body });
    newMember.save((saveError, data) => {
      if (saveError) {
        return res.status(400).send({
          message: saveError.toString(),
        });
      }

      return res.status(200).send({
        data,
        message: "Invite created successfully",
      });
    });
  }).catch((error) => {
    return res.status(500).send(error);
  });
};

exports.createMany = (req, res) => {
  const error = createManyValidation(req.body);
  if (error) {
    return res.status(400).send({
      message: "Invalid payload!" + error.toString(),
    });
  }

  /* let msg = {
    route: "create",
    body: req.body,
  };
  kafka.make_request("invite", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).send({
      data: results.data,
      message: "Invites created successfully",
    });
  }); */

  Member.insertMany(req.body, (err, data) => {
    if (err) {
      return res.status(400).send({
        message: err.toString(),
      });
    }

    return res.status(200).send({
      data,
      message: "Invites created successfully",
    });
  });
};

exports.getAllNewInvitesForUser = (req, res) => {
  if (!req.params.userId) {
    return res.status(400).send({
      message: "Id params missing",
    });
  }

  /* let msg = {
      route: "get_new_invites_for_user",
      params: req.params,
    };
    kafka.make_request("invite", msg, (err, results) => {
      if (err) {
        return res.status(err.status).send({
          message: err.data,
        });
      }
  
      return res.status(results.status).json(results.data);
    }); */

  Member.aggregate(
    [
      {
        $match: {
          userId: ObjectId(req.params.userId),
          status: "invited",
        },
      },
      {
        $lookup: {
          from: Community.collection.name,
          localField: "groupId",
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
          communityName: 1,
          "community_info.photo": 1,
          status: 1,
          createdAt: 1,
        },
      },
    ],
    (err, data) => {
      if (err) {
        return res.status(400).send({
          message: err.toString(),
        });
      }

      return res.status(200).json(data);
    }
  );
};

exports.getAllInvitesForUser = (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({
      message: "Id params missing",
    });
  }

  Member.find({ userId: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).send({
        message: saveError.toString(),
      });
    }

    return res.status(200).json(data);
  });
};

exports.getAllInvitesForCommunity = (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({
      message: "Id params missing",
    });
  }

  Member.find({ communityId: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).send({
        message: saveError.toString(),
      });
    }

    return res.status(200).json(data);
  });
};

exports.updateInvite = (req, res) => {
  if (!req.params.id) {
    return res.status(400).send({
      message: "Id params missing",
    });
  }

  const error = updateValidation(req.body);
  if (error) {
    return res.status(400).send({
      message: "Invalid payload!" + error.toString(),
    });
  }

  /* let msg = {
    route: "update",
    params: req.params,
    body: req.body,
  };
  kafka.make_request("invite", msg, (err, results) => {
    if (err) {
      return res.status(err.status).send({
        message: err.data,
      });
    }

    return res.status(results.status).send({
      message: "Invite updated successfully",
    });
  }); */

  Member.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    (err, data) => {
      if (err) {
        return res.status(400).send({
          message: saveError.toString(),
        });
      }

      Community.find({ _id: data.communityId })
        .then((communities) => {
          if (communities.length > 0) {
            const community = communities[0];
            if (req.body.status === 'joined') {
              community.numUsers += 1;
            } else if (req.body.status === 'rejected' && community.numUsers > 0) {
              community.numUsers -= 1;
            }

            community.save().then(() => {
              return res.status(200).send({
                message: "Invite update successfully",
              });
            }).catch((error) => {
              return res.status(500).send(error);
            });
          } else {
            return res.status(400).send({
              message: `Community ${req.body.communityName} does not exist`,
            });
          }

        }).catch((error) => {
          return res.status(500).send(error);
        });
    }
  );
};