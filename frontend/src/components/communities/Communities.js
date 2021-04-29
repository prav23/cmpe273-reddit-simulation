import React from 'react';
import ReactPaginate from 'react-paginate';

import { v4 as uuidv4 } from 'uuid';
import CreateCommunity from './CreateCommunity';

const testCommunities = require('./testCommunities');

class Communities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      communities: testCommunities,
    }
  }

  async componentDidMount() {
    // TODO: api call to set communities here
  }

  listOptions() {
    const optionMenus = [];
    // TODO: update communities per page
    [2, 5, 10].forEach((option) => {
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

  render() {
    const { communities } = this.state;
    if (communities.length === 0) {
      return (
        <header>
          <div className="container-fluid" style={{ paddingTop: '25px', paddingLeft: '25px' }}>
            <h1 className="h2">Join a community...</h1>
          </div>
          <CreateCommunity/>
        </header>
      );
    }

    const communityRows = communities.map((community) => (
      <tr key={uuidv4()}>
        <td>
          <img
            src={community.images[0]}
            id={uuidv4()}
            alt={community.name}
            style={{ width: '50px', height: '50px' }}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>{community.name}</td>
        <td style={{ textTransform: 'capitalize', verticalAlign: 'middle' }}>{community.description}</td>
        <td style={{ textTransform: 'capitalize', verticalAlign: 'middle' }}>{community.createdBy}</td>
        <td style={{ verticalAlign: 'middle' }}>{community.numPosts}</td>
        <td style={{ verticalAlign: 'middle' }}>{community.numUsers}</td>
        <td style={{ verticalAlign: 'middle' }}>
          {
            `${community.createdAt.toLocaleDateString()}
             ${community.createdAt.toLocaleTimeString()}`
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
                  style={{ width: '20rem' }}
                >
                  Number of Communities per Page
                </button>
                <div className="dropdown-menu" key={uuidv4()}>
                  {this.listOptions()}
                </div>
              </div>

              <div className="table-responsive" style={{ paddingTop: '25px' }}>
                <table className="table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Name</th>
                      <th scope="col">Description</th>
                      <th scope="col">Admin</th>
                      <th scope="col">Num Posts</th>
                      <th scope="col">Num Users</th>
                      <th scope="col">Created At</th>
                    </tr>
                  </thead>
                   {communityRows}
                  <tbody>
                  </tbody>
                </table>

                {/*TODO: add onPageChange handler*/}
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

                <CreateCommunity/>
              </div>
            </div>

          </div>
        </div>
      </header>
    );
  }
}

export default Communities;
