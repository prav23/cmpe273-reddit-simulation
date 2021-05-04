import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPosts } from '../../actions/postActions';
import ago from 's-ago';
import { Link } from 'react-router-dom';

class Posts extends Component {
  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if(isAuthenticated){
      //this.props.getPosts();
    }
    this.props.getPosts();
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    const { postsDetails, postsloading } = this.props.posts;

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
                  {post.image !== "" && <img style = {{width:"400px",height:"400px"}} src={post.image} class="img-thumbnail" alt="..."/>}
                  {post.url !== "" && <iframe id={post._id} src= {post.url} width="400" height="400"></iframe>}
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

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth,
});

export default connect(mapStateToProps, { getPosts})(Posts);