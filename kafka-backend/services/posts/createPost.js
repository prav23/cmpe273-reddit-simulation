const Post = require("../../models/posts");

const create = async (msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const { communityName, author, title, votes, postType, url, text, image } = msg.input;
        const post = await Post.create({
            communityName,
            author,
            title,
            votes,
            postType,
            url,
            text,
            image
        });
        results.status = 200;
        results.data = post;
        return callback(null, results);
    }catch(error){
        err.status = 400;
        err.data = "Unable to send messages";
        return callback(err, null);
    }
};

exports.create = create;