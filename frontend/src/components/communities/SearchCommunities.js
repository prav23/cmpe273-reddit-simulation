import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import Select from "react-dropdown-select";
import ReactPaginate from "react-paginate";
import { resetSearchRedirect } from "../../actions/searchCommunitiesActions";
import './SearchCommunities.css';

const { API_URL } = require('../../utils/Constants').default;

class SearchCommunities extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      foundCommunities: [],
      newSearch: false,
      currentPage: 0,
      pageCount: 0,
      currentSortBy: "created",
      currentSortOpt: "asc",
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
    };
  }

  async componentDidMount() {
    // makes navigating back to dashboard possible
    // sets redux value SearchRedirect = false
    await this.props.resetSearchRedirect();

    // TO-DO: GET CALL for communites & backend
    const search_query = window.location.href.split("?");
    try {
      const communities = await axios.get(`${API_URL}/findcommunities?${search_query[1]}`);
      this.setState({
        foundCommunities: communities.data,
        newSearch: true,
        pageCount: communities.data.length/5,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        foundCommunities: [],
        newSearch: true,
        pageCount: 0,
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
      this.setState({
        foundCommunities: communities.data,
        pageCount: communities.data.length/5,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        foundCommunities: [],
        pageCount: 0,
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
    
    console.log(tempFC);
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

    console.log(tempFC);
    this.setState({
      currentSortOpt: values[0].value,
      foundCommunities: tempFC
    });
  }

  handlePageClick= (selectedPage) => {
    console.log(selectedPage.selected);
    this.setState({ 
      currentPage: selectedPage.selected
    });
  }

  render() {
    const { foundCommunities, newSearch, sortBy, sortOptions, pageCount, currentPage } = this.state;
    const { redirectToSearchPage } = this.props.searchCommunities;

    if (redirectToSearchPage && newSearch) {
      this.newSearch();
    }

    return (
      <div className="search">
        <div className="search__filters">
          <span className="search__sortbytext">Sort By</span>
          <Select options={sortBy} values={[sortBy.find(op=>op.label === "created at")]} searchable={false} onChange={values => this.setSortBy(values)} className="search__sortby" />
          <Select options={sortOptions} values={[sortOptions.find(op=>op.label === "ascending")]} searchable={false} onChange={values => this.setSortOptions(values)} className="search__sortby" />
        </div>

        <div className="search__communities">
          {
            foundCommunities.length===0
            ? <span className="search__noresults">No results found, try another search!</span>
            : foundCommunities.slice(currentPage*5, currentPage*5+5).map((community) => (
            <div key={community.id} className="search__community">
              <div className="search__communityinfo">
                <span className="search__communityname">{`r/${community.name}`}</span>
                <span className="search__communitymembers">{`${community?.numUsers} Members`}</span>
              </div>
              
              <div className="search__communitydescription">
                <p className="search__communitytext">
                  {community.description}
                </p>
              </div>

              <div className="search__joincommunity">
                <button type='button'>Join</button>
              </div>
            </div>
            ))
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
                  pageRangeDisplayed={5}
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