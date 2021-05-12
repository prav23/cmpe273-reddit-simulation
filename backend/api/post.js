const { connections } = require("mongoose");
const Post = require("../models/post");

const create = async (req, res) => {
    try {
        // TODO: Input Validation
        //const validateCreatePost = require("../validation/post");
        const { communityName, author, title, votes, postType, url, text, image } = req.body;
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
        return res.status(201).json(post);
      } catch (error) {
        return res.status(400).json(error.message);
      }
};

const votePost = async(req, res) => { 
    try{
        const { post_id, user, vote } = req.body;
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
            
            return res.status(201).json("Successfully voted");
        }
        else{
            throw new Error("Post doesnt exist");
        }
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const list = async(req, res) => { 
    try{
        const posts = await Post.find().sort('-score');
        return res.status(200).json(posts);
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const listByCommunity = async(req, res) => { 
    try{
        const communityName = req.params.communityName;
        const posts = await Post.find({communityName}).sort('-score');
        return res.status(200).json(posts);
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const load = async(req, res) => {
    try{
        const post_id = req.params.post_id;
        const post = await Post.find({ _id : post_id });
        if(!post){
            return res.status(400).json({ message : 'invalid post id'});
        }
        return res.status(200).json(post);
    }catch(error){
        return res.status(400).json(error.message);
    }
}

const deletePost = async(req, res) => {
    try{
        const post_id = req.params.post_id;
        const post = await Post.findOne({ _id : post_id });
        if(post !== null){
            await Post.deleteOne({ _id : post_id});
            return res.status(200).json(post);
        }
        else{
            return res.status(400).json({ message : 'invalid post id'});
        }
    }catch(error){
        return res.status(400).json(error.message);
    }
}
module.exports = {create, list, listByCommunity, load, deletePost, votePost};
