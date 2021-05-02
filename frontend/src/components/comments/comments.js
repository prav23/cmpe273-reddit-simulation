import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getComments } from '../../actions/commentActions';
import ago from 's-ago';
import axios from "axios";
class Comments extends Component {

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if(isAuthenticated){
      //this.props.getComments();
    }
    const postId = this.props.match.params.postId;
    this.props.getComments(postId);
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { commentsDetails, commentsloading } = this.props.comments;
    const { postsDetails } = this.props.posts;

    console.log(postsDetails);
    let selectedPost;
    if (postsDetails.length > 0)
    selectedPost = postsDetails.filter(post => post._id === this.props.match.params.postId)[0];
    else{
      return "";
    }
    return (
      <div className="posts">
        <div className="row mt-4">
            <div className="col-1">
              <div className="d-flex flex-column ps-5 mt-2">
                <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
                <p className="fs-3 mt-2 pe-1">{selectedPost.score}</p>
                <i data-test="fa" class="fa fa-lg fa-angle-down mt-n1"></i>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{selectedPost.title}</h5>
                  <p className="card-text">{selectedPost.text} </p>
                  <p className="card-text"><a href={`/comments/${selectedPost._id}`}> Comments</a> &nbsp;&nbsp;&nbsp;&nbsp; <span className="fw-lighter fst-italic text-muted">{ago(new Date(selectedPost.createdAt))}</span></p>
                </div>
              </div>
            </div>
          </div>
        {commentsDetails.map(comment => {
          return (
          <div className="row mt-2">
            <div className="col-1">
            </div>
            {comment.parentCommentId === "" && <div className="col-1">
              <div className="d-flex flex-column ps-5 mt-2">
                <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
                <p className="fs-3 mt-2 pe-1">{comment.score}</p>
                <i data-test="fa" class="fa fa-lg fa-angle-down mt-n1"></i>
              </div>
            </div>}
            {comment.parentCommentId !== "" && <div className="col-2">
            </div>}
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{comment.body}</h5>
                  <p className="card-text">{comment.author} </p>
                </div>
              </div>
            </div>
          </div>
        )
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

const mapStateToProps = state => ({
  comments: state.comments,
  auth: state.auth,
  posts: state.posts,
});

export default connect(mapStateToProps, { getComments})(Comments);