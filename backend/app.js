const express = require("express");
const bodyParser = require("body-parser");
const methodOveride = require("method-override");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("./utils/keys");
const passport = require("passport");
const mongoose = require("mongoose");
const { mlab_db, frontendURI } = require("./utils/config");
const cors = require("cors");

const apiRoutes = require("./api");
const app = express();
// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOveride("_method"));
//use cors to allow cross origin resource sharing
app.use(cors({ origin: frontendURI, credentials: true }));
app.use("/api", apiRoutes);
app.use(passport.initialize());
//Passport config
require("./utils/passport")(passport);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", frontendURI);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  // res.setHeader('Cache-Control', 'no-cache');
  next();
});

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
  useCreateIndex: true,
};

mongoose.set("useFindAndModify", false);
mongoose
  .connect(mlab_db, options)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

var db = mongoose.connection;
if (!db) console.log("Error connecting to db");
else console.log("Db connected successfully");

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
  const port = process.env.APP_PORT || 3001;

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost.com:${port}`);
  });
};

setUpExpress();
