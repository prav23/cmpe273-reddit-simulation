const Member = require("../../models/member");
const Community = require("../../models/community");
const Post = require("../../models/posts");

const voteCommunity = async (msg, callback) => {
    const results = {};
    const err = {};
    try{
        const { community_id, user, vote } = msg.body;
        const voteValue = Number(vote);
        const community = await Community.findOne({ _id: community_id});
        let updateScore;
        if(community !== null){
            const existingVote = community.votes.find(item => item.user === user);
            let retCommunity = null;
            if(existingVote){
                // reset score
                updateScore = community.score - existingVote.vote;
                if(voteValue === 0){
                    // remove vote
                    community.votes.pull(existingVote);
                }else{
                    // change vote
                    updateScore = updateScore + voteValue;
                    community.votes.pull(existingVote);
                    existingVote.vote = voteValue;
                    community.votes.push(existingVote);
                }
                retCommunity = await Community.findOneAndUpdate({ "_id": community_id }, { "$set": { "score": updateScore, "votes": community.votes } }, { new: true });
            } else if(vote !== 0){
                // new vote
                updateScore = community.score + voteValue;
                community.votes.push({ user, vote: voteValue});
                retCommunity = await Community.findOneAndUpdate({ "_id": community_id }, { "$set": { "score": updateScore, "votes": community.votes } }, { new: true });
            }
            
            results.status = 200;
            results.data = retCommunity;
            return callback(null, results);
        }
        else{
            throw new Error("Community doesnt exist");
        }
    }catch(error){
        err.status = 500;
        err.data = "Unable to vote on community";
        return callback(err, null);    
    }
};

exports.voteCommunity = voteCommunity;