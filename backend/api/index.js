const express = require('express');
const passport = require("passport");
const user = require('./users');

const router = express.Router();

router.post('/login', user.login);
router.post('/register', user.register);
router.get('/users/:id', passport.authenticate("jwt", { session: false }), user.findUser);
router.get('/users', passport.authenticate("jwt", { session: false }), user.findAllUsers);

module.exports = router;