import React from 'react';
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
