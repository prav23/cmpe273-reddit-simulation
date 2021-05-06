const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const faker = require('faker');

const createUsers = (msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const userCount = Number(msg.input);
        for (i = 0; i < userCount; i++) {
          const name = faker.name.findName(); 
          const email = faker.internet.email();
          const password = faker.random.word();
          const profilePicture = faker.internet.avatar();
          const gender = faker.name.gender();
          const location = faker.address.city();
          const description = faker.random.word();
          User.findOne({ email: email }).then(user => {
            if (user) {
                err.status = 400;
                err.data = "Email already exists";
                return callback(err, null);
            } else {
              const newUser = new User({
                name,
                email,
                profilePicture,
                gender,
                location,
                description
              });
              
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                  if (err) {
                    err.status = 500;
                    err.data = "Error";
                    return callback(err, null);
                  }
                  newUser.password = hash;
                  newUser.save();
                });
              });
            }
          });
        }
        results.status = 200;
        results.data = "Created Fake Users";
        return callback(null, results);
    }
    catch(error){
        err.status = 400;
        err.data = "Email already exists";
        return callback(err, null);
    }
};

exports.createUsers = createUsers;