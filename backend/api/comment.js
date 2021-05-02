const Comment = require("../models/comment");

const createRootComment = async (req, res) => {
    try {
        // TODO: Input Validation
        //const validateCreateComment = require("../validation/comment");
        const { author, postTitle, votes, body } = req.body;
        const comment = await Comment.create({
            author,
            postTitle,
            votes,
            body,
        });
        return res.status(201).json(comment);
      } catch (error) {
        return res.status(400).json(error.message);
      }
};

const createSubComment = async (req, res) => {
    try {
        // TODO: Input Validation
        //const validatecreateSubComment = require("../validation/comment");
        const { author, postTitle, votes, body, parentCommentId } = req.body;
        const comment = await Comment.create({
            author,
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
        const { parentCommentId, user, vote } = req.body;
        const parentComment = await Comment.findOne({ parentCommentId});
        if( parentComment !== null ){
            const existingVote = parentComment.votes.find(item => item.user.equals(user));
            if(existingVote){
                // reset score
                parentComment.score = parentComment.score - existingVote.vote;
                if(vote === 0){
                    // remove vote
                    parentComment.votes.pull(existingVote);
                }else{
                    // change vote
                    parentComment.score = parentComment.score + vote;
                    existingVote.vote = vote;
                }
            } else if(vote !== 0){
                // new vote
                parentComment.score += vote;
                parentComment.votes.push({ user, vote});
            }
            await parentComment.update({ score, votes });
            return res.status(201).json(post);
        }
        else{
            throw new Error("Post doesnt exist");
        }
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const load = async(req, res) => {
    try{
        const comment_id = req.params.comment_id;
        const comment = await Comment.find({ _id : comment_id });
        if(!comment){
            return res.status(400).json({ message : 'invalid comment id'});
        }
        return res.status(200).json(post);
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const deleteComment = async(req, res) => {
    try{
        const comment_id = req.params.comment_id;
        const comment = await Comment.findOne({ _id : comment_id });
        if(comment !== null){
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
