const Member = require("../../models/member");
const Community = require("../../models/community");
const Post = require("../../models/posts");

// get community posts for user dashboard
const getDashboard = async(msg, callback) => {
    const results = {};
    const err = {};

    if(!msg.user_id){
      err.status = 400;
      err.data = "Unable to get dashboard, user required";
      return callback(err, null);
    }
  
    try {
      // get Member (communities that user is a part of)
      const userIsMemberOf = await Member.find(
        { userId: msg.user_id, status: "joined" },
      );
      
      // get community names array from Member
      const communityNames = userIsMemberOf.map((u) => u.communityName);
  
      // get posts that have the same community name
      const posts = await Post.find(
        { communityName: { $in: communityNames } },
        null,
        { sort: { createdAt: -1 } },
      );
  
      // get # of users in community
      const communities = await Community.find();
      
      const retPosts = [];
      posts.forEach((p) => {
        let community = communities.find(c => c.name === p.communityName);
        
        retPosts.push({
          _id: p._id,
          postType: p.postType,
          url: p.url,
          text: p.text,
          image: p.image,
          score: p.score,
          numComments: p.numComments,
          communityName: p.communityName,
          author: p.author,
          title: p.title,
          votes: p.votes,
          createdAt: p.createdAt,
          numCommunityUsers: community.numUsers,
          __v: p.__v,
        });
      });

      results.status = 200;
      results.data = retPosts;
      return callback(null, results);
    } catch (e) {
        err.status = 500;
        err.data = "Unable to get dashboard";
        return callback(err, null);
    }
};

exports.getDashboard = getDashboard;