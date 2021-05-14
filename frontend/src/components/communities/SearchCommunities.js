import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Select from "react-dropdown-select";
import ReactPaginate from "react-paginate";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { resetSearchRedirect } from "../../actions/searchCommunitiesActions";
import setAuthToken from '../../utils/setAuthToken';
import './SearchCommunities.css';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const { API_URL } = require('../../utils/Constants').default;

class SearchCommunities extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);
    this.state = {
      foundCommunities: [],
      newSearch: false,
      currentPage: 0,
      pageCount: 0,
      currentSortBy: "created",
      currentSortOpt: "asc",
      currentPageSize: 2,
      sortBy: [
        { label: "created at", value: "created" },
        { label: "most users", value: "users" },
        { label: "most posts", value: "posts" },
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
      ],
      communityPageRedirect: "",
    };
  }

  addMostVotedPost(communities) {
    const retCommunities = [];
    communities.map(async(c) => {
      let postScore = 0;
      try {
        const post = await axios.get(`${API_URL}/communities/${c.name}/mostUpvotedPost`);
        
        if(post.data.length > 0){
          postScore = post.data[0].score;
        }
      } catch (e) {
        postScore = 0;
      }
      
      retCommunities.push({
        upvotedPosts: postScore,
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
    });
    console.log(retCommunities);
    return retCommunities;
  }

  async componentDidMount() {
    // makes navigating back to dashboard possible
    // sets redux value SearchRedirect = false
    await this.props.resetSearchRedirect();

    // TO-DO: GET CALL for communites & backend
    const search_query = window.location.href.split("?");
    try {
      const communities = await axios.get(`${API_URL}/findcommunities?${search_query[1]}`);
      const { currentPageSize } = this.state;

      //const reformatedCommunities = this.addMostVotedPost(communities.data);

      this.setState({
        foundCommunities: communities.data,
        newSearch: true,
        pageCount: Math.ceil(communities.data.length/currentPageSize),
        communityPageRedirect: "",
      });  
    } catch (e) {
      this.setState({
        newSearch: true,
        pageCount: 0,
        communityPageRedirect: "",
      });
    }
  }

  async newSearch() {
    // makes navigating back to dashboard possible
    // sets redux value SearchRedirect = false
    await this.props.resetSearchRedirect();

    const search_query = window.location.href.split("?");
    try {
      const communities = await axios.get(`${API_URL}/findcommunities?${search_query[1]}`);
      const { currentPageSize } = this.state;
      //const reformatedCommunities = this.addMostVotedPost(communities.data);
      this.setState({
        foundCommunities: communities.data,
        pageCount: Math.ceil(communities.data.length/currentPageSize),
        communityPageRedirect: "",
      });
    } catch (e) {
      this.setState({
        pageCount: 0,
        communityPageRedirect: "",
      });
    }
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

  sortByMostUsers = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.numUsers < b.numUsers) { return -1; }
      if (a.numUsers > b.numUsers) { return 1; }
      return 0;
    } else {
      if (a.numUsers < b.numUsers) { return 1; }
      if (a.numUsers > b.numUsers) { return -1; }
      return 0;
    }
  }

  sortByMostPosts = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.numPosts < b.numPosts) { return -1; }
      if (a.numPosts > b.numPosts) { return 1; }
      return 0;
    } else {
      if (a.numPosts < b.numPosts) { return 1; }
      if (a.numPosts > b.numPosts) { return -1; }
      return 0;
    }
  }

  // TO-DO SORT BY UPVOTED POSTS
  // change a.numPosts to upvotedPosts
  sortByMostUpvotedPosts = (a, b) => {
    const { currentSortOpt } = this.state;
    if(currentSortOpt === "asc") {
      if (a.numPosts < b.numPosts) { return -1; }
      if (a.numPosts > b.numPosts) { return 1; }
      return 0;
    } else {
      if (a.numPosts < b.numPosts) { return 1; }
      if (a.numPosts > b.numPosts) { return -1; }
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
      if (a.numUsers < b.numUsers) { return -1; }
      if (a.numUsers > b.numUsers) { return 1; }
      return 0;
    } else if(currentSortBy === "posts"){
      if (a.numPosts < b.numPosts) { return -1; }
      if (a.numPosts > b.numPosts) { return 1; }
      return 0;
    } else if(currentSortBy === "upvoteposts"){
      if (a.numPosts < b.numPosts) { return -1; }
      if (a.numPosts > b.numPosts) { return 1; }
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
      if (a.numUsers < b.numUsers) { return 1; }
      if (a.numUsers > b.numUsers) { return -1; }
      return 0;
    } else if(currentSortBy === "posts"){
      if (a.numPosts < b.numPosts) { return 1; }
      if (a.numPosts > b.numPosts) { return -1; }
      return 0;
    } else if(currentSortBy === "upvoteposts"){
      if (a.numPosts < b.numPosts) { return 1; }
      if (a.numPosts > b.numPosts) { return -1; }
      return 0;
    }
  }

  setSortBy = (values) => {
    const { foundCommunities } = this.state;
    let tempFC = foundCommunities;
    if (values[0].value === "created") {
      tempFC = tempFC.sort(this.sortByCreatedAt);
    } else if (values[0].value === "users") {
      tempFC = tempFC.sort(this.sortByMostUsers);
    } else if (values[0].value === "posts") {
      tempFC = tempFC.sort(this.sortByMostPosts);
    } else if (values[0].value === "upvoteposts") {
      tempFC = tempFC.sort(this.sortByMostUpvotedPosts);
    }
    
    this.setState({
      currentSortBy: values[0].value,
      foundCommunities: tempFC
    });
  }

  setSortOptions = (values) => {
    const { foundCommunities } = this.state;
    let tempFC = foundCommunities;
    if (values[0].value === "asc") {
      tempFC = tempFC.sort(this.sortByAscending);
    } else if (values[0].value === "desc") {
      tempFC = tempFC.sort(this.sortByDescending);
    } 

    this.setState({
      currentSortOpt: values[0].value,
      foundCommunities: tempFC
    });
  }

  setPageSize = (values) => {
    const { foundCommunities, currentPageSize, currentPage } = this.state;
    this.setState({
      currentPageSize: values[0].value,
      pageCount: Math.ceil(foundCommunities.length / values[0].value),
      currentPage: (currentPage * currentPageSize) / values[0].value,
    });
  }

  handlePageClick= (selectedPage) => {
    this.setState({ 
      currentPage: selectedPage.selected
    });
  }

  async voteCommunity(communityId, vote, e) {
    e.stopPropagation();
    const { user } = this.props.auth;
    const { foundCommunities } = this.state;
    let foundCommunity = foundCommunities.find(c => c._id === communityId);
    if (foundCommunity !== undefined) {
      let prevUserVote = foundCommunity.votes.find(v => v.user === user.user_id);
      // check users previous vote
      if (prevUserVote !== undefined) {
        // unvote if user clicks on same arrow again
        if (prevUserVote.vote === vote) {
          vote = 0;
        }
      }
    }

    const payload = {
      community_id: communityId,
      user: user.user_id,
      vote, 
    };
    try {
      const updatedCommunity = await axios.put(`${API_URL}/community/vote`, payload);
      
      let communityIndex = foundCommunities.findIndex(c => c._id === updatedCommunity.data._id);
      let foundCommunitiesCopy = [...foundCommunities];
      foundCommunitiesCopy[communityIndex] = updatedCommunity.data;
      this.setState({
        foundCommunities: foundCommunitiesCopy,
      });
    } catch (err) {
      console.log(err);
    }
  }

  clickCommunity = (e) => {
    console.log(e.currentTarget.dataset.community_id);
    this.setState({
      communityPageRedirect: e.currentTarget.dataset.community_id,
    });
  }

  render() {
    const {
      foundCommunities,
      newSearch,
      sortBy,
      sortOptions,
      pageCount,
      currentPage,
      currentPageSize,
      pageSizeOpts,
      communityPageRedirect,
    } = this.state;
    const { redirectToSearchPage } = this.props.searchCommunities;
    const { user } = this.props.auth;

    if (redirectToSearchPage && newSearch) {
      this.newSearch();
    }

    console.log(foundCommunities);
    console.log(foundCommunities.length > 0);

    return (
      <div className="search">
        {
          communityPageRedirect !== "" ?
          <Redirect to={`/community/${communityPageRedirect}`} /> :
          null
        }
        <div className="search__filters">
          <span className="search__sortbytext">Sort By</span>
          <Select options={sortBy} values={[sortBy.find(op=>op.label === "created at")]} searchable={false} onChange={values => this.setSortBy(values)} className="search__sortby" />
          <Select options={sortOptions} values={[sortOptions.find(op=>op.label === "ascending")]} searchable={false} onChange={values => this.setSortOptions(values)} className="search__sortby" />
          <span className="search__pagesizetext">Page Size</span>
          <Select options={pageSizeOpts} values={[pageSizeOpts.find(op=>op.label === "2")]} searchable={false} onChange={values => this.setPageSize(values)} className="search__sortby" />
        </div>

        <div className="search__communities">
          {
            foundCommunities.length===0
            ? <span className="search__noresults">No results found, try another search!</span>
            : foundCommunities.slice(currentPage*currentPageSize, currentPage*currentPageSize+currentPageSize).map((community) => {
              console.log(community);
              // checks if user has voted on community
              let upArrowColor = 'gray';
              let downArrowColor = 'gray';
              let numberColor = 'gray';
              const userVote = community.votes.find(v => v.user === user.user_id)
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
                <div key={community._id} data-community_id={community._id} className="search__community" onClick={this.clickCommunity}>
                  <div className="search__vote">
                    <button type="button" value={community._id} onClick={(e) => this.voteCommunity(community._id, 1, e)} className="search__arrow">
                      <ArrowUpwardIcon style={{ fontSize: 17, color: upArrowColor }} />
                    </button>
                    <span style={{ fontSize: 17, color: numberColor }}>{community?.score}</span>
                    <button type="button" value={community._id} onClick={(e) => this.voteCommunity(community._id, -1, e)} className="search__arrow">
                      <ArrowDownwardIcon style={{ fontSize: 17, color: downArrowColor }} />
                    </button>
                  </div>
                  <div className="search__comPhoto">
                    <img src={community?.photo} alt={''} />
                  </div>
                  <div className="search__communityinfo">
                    <Link to={`/communityhome/${community._id}`}>
                      <span className="search__communityname">{`r/${community.name}`}</span>
                    </Link>
                    <span className="search__communitymembers">{`${community?.numUsers} Members`}</span>
                  </div>
                  
                  <div className="search__communitydescription">
                    <p className="search__communitytext">
                      {community.description}
                    </p>
                  </div>
                </div>
              )
            })
          }
          <div className="search__paginate">
            {
              foundCommunities.length===0
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth,
    searchCommunities: state.searchCommunities,
});

export default connect(mapStateToProps, { resetSearchRedirect })(SearchCommunities);