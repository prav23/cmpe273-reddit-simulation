import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/postActions';
import ago from 's-ago';
import { Link } from 'react-router-dom';

class Landing extends Component {
  componentDidMount() {
    // if (this.props.auth.isAuthenticated) {
    //   this.props.history.push("/dashboard");
    // }
    this.props.logoutUser();
    this.props.getPosts();
  }

  render() {
    const { postsDetails } = this.props.posts;

    return (
      <div className="posts">
        {postsDetails.map(post => {
          return (
          <div className="row mt-4">
            <div className="col-1">
              <div className="d-flex flex-column ps-5 mt-2">
                <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
                <p className="fs-3 mt-2 pe-1">{post.score}</p>
                <i data-test="fa" class="fa fa-lg fa-angle-down mt-n1"></i>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <p className="card-text"> /r/{post.communityName} &nbsp; Posted by u/{post.author} &nbsp; <span className="fw-lighter fst-italic text-muted">{ago(new Date(post.createdAt))}</span></p>
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.text} </p>
                  <p className="card-text"><Link to={`/comments/${post._id}`}> Comments</Link></p>
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


Landing.propTypes = {
  getPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps , { logoutUser, getPosts })(Landing);
