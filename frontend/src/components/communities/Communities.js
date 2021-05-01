import React from 'react';
import ReactPaginate from 'react-paginate';
import { MDBIcon} from 'mdbreact';

import { v4 as uuidv4 } from 'uuid';
import CreateCommunity from './CreateCommunity';

const testCommunities = require('./testCommunities');
const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class Communities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: [],
      updateCommunity: false,
      activitiesPerPage: 2,
      currentPage: 0,
      sortOrder: {
        'Date': 'angle-up',
        'Posts': 'angle-up',
        'Users': 'angle-up',
      },
      defaultAvatar: 'data:image/png;base64,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',
    }

    this.updateCommunities = this.updateCommunities.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.updatePaginations = this.updatePaginations.bind(this);
  }

  async componentDidMount() {
    const { pagedCommunities, sortedCommunities } = await this.getCommunities();
    this.setState({ communities: pagedCommunities, allCommunities: sortedCommunities });
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
    const { activitiesPerPage, sortOrder } = this.state;
    // TODO: update createdBy to logged in user
    const response = await axios.get(`${API_URL}/community?createdBy=admin`);
    const communities = testCommunities.concat(response.data);
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
            <h1 className="h2">Join a community...</h1>
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
        <td style={{ verticalAlign: 'middle' }}>{community.name}</td>
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

export default Communities;
