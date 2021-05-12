import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getComments } from "../../actions/commentActions";
import ago from "s-ago";
import axios from "axios";
const { API_URL } = require("../../utils/Constants").default;

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSize: 2,
      pageNumber: 0,
      activatedExpense: null,
      newRootCommentText: "",
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
        // const oldExpenseId = this.state.activatedExpense;
        // this.setState({activatedExpense: null}, () =>{
        //   this.setState({activatedExpense: oldExpenseId});
        // })
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
        // const oldExpenseId = this.state.activatedExpense;
        // this.setState({activatedExpense: null}, () =>{
        //   this.setState({activatedExpense: oldExpenseId});
        // })
      });
  }

  render() {
    const { isAuthenticated } = this.props.auth;
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
    return (
      <div className="posts">
        <div className="row mt-4">
          <div className="col-3">
            <div className="d-flex flex-column ps-5 mt-2">
              <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
              <p className="fs-3 mt-2 pe-1">{selectedPost.score}</p>
              <i data-test="fa" class="fa fa-lg fa-angle-down mt-n1"></i>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <p className="card-text">
                  {" "}
                  /r/{selectedPost.communityName} &nbsp; Posted by u/
                  {selectedPost.author} &nbsp;{" "}
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
        <div className="row mt-4">
          <div className="col-1"> </div>
          <div className="col">
            <div>
              <input
                type="text"
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
          return (
            <div className="row mt-2">
              <div className="col-1"></div>
              {comment.parentCommentId === "" && (
                <div className="col-1">
                  <div className="d-flex flex-column ps-5 mt-2">
                    <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
                    <p className="fs-3 mt-2 pe-1">{comment.score}</p>
                    <i data-test="fa" class="fa fa-lg fa-angle-down mt-n1"></i>
                  </div>
                </div>
              )}
              {comment.parentCommentId === "" && (
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        {" "}
                        {comment.author} &nbsp;{" "}
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
                      class="form-control my-2"
                      onChange={(event) =>
                        this.setState({ newSubCommentText: event.target.value })
                      }
                      placeholder="Reply comment"
                      value={this.state.newSubCommentText}
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
                  </div>
                </div>
              )}
              {comment.parentCommentId !== "" && (
                <div className="row mt-2">
                  <div className="col-3"></div>
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {" "}
                          {comment.author} &nbsp;{" "}
                          <span className="fw-lighter fst-italic text-muted">
                            {ago(new Date(comment.createdAt))}
                          </span>
                        </p>
                        <h5 className="card-title">{comment.body}</h5>
                      </div>
                    </div>
                  </div>
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

export default connect(mapStateToProps, { getComments })(Comments);
