const { successResponse, errorResponse } = require("./helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../utils/keys");

// Input Validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const login = async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, email: user.email }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
};

const register = async (req, res) => {
  //const errors = {};
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
};

const findAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        if (allUsers) {
          return successResponse(req, res, { allUsers });
        } else {
          return errorResponse(
            req,
            res,
            "Unable to find an users",
            401
          );
        }
      } catch (error) {
        return errorResponse(req, res, error.message);
      }
};

const findUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ _id : id});
        if (user !== null) {
          return successResponse(req, res, { user });
        } else {
          return errorResponse(
            req,
            res,
            "Unable to find an users",
            401
          );
        }
      } catch (error) {
        return errorResponse(req, res, error.message);
      }
};

module.exports = {login, register, findAllUsers, findUser};

