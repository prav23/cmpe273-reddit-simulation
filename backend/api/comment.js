const Comment = require("../models/comment");
const Post = require("../models/post");

const createRootComment = async (req, res) => {
    try {
        // TODO: Input Validation
        //const validateCreateComment = require("../validation/comment");
        const { author, postId, postTitle, votes, body } = req.body;
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

        return res.status(201).json(comment);
      } catch (error) {
        return res.status(400).json(error.message);
      }
};

const createSubComment = async (req, res) => {
    try {
        // TODO: Input Validation
        //const validatecreateSubComment = require("../validation/comment");
        const { author, postId, postTitle, votes, body, parentCommentId } = req.body;
        const comment = await Comment.create({
            author,
            postId,
            postTitle,
            votes,
            body,
            parentCommentId,
        });
        return res.status(201).json(comment);
      } catch (error) {
        return res.status(400).json(error.message);
      }
};

const voteComment = async(req, res) => { 
    try{
        const { comment_id, user, vote } = req.body;
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
            return res.status(201).json("Successfully voted");
        }
        else{
            throw new Error("Comment doesnt exist");
        }
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const load = async(req, res) => {
    try{
        const postId = req.params.postId;
        const comments = await Comment.find({ postId});
        if(!comments){
            return res.status(400).json({ message : 'invalid comment id'});
        }
        return res.status(200).json(comments);
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const deleteComment = async(req, res) => {
    try{
        const comment_id = msg.comment_id;
        const comment = await Comment.findOne({ _id : comment_id });
        if(comment !== null){
            // decrease comment count in post (if root comment)
            if (comment.parentCommentId === "") {
                const post = await Post.findOne({ _id: comment.postId });
                post.numComments -= 1;
                await post.save();
            }
            
            await Comment.deleteOne({ _id : comment_id});
            return res.status(200).json(comment);
        }
        else{
            return res.status(400).json({ message : 'invalid comment id'});
        }
    }catch(error){
        return res.status(400).json(error.message);
    }
}

module.exports = {createRootComment, createSubComment, deleteComment, load, voteComment};
