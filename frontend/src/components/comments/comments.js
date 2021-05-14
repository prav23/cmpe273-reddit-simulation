import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getComments } from "../../actions/commentActions";
import ago from "s-ago";
import axios from "axios";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { getPosts } from '../../actions/postActions';
import { Link } from 'react-router-dom';
import './comments.css';
const { API_URL } = require("../../utils/Constants").default;

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 2,
      pageNumber: 0,
      postsDetails: this.props.posts.postsDetails,
      newRootCommentText: "",
      newCommentParentId: "",
      newSubCommentText: "",
    };
  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      //this.props.getComments();
    }
    const postId = this.props.match.params.postId;
    this.props.getComments(postId);
    this.props.getPosts();
  }

  // componentWillUpdate(nextProps, nextState){
  //   if(this.state.activatedComment !== nextState.activatedComment){
  //     axios.get(`http://localhost:3001/api/subcomments/${nextState.activatedComment}`).then(response => {
  //       this.setState({subComments: response.data.data.subComments});
  //     })
  //   }
  // }

  submitNewRootComment(postTitle, postId) {
    axios
      .post(`${API_URL}/comments`, {
        postTitle,
        postId,
        body: this.state.newRootCommentText,
        author: this.props.auth.user.name,
      })
      .then((response) => {
        this.setState({ newRootCommentText: "" });
      });
  }

  submitNewSubComment(parentCommentId, postTitle, postId) {
    axios
      .post(`${API_URL}/comments/subcomment`, {
        parentCommentId,
        postTitle,
        postId,
        body: this.state.newSubCommentText,
        author: this.props.auth.user.name,
      })
      .then((response) => {
        this.setState({ newSubCommentText: "" });
      });
  }

  deleteNestedComments(commentId, childrenComments){
    if(childrenComments !== null && childrenComments !== undefined){
      const childrenCommentIds = childrenComments.map(childrenComment => childrenComment._id);
      console.log("childrenCommentIds", childrenCommentIds);
      childrenCommentIds.forEach(childrenCommentId => {
        axios.delete(`${API_URL}/comment/${childrenCommentId}`);
      });
    }
    axios.delete(`${API_URL}/comment/${commentId}`);
  }
  returnNestedComments(parentId, selectedPost, reverseIndexedComments){
    const comments = reverseIndexedComments[parentId];
    if(comments !== null && comments !== undefined){
      return comments.map((comment) => {
        return (<div className="row mt-2">
        <div className="col-3"></div>
        <div className="col">
          <div className="card">
            <div className="card-body">
              <p className="card-text">
                {" "}
                <Link to={`/userprofile`} >
                  {localStorage.setItem("userprofile", comment.author)}
                  {comment.author} &nbsp;{" "}
                </Link>
                <span className="fw-lighter fst-italic text-muted">
                  {ago(new Date(comment.createdAt))}
                </span>
              </p>
              <h5 className="card-title">{comment.body}</h5>
            </div>
          </div>
          <div>
            <input
              type="text"
              maxlength="100"
              class="form-control my-1"
              onChange={(event) =>
                this.setState({ newSubCommentText: event.target.value, newCommentParentId: comment._id })
              }
              placeholder="Reply comment"
              value={this.state.newCommentParentId === comment._id ? this.state.newSubCommentText : ""}
            ></input>
            <button
              type="button"
              onClick={() =>
                this.submitNewSubComment(
                  comment._id,
                  selectedPost.title,
                  selectedPost._id
                )
              }
              class="btn btn-primary"
            >
              Reply Comment
            </button>
            <button
              type="button"
              class="mx-4 btn btn-danger"
              onClick={() => this.deleteNestedComments(comment._id, reverseIndexedComments[comment._id])}
            >
              Delete Comment
            </button>
          </div>
          {reverseIndexedComments[comment._id] && this.returnNestedComments(comment._id, selectedPost, reverseIndexedComments)}
        </div>
      </div>)
      })
    }
  }

  async votePost(vote, selectedPost) {
    const { user } = this.props.auth;

    //let foundPost = allPosts.find(p => p._id === postId);
    if (selectedPost !== undefined) {
      let prevUserVote = selectedPost.votes.find(v => v.user === user.user_id);
      // check users previous vote
      if (prevUserVote !== undefined) {
        // unvote if user clicks on same arrow again
        if (prevUserVote.vote === vote) {
          vote = 0;
        }
      }
    }

    const payload = {
      post_id: selectedPost._id,
      user: user.user_id,
      vote, 
    };
    try {
      await axios.put(`${API_URL}/posts/vote`, payload);
      this.props.getPosts();
    } catch (err) {
      console.log(err);
    }
  }

  async voteComment(vote, comment, post_id) {
    const { user } = this.props.auth;
    //let foundPost = allPosts.find(p => p._id === postId);
    if (comment !== undefined) {
      let prevUserVote = comment.votes.find(v => v.user === user.user_id);
      // check users previous vote
      if (prevUserVote !== undefined) {
        // unvote if user clicks on same arrow again
        if (prevUserVote.vote === vote) {
          vote = 0;
        }
      }
    }
    const payload = {
      comment_id: comment._id,
      user: user.user_id,
      vote, 
    };
    try {
      await axios.put(`${API_URL}/comment/vote`, payload);
      this.props.getComments(post_id);
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { commentsDetails, commentsloading } = this.props.comments;
    const { postsDetails } = this.props.posts;

    console.log(postsDetails);
    let selectedPost;
    if (postsDetails.length > 0)
      selectedPost = postsDetails.filter(
        (post) => post._id === this.props.match.params.postId
      )[0];
    else {
      return "";
    }

    const reverseIndexedComments = {};

    commentsDetails.forEach(comment => {
      const { parentCommentId } = comment;
      if(reverseIndexedComments[parentCommentId] !== undefined){
        reverseIndexedComments[parentCommentId].push(comment);
      } else {
        reverseIndexedComments[parentCommentId] = [comment];
      }
    });

    // checks if user has voted on post
    let upArrowColor = 'gray';
    let downArrowColor = 'gray';
    let numberColor = 'gray';
    //const userVote = selectedPost.votes.find(v => v.user === user.user_id)
    const userVote = selectedPost?.votes.find(v => v.user === user.user_id)
    if (userVote !== undefined) {
      if(userVote.vote === 1){
        upArrowColor = '#ff4500';
        numberColor = '#ff4500';
      } else if(userVote.vote === -1) {
        downArrowColor = 'blue';
        numberColor = 'blue';
      }
    }

    return (
      <div className="posts">
        <div className="row mt-4">
          <div className="col-1 comments__votes">
            <button type="button" value={selectedPost._id} onClick={(e) => this.votePost(1, selectedPost)} className="dashboard__arrow">
              <ArrowUpwardIcon style={{ fontSize: 30, color: upArrowColor }} />        
            </button>
            <span style={{ color: numberColor }}>{selectedPost?.score}</span>
            <button type="button" value={selectedPost._id} onClick={(e) => this.votePost(-1, selectedPost)} className="dashboard__arrow">
              <ArrowDownwardIcon style={{ fontSize: 30, color: downArrowColor }} />
            </button>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  {" "}
                  <Link to={`/communityhome/${selectedPost.communityName}`}>
                    <span className="post__community">{`r/${selectedPost.communityName}`} &nbsp; </span>
                  </Link>
                  <Link to={`/userprofile`} >
                    Posted by u/
                    {localStorage.setItem("userprofile", selectedPost.author)}
                    {selectedPost.author} &nbsp;{" "}
                  </Link>
                  <span className="fw-lighter fst-italic text-muted">
                    {ago(new Date(selectedPost.createdAt))}
                  </span>
                </p>
                <h5 className="card-title">{selectedPost.title}</h5>
                <p className="card-text">{selectedPost.text} </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-1 comments__votes"> </div>
          <div className="col">
            <div>
              <input
                type="text"
                maxlength="100"
                class="form-control my-2"
                onChange={(event) =>
                  this.setState({ newRootCommentText: event.target.value })
                }
                placeholder="Enter post comment"
                value={this.state.newRootCommentText}
              ></input>
              <button
                type="button"
                onClick={() =>
                  this.submitNewRootComment(
                    selectedPost.title,
                    selectedPost._id
                  )
                }
                class="btn btn-primary"
              >
                Comment Post
              </button>
            </div>
          </div>
        </div>
        {commentsDetails.map((comment) => {
          // checks if user has voted on comment
          let upArrowColorComment = 'gray';
          let downArrowColorComment = 'gray';
          let numberColorComment = 'gray';
          const userVoteComment = comment.votes.find(v => v.user === user.user_id)
          if (userVoteComment !== undefined) {
            if(userVoteComment.vote === 1){
              upArrowColorComment = '#ff4500';
              numberColorComment = '#ff4500';
            } else if(userVoteComment.vote === -1) {
              downArrowColorComment = 'blue';
              numberColorComment = 'blue';
            }
          }
          return (
            <div className="row mt-2">
              <div className="col-1"></div>
              {comment.parentCommentId === "" && (
                <div className="col-1 comments__votes">
                  <button type="button" value={comment._id} onClick={(e) => this.voteComment(1, comment, selectedPost._id)} className="dashboard__arrow">
                    <ArrowUpwardIcon style={{ fontSize: 30, color: upArrowColorComment }} />        
                  </button>
                  <span style={{ color: numberColorComment }}>{comment?.score}</span>
                  <button type="button" value={comment._id} onClick={(e) => this.voteComment(-1, comment, selectedPost._id)} className="dashboard__arrow">
                    <ArrowDownwardIcon style={{ fontSize: 30, color: downArrowColorComment }} />
                  </button>
              </div>
              )}
              {comment.parentCommentId === "" && (
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        {" "}
                        <Link to={`/userprofile`} >
                          {localStorage.setItem("userprofile", comment.author)}
                          {comment.author} &nbsp;{" "}
                        </Link>
                        <span className="fw-lighter fst-italic text-muted">
                          {ago(new Date(comment.createdAt))}
                        </span>
                      </p>
                      <h5 className="card-title">{comment.body}</h5>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      maxlength="100"
                      class="form-control my-2"
                      onChange={(event) =>
                        this.setState({ newSubCommentText: event.target.value, newCommentParentId: comment._id })
                      }
                      placeholder="Reply comment"
                      value={this.state.newCommentParentId === comment._id ? this.state.newSubCommentText : ""}
                    ></input>
                    <button
                      type="button"
                      onClick={() =>
                        this.submitNewSubComment(
                          comment._id,
                          selectedPost.title,
                          selectedPost._id
                        )
                      }
                      class="btn btn-primary"
                    >
                      Reply Comment
                    </button>
                    <button
                      type="button"
                      class="mx-4 btn btn-danger"
                      onClick={() => this.deleteNestedComments(comment._id, reverseIndexedComments[comment._id])}
                    >
                      Delete Comment
                    </button>
                  </div>
                  {this.returnNestedComments(comment._id, selectedPost, reverseIndexedComments)}
                </div>

              )}
            </div>
          );
        })}
      </div>
    );
  }
}

Comments.propTypes = {
  getComments: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  comments: state.comments,
  auth: state.auth,
  posts: state.posts,
});

export default connect(mapStateToProps, { getComments, getPosts })(Comments);
