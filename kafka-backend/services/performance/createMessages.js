const { Message } = require("../../sqlmodels/index");
const faker = require('faker');

const createMessages = async (msg, callback) => {
  console.log("In handle request:"+ JSON.stringify(msg));
  let results = {};
  let err = {};
  try{
    const messageCount = Number(msg.input);
    for (i = 0; i < messageCount; i++) {
      const sentBy = faker.internet.email(); 
      const receivedBy = faker.internet.email();
      const message = faker.random.word();
      const payload = {
          receivedBy,
          sentBy,
          message
      };
      const newMessage = await Message.create(payload);
    }
    results.status = 200;
    results.data = "Created Fake Messages";
    return callback(null, results);
  }
  catch(error){
    err.status = 400;
    err.data = "Error";
    console.log(error);
    return callback(err, null);
  }
};

exports.createMessages = createMessages;