const Post = require("../../models/posts");

const votePost = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const { post_id, user, vote } = msg.input;
        const voteValue = Number(vote);
        const post = await Post.findOne({ _id: post_id});
        let updateScore;
        if(post !== null){
            const existingVote = post.votes.find(item => item.user === user);
            if(existingVote){
                // reset score
                updateScore = post.score - existingVote.vote;
                if(voteValue === 0){
                    // remove vote
                    post.votes.pull(existingVote);
                }else{
                    // change vote
                    updateScore = updateScore + voteValue;
                    post.votes.pull(existingVote);
                    existingVote.vote = voteValue;
                    post.votes.push(existingVote);
                }
                await Post.findOneAndUpdate({ "_id": post_id }, { "$set": { "score": updateScore, "votes": post.votes }});
            } else if(vote !== 0){
                // new vote
                updateScore = post.score + voteValue;
                post.votes.push({ user, vote: voteValue});
                await Post.findOneAndUpdate({ "_id": post_id }, { "$set": { "score": updateScore, "votes": post.votes }});
            }
            results.status = 200;
            results.data = post;
            return callback(null, results);
            //return res.status(201).json("Successfully voted");
        }
        else{
            err.status = 400;
            err.data = "post doesnt exist";
            return callback(err, null);
        }
    }catch(error){
        err.status = 400;
        err.data = "Unable to vote post";
        return callback(err, null);
    }
}

exports.votePost = votePost;


