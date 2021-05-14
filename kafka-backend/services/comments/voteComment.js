const Comment = require("../../models/comment");

const voteComment = async(msg, callback) => {
    console.log("In handle request:"+ JSON.stringify(msg));
    let results = {};
    let err = {};
    try{
        const { comment_id, user, vote } = msg.input;
        const voteValue = Number(vote);
        const comment = await Comment.findOne({ _id: comment_id});
        let updateScore;
        if(comment !== null){
            const existingVote = comment.votes.find(item => item.user === user);
            if(existingVote){
                // reset score
                updateScore = comment.score - existingVote.vote;
                if(voteValue === 0){
                    // remove vote
                    comment.votes.pull(existingVote);
                }else{
                    // change vote
                    updateScore = updateScore + voteValue;
                    comment.votes.pull(existingVote);
                    existingVote.vote = voteValue;
                    comment.votes.push(existingVote);
                }
                await Comment.findOneAndUpdate({ "_id": comment_id }, { "$set": { "score": updateScore, "votes": comment.votes }});
            } else if(vote !== 0){
                // new vote
                updateScore = comment.score + voteValue;
                comment.votes.push({ user, vote: voteValue});
                await Comment.findOneAndUpdate({ "_id": comment_id }, { "$set": { "score": updateScore, "votes": comment.votes }});
            }
            results.status = 200;
            results.data = comment;
            return callback(null, results);
            //return res.status(201).json("Successfully voted");
        }
        else{
            err.status = 400;
            err.data = "comment doesnt exist";
            return callback(err, null);
        }
    }catch(error){
        err.status = 400;
        err.data = "Unable to vote post";
        return callback(err, null);
    }
}

exports.voteComment = voteComment;


