const Post = require("../../models/posts");

const loadPost = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const post_id = msg.post_id;
        const post = await Post.find({ _id : post_id }).sort('-score');
        results.status = 200;
        results.data = post;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.loadPost = loadPost;


