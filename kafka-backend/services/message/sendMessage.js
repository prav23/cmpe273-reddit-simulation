const { Message } = require("../../sqlmodels/index");

const sendMessage = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  let results = {};
  let err = {};
  try{
    const { receivedBy, sentBy, message } = msg.input;
    var payload = {
        receivedBy: receivedBy,
        sentBy: sentBy,
        message: message
    };
    const newMessage = await Message.create(payload);
    results.status = 200;
    results.data = newMessage;
    return callback(null, results);
  }catch(error){
    err.status = 400;
    err.data = "Unable to send messages";
    return callback(err, null);
  }
};

exports.sendMessage = sendMessage;