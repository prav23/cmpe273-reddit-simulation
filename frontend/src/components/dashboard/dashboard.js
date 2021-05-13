import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { getDashboardDetails } from "../../actions/dashboardActions";
import ago from "s-ago";
import { Link } from "react-router-dom";
import Select from "react-dropdown-select";
import ReactPaginate from "react-paginate";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CommentIcon from '@material-ui/icons/Comment';
import setAuthToken from '../../utils/setAuthToken';
import './dashboard.css';

const { API_URL } = require('../../utils/Constants').default;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);

    this.state ={
      allPosts: [],
      searchQuery: "",
      currentPage: 0,
      pageCount: 0,
      currentSortBy: "created",
      currentSortOpt: "asc",
      currentPageSize: 2,
      sortBy: [
        { label: "created at", value: "created" },
        { label: "most users", value: "users" },
        { label: "most comments", value: "comments" },
        { label: "most upvoted posts", value: "upvotedposts" },
      ],
      sortOptions: [
        { label: "ascending", value: "asc" }, 
        { label: "descending", value: "desc" },
      ],
      pageSizeOpts: [
        { label: "2", value: 2 }, 
        { label: "5", value: 5 },
        { label: "10", value: 10 }, 
      ]
    };
  }

  componentDidMount() {
    const { isAuthenticated, user } = this.props.auth;
    if (isAuthenticated) {
      this.props.getDashboardDetails(user.user_id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevProps.dashboard.dashboardDetails !== this.props.dashboard.dashboardDetails){
      const { currentPageSize } = this.state;
      this.setState({
        allPosts: this.props.dashboard.dashboardDetails,
        pageCount: Math.ceil(this.props.dashboard.dashboardDetails.length/currentPageSize),
      }, () => {
        console.log(this.state.pageCount);
      });
    }
  }

  searchPosts = (e) => {
    this.setState({
      searchQuery: e.target.value,
    });
  }

  setSortBy = (values) => {
    const { allPosts } = this.state;
    let temp = allPosts;
    if (values[0].value === "created") {
      temp = temp.sort(this.sortByCreatedAt);
    } else if (values[0].value === "users") {
      temp = temp.sort(this.sortByMostUsers);
    } else if (values[0].value === "comments") {
      temp = temp.sort(this.sortByMostComments);
    } else if (values[0].value === "upvotedposts") {
      temp = temp.sort(this.sortByMostUpvotedPosts);
    }
    
    this.setState({
      currentSortBy: values[0].value,
      allPosts: temp
    });
  }

  setSortOptions = (values) => {
    const { allPosts } = this.state;
    let temp = allPosts;
    if (values[0].value === "asc") {
      temp = temp.sort(this.sortByAscending);
    } else if (values[0].value === "desc") {
      temp = temp.sort(this.sortByDescending);
    } 

    this.setState({
      currentSortOpt: values[0].value,
      allPosts: temp,
    });
  }

  sortByCreatedAt = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.createdAt < b.createdAt) { return 1; }
      if (a.createdAt > b.createdAt) { return -1; }
      return 0;
    } else {
      if (a.createdAt < b.createdAt) { return -1; }
      if (a.createdAt > b.createdAt) { return 1; }
      return 0;
    }
  }

  sortByMostUpvotedPosts = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.score < b.score) { return -1; }
      if (a.score > b.score) { return 1; }
      return 0;
    } else {
      if (a.score < b.score) { return 1; }
      if (a.score > b.score) { return -1; }
      return 0;
    }
  }

  sortByMostUsers = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.numCommunityUsers < b.numCommunityUsers) { return -1; }
      if (a.numCommunityUsers > b.numCommunityUsers) { return 1; }
      return 0;
    } else {
      if (a.numCommunityUsers < b.numCommunityUsers) { return 1; }
      if (a.numCommunityUsers > b.numCommunityUsers) { return -1; }
      return 0;
    }
  }

  sortByMostComments = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.numComments < b.numComments) { return -1; }
      if (a.numComments > b.numComments) { return 1; }
      return 0;
    } else {
      if (a.numComments < b.numComments) { return 1; }
      if (a.numComments > b.numComments) { return -1; }
      return 0;
    }
  }

  sortByAscending = (a, b) => {
    const { currentSortBy } = this.state;
    if(currentSortBy === "created") {
      if (a.createdAt < b.createdAt) { return 1; }
      if (a.createdAt > b.createdAt) { return -1; }
      return 0;
    } else if(currentSortBy === "users"){
      if (a.numCommunityUsers < b.numCommunityUsers) { return -1; }
      if (a.numCommunityUsers > b.numCommunityUsers) { return 1; }
      return 0;
    } else if(currentSortBy === "comments"){
      if (a.numComments < b.numComments) { return -1; }
      if (a.numComments > b.numComments) { return 1; }
      return 0;
    } else if(currentSortBy === "upvotedposts"){
      if (a.score < b.score) { return -1; }
      if (a.score > b.score) { return 1; }
      return 0;
    }
  }

  sortByDescending = (a, b) => {
    const { currentSortBy } = this.state;
    if(currentSortBy === "created") {
      if (a.createdAt < b.createdAt) { return -1; }
      if (a.createdAt > b.createdAt) { return 1; }
      return 0;
    } else if(currentSortBy === "users"){
      if (a.numCommunityUsers < b.numCommunityUsers) { return 1; }
      if (a.numCommunityUsers > b.numCommunityUsers) { return -1; }
      return 0;
    } else if(currentSortBy === "comments"){
      if (a.numComments < b.numComments) { return 1; }
      if (a.numComments > b.numComments) { return -1; }
      return 0;
    } else if(currentSortBy === "upvotedposts"){
      if (a.score < b.score) { return 1; }
      if (a.score > b.score) { return -1; }
      return 0;
    }
  }

  setPageSize = (values) => {
    const { allPosts, currentPageSize, currentPage } = this.state;
    this.setState({
      currentPageSize: values[0].value,
      pageCount: Math.ceil(allPosts.length / values[0].value),
      currentPage: (currentPage * currentPageSize) / values[0].value,
    });
  }

  handlePageClick= (selectedPage) => {
    this.setState({ 
      currentPage: selectedPage.selected
    });
  }

  async votePost(postId, vote) {
    const { user } = this.props.auth;
    const { allPosts } = this.state;
    let foundPost = allPosts.find(p => p._id === postId);
    if (foundPost !== undefined) {
      let prevUserVote = foundPost.votes.find(v => v.user === user.user_id);
      // check users previous vote
      if (prevUserVote !== undefined) {
        // unvote if user clicks on same arrow again
        if (prevUserVote.vote === vote) {
          vote = 0;
        }
      }
    }

    const payload = {
      post_id: postId,
      user: user.user_id,
      vote, 
    };
    try {
      await axios.put(`${API_URL}/posts/vote`, payload);
      const updatedPost = await axios.get(`${API_URL}/post/${postId}`);
      
      let postIndex = allPosts.findIndex(p => p._id === updatedPost.data[0]._id);
      let allPostsCopy = [...allPosts];
      allPostsCopy[postIndex] = updatedPost.data[0];
      this.setState({
        allPosts: allPostsCopy,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;  
    const { dashboardLoading } = this.props.dashboard;
    const {
      sortBy,
      sortOptions,
      pageSizeOpts,
      searchQuery,
      allPosts,
      pageCount,
      currentPage,
      currentPageSize,
    } = this.state;

    return (

      isAuthenticated && <div className="dashboard__body">
        <div className="dashboard__filters">
          <span className="dashboard__sortbytext">Sort By</span>
          <Select options={sortBy} values={[sortBy.find(op=>op.label === "created at")]} searchable={false} onChange={values => this.setSortBy(values)} className="dashboard__sortby" />
          <Select options={sortOptions} values={[sortOptions.find(op=>op.label === "ascending")]} searchable={false} onChange={values => this.setSortOptions(values)} className="dashboard__sortby" />
          <span className="dashboard__pagesizetext">Page Size</span>
          <Select options={pageSizeOpts} values={[pageSizeOpts.find(op=>op.label === "2")]} searchable={false} onChange={values => this.setPageSize(values)} className="dashboard__sortby" />
        </div>
        <div className="dashboard__searchbar">
          <label className="dashboard__sortbytext">Search Posts</label>
          <input type="text" placeholder="e.g. workout, dogs, etc." className="dashboard__input" onChange={this.searchPosts} />
        </div>
        {
          dashboardLoading
          ? <div>
              <span className="dashboard__loading">LOADING...</span>
            </div>
          : null
        }

        {
          allPosts.length === 0 && !dashboardLoading
          ? <div>
              <span className="dashboard__none">No Posts to show! Join a community to see posts!</span>
            </div>
          : null
        }
        
        {allPosts?.filter(
          (p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(currentPage*currentPageSize, currentPage*currentPageSize+currentPageSize)
        .map(post => {
          // determines post size based on post type
          let postClass = "dashboard__textpost";
          if(post.postType === "image"){
            postClass = "dashboard__imagepost";
          } else if(post.postType === "url"){
            postClass = "dashboard__urlpost";
          }

          // checks if user has voted on post
          let upArrowColor = 'gray';
          let downArrowColor = 'gray';
          let numberColor = 'gray';
          const userVote = post.votes.find(v => v.user === user.user_id)
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
            <div key={post._id} className={postClass}>
              <div className="dashboard__votes">
                <button type="button" value={post._id} onClick={(e) => this.votePost(post._id, 1)} className="dashboard__arrow">
                  <ArrowUpwardIcon style={{ fontSize: 17, color: upArrowColor }} />        
                </button>
                <span style={{ color: numberColor }}>{post?.score}</span>
                <button type="button" value={post._id} onClick={(e) => this.votePost(post._id, -1)} className="dashboard__arrow">
                  <ArrowDownwardIcon style={{ fontSize: 17, color: downArrowColor }} />
                </button>
              </div>
              <div className="post__body">
                <div className="post__communityinfo">
                  <Link to={`/communityhome/${post.communityName}`}>
                      <span className="post__community">{`r/${post.communityName}`}</span>
                  </Link>
                  <span className="post__author">{`Posted by u/${post.author} ${ago(new Date(post.createdAt))}`}</span>
                </div>
                <div className="post__title">
                  <span>{post.title}</span>
                </div>
                <div className="post__description">
                  <p className="card-text">{post.text} </p>
                  {post.image !== "" && <img className="post__image" src={post.image} alt="..."/>}
                  {post.url !== "" && <iframe title={post._id} src= {post.url} width="400" height="300"></iframe>}
                </div>
                <div className="post__comments">
                  <Link to={`/comments/${post._id}`}>
                    <button className="post__commentbutton">
                      <CommentIcon color="action" style={{ fontSize: 15 }} />
                      <span>Comments</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
        )})}

        <div className="dashboard__paginate">
            {
              allPosts.length===0
              ? null 
              : (
                <ReactPaginate
                  previousLabel={'prev'}
                  nextLabel={'next'}
                  pageCount={pageCount}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={10}
                  onPageChange={this.handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                  pageClassName={'page'}
                  previousClassName={'prev__page'}
                  nextClassName={'next__page'}
                  disabledClassName={'disabled'}
                />
              )
            }
          </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getDashboardDetails: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  auth: state.auth,
  dashboard: state.dashboard,
});

export default connect(mapStateToProps, { getDashboardDetails })(Dashboard);
