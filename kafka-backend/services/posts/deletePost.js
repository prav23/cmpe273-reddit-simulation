const Post = require("../../models/posts");

const deletePost = async(msg, callback) => {
    try{
        console.log("In handle request:"+ JSON.stringify(msg));
        let results = {};
        let err = {};
        const post_id = msg.post_id;
        const post = await Post.findOne({ _id : post_id });
        if(post !== null){
            await Post.deleteOne({ _id : post_id});
            results.status = 200;
            results.data = post;
            return callback(null, results);
        }
        else{
            err.status = 400;
            err.data = "invalid post id";
            return callback(err, null);
        }
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.deletePost = deletePost;