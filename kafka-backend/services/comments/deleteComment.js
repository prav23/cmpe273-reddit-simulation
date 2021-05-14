const Comment = require("../../models/comment");

const deleteComment = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        console.log(msg);
        const comment_id = msg.comment_id;
        console.log("i am here");
        console.log(comment_id);
        const comment = await Comment.findOne({ _id : comment_id });
        if(comment !== null){
            // decrease comment count in post (if root comment)
            if (comment.parentCommentId === "") {
                const post = await Post.findOne({ _id: comment.postId });
                post.numComments -= 1;
                await post.save();
            }
            
            await Comment.deleteOne({ _id : comment_id});
            results.status = 200;
            results.data = "deleted comment";
            return callback(null, results);
        }
        else{
            err.status = 400;
            err.data = "invalid comment id";
            return callback(err, null);
        }
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.deleteComment = deleteComment;