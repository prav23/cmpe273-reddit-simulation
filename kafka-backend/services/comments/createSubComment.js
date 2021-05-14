const Comment = require("../../models/comment");

const createSubComment = async (msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const { author, postId, postTitle, votes, body, parentCommentId } = msg.input;
        const comment = await Comment.create({
            author,
            postId,
            postTitle,
            votes,
            body,
            parentCommentId,
        });

        results.status = 200;
        results.data = comment;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
};

exports.createSubComment = createSubComment;