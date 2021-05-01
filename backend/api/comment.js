const Comment = require("../models/comment");

// TODO: Input Validation
//const validateCreateComment = require("../validation/comment");

module.exports = {createRootComment, createSubComment, destroy, load, upvoteComment, downvoteComment, unvoteComment};
