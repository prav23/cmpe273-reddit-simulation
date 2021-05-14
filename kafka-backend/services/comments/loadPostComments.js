const Comment = require("../../models/comment");

const loadPostComments = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const postId = msg.postId;
        const comments = await Comment.find({ postId});
        if(!comments){
            err.status = 400;
            err.data = "invalid comment id'";
            return callback(err, null);
        }
        results.status = 200;
        results.data = comments;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.loadPostComments = loadPostComments;


