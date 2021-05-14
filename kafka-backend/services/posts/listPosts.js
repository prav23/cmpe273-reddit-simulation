const Post = require("../../models/posts");

const listPosts = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const posts = await Post.find({}).sort('-score');
        results.status = 200;
        results.data = posts;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.listPosts = listPosts;


