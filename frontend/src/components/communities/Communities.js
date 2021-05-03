import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { MDBIcon} from 'mdbreact';

import { v4 as uuidv4 } from 'uuid';
import CreateCommunity from './CreateCommunity';
import setAuthToken from '../../utils/setAuthToken';

const testCommunities = require('./testCommunities');
const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;
const defaultAvatars = require('./testImages');

class Communities extends React.Component {
  constructor(props) {
    super(props);
    const { user, isAuthenticated } = this.props.auth;
    setAuthToken(user.token);

    this.state = {
      communities: [],
      updateCommunity: false,
      activitiesPerPage: 5,
      currentPage: 0,
      sortOrder: {
        'Date': 'angle-up',
        'Posts': 'angle-up',
        'Users': 'angle-up',
      },
      defaultAvatar: defaultAvatars.communityAvatar,
      createdBy: user.user_id,
      isAuthenticated,
    }

    this.updateCommunities = this.updateCommunities.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.updatePaginations = this.updatePaginations.bind(this);
  }

  async componentDidMount() {
    // const { isAuthenticated } = this.state;
    const { pagedCommunities, sortedCommunities } = await this.getCommunities();

    if (this.props.auth.isAuthenticated) {
      this.setState({ communities: pagedCommunities, allCommunities: sortedCommunities });
    } else {
      alert('Youre not logged in');
    }
  }

  async componentDidUpdate() {
    const { updateCommunity } = this.state;

    if (updateCommunity) {
      const { pagedCommunities, sortedCommunities } = await this.getCommunities();

      this.setState({
        communities: pagedCommunities,
        allCommunities: sortedCommunities,
        updateCommunity: false
      });
    }
  }

  handlePageClick(selectedPage) {
    this.setState({ currentPage: selectedPage.selected });
  }

  async getCommunities() {
    const { activitiesPerPage, sortOrder, createdBy } = this.state;
    const response = await axios.get(`${API_URL}/communities?createdBy=${createdBy}`);
    const communities = response.data;
    const sortedCommunities = Communities.sortCommunities(communities, sortOrder);

    let page = 0;
    const pagedCommunities = []
    while (page < sortedCommunities.length) {
      pagedCommunities.push(sortedCommunities.slice(page, page + activitiesPerPage));
      page += activitiesPerPage;
    }

    return { pagedCommunities, sortedCommunities };
  }

  listPageOptions() {
    const optionMenus = [];
    [2, 5, 10].forEach((option) => {
      optionMenus.push(
        <button
          className="dropdown-item"
          key={uuidv4()}
          type="button"
          onClick={this.updatePaginations.bind(this, option)}
        >
          {option}
        </button>,
      );
    });
    return optionMenus;
  }

  listSortOptions() {
    const optionMenus = [];
    ['Date', 'Posts', 'Users'].forEach((option) => {
      optionMenus.push(
        <button
          className="dropdown-item"
          key={uuidv4()}
          type="button"
        >
          {option}
        </button>,
      );
    });
    return optionMenus;
  }

  onSortChange(col) {
    const { allCommunities, sortOrder, activitiesPerPage } = this.state;
    sortOrder[col] = sortOrder[col] === 'angle-up' ? 'angle-down' : 'angle-up';
    const sortedCommunities = Communities.sortCommunities(allCommunities, col, sortOrder[col]);

    this.setState({
      sortOrder,
      communities: Communities.paginate(sortedCommunities, activitiesPerPage)
    });
  }

  static paginate(allCommunities, activitiesPerPage) {
    const paginatedCommunities = [];

    let page = 0;
    while (page < allCommunities.length) {
      paginatedCommunities.push(allCommunities.slice(page, page + activitiesPerPage));
      page += activitiesPerPage;
    }

    return paginatedCommunities;
  }

  updateCommunities(updateCommunity) {
    this.setState({ updateCommunity });
  }

  updatePaginations(activitiesPerPage) {
    const { allCommunities } = this.state;

    this.setState({
      activitiesPerPage,
      communities: Communities.paginate(allCommunities, activitiesPerPage),
      currentPage: 0
    });
  }

