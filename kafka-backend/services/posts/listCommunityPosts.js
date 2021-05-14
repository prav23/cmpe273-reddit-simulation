const Post = require("../../models/posts");

const listCommunityPosts = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const communityName = msg.communityName;
        const posts = await Post.find({communityName}).sort('-score');
        results.status = 200;
        results.data = posts;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
}

exports.listCommunityPosts = listCommunityPosts;


