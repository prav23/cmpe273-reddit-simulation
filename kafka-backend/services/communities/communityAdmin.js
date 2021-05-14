const Community = require("../../models/community");
const Member = require("../../models/member");

const createCommunity = async(msg, callback) => {
  const existingComm = await Community.find({ name: msg.community.name }).exec();

  if (existingComm.length === 0) {
    const newComm = new Community(msg.community);
    await newComm.save();

    const member = new Member(msg.member);
    member.communityId = newComm._id;
    await member.save();

    return callback(null, newComm);
  }

  return callback(null, existingComm);
}

module.exports = {
  createCommunity
}