  static sortCommunities(communities, col, order) {
    return communities.sort(function(a, b) {
      if (col === 'Date') {
        if (order === 'angle-up') {
          return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? 1 : -1;
        } else {
          return new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1;
        }
      } else if (col === 'Posts') {
        if (order === 'angle-up') {
          return Math.max(a.numPosts, 0) > Math.max(b.numPosts, 0) ? 1 : -1;
        } else {
          return Math.max(a.numPosts, 0) > Math.max(b.numPosts, 0) ? -1 : 1;
        }
      } else if (col === 'Users') {
        if (order === 'angle-up') {
          return Math.max(a.numUsers, 0) > Math.max(b.numUsers, 0) ? 1 : -1;
        } else {
          return Math.max(a.numUsers, 0) > Math.max(b.numUsers, 0) ? -1 : 1;
        }
      }
    });
  }

  render() {
    const { communities, defaultAvatar, currentPage, sortOrder } = this.state;
    if (communities.length === 0) {
      return (
        <header>
          <div className="container-fluid" style={{ paddingTop: '25px', paddingLeft: '25px' }}>
            <h1 className="h2">Create a community...</h1>
          </div>
          <CreateCommunity updateCommunities={this.updateCommunities}/>
        </header>
      );
    }

    const communityRows = communities[currentPage].map((community) => (
      <tr key={uuidv4()}>
        <td>
          <img
            src={community.photo ? community.photo : defaultAvatar}
            id={uuidv4()}
            alt={community.name}
            style={{ width: '50px', height: '50px' }}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>
         <Link to={`/community/${community._id}`} style={{ color: '#000' }}> {community.name} </Link>
        </td>
        <td style={{ textTransform: 'capitalize', verticalAlign: 'middle' }}>{community.description}</td>
        <td style={{ verticalAlign: 'middle' }}>{community.numPosts ? community.numPosts : 0}</td>
        <td style={{ verticalAlign: 'middle' }}>{community.numUsers ? community.numUsers : 0}</td>
        <td style={{ verticalAlign: 'middle' }}>
          {
            `${new Date(community.createdAt).toLocaleDateString()}
             ${new Date(community.createdAt).toLocaleTimeString()}`
          }
        </td>
      </tr>
    ));

    return (
      <header>
        <div className="container-fluid">
          <div className="row">
            <div className="card-body">
              <h1 className="h2">Your Communities</h1>

              <div className="input-group-prepend" key={uuidv4()} style={{ paddingTop: '25px' }}>
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  key={uuidv4()}
                  style={{ width: '15rem' }}
                >
                  Communities per Page
                </button>
                <div className="dropdown-menu" key={uuidv4()}>
                  {this.listPageOptions()}
                </div>
              </div>

              <div className="table-responsive" style={{ paddingTop: '25px' }}>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col" style={{ width: '150px' }}>
                        Num Posts
                        <span style={{ margin: '5px' }}>
                          <button onClick={() => this.onSortChange('Posts')}>
                            <MDBIcon icon={sortOrder.Posts} />
                          </button>
                        </span>
                      </th>
                      <th scope="col" style={{ width: '150px' }}>
                        Num Users
                        <span style={{ margin: '5px' }}>
                          <button onClick={() => this.onSortChange('Users')}>
                            <MDBIcon icon={sortOrder.Users} />
                          </button>
                        </span>
                      </th>
                      <th scope="col" style={{ width: '200px' }}>
                        Created At
                        <span style={{ margin: '5px' }}>
                          <button onClick={() => this.onSortChange('Date')}>
                            <MDBIcon icon={sortOrder.Date} />
                          </button>
                        </span>
                      </th>
                    </tr>
                  </thead>
                   {communityRows}
                  <tbody>
                  </tbody>
                </table>

                <div style={{ paddingTop: '25px' }}>
                  <ReactPaginate
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    pageCount={communities.length}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={communities.length}
                    onPageChange={this.handlePageClick}
                  />
                </div>

                <CreateCommunity updateCommunities={this.updateCommunities}/>
              </div>
            </div>

          </div>
        </div>
      </header>
    );
  }
}

Communities.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Communities);
