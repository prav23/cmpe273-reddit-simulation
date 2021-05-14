const Comment = require("../../models/comment");

const createRootComment = async (msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const { author, postId, postTitle, votes, body } = msg.input;
        const comment = await Comment.create({
            author,
            postTitle,
            postId,
            votes,
            body,
        });

        // increase comment count
        const post = await Post.findOne({ _id: postId });
        post.numComments += 1;
        await post.save();

        results.status = 200;
        results.data = comment;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
};

exports.createRootComment = createRootComment;