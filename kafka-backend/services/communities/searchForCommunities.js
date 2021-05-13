const Member = require("../../models/member");
const Community = require("../../models/community");
const Post = require("../../models/posts");

const searchForCommunities = async (msg, callback) => {
    const results = {};
    const err = {};

    if(!msg.q){
        err.status = 400;
        err.data = "search query required";
        return callback(err, null);
      }
    
      try {
        const communities = await Community.find(
          { name: { $regex: msg.q, $options: "i" }, },
          null,
          { sort: { createdAt: -1 } },
        );
    
        /*
        const returnedCommunities = [];
        communities.forEach(async(c) => {
          try {
            const posts = await Post.find({ communityName: c.name });  
            console.log(posts);
            let totalScore = 0;
            posts.forEach(p => {
              totalScore += p.score;
            });
            returnedCommunities.push({
              upvotedPosts: totalScore,
              _id: c._id,
              name: c.name,
              description: c.description,
              photo: c.photo,
              createdBy: c.createdBy,
              numUsers: c.numUsers,
              numPosts: c.numPosts,
              rules: c.rules,
              createdAt: c.createdAt,
              updatedAt: c.updatedAt,
              score: c.score,
              votes: c.votes,
            });
          } catch (e) {
            console.log(e);
          }
        });
        */
        results.status = 200;
        results.data = communities;
        return callback(null, results);
      } catch (e) {
        err.status = 500;
        err.data = "error in searching";
        return callback(err, null);
      }
};

exports.searchForCommunities = searchForCommunities;