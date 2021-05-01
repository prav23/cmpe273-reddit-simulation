import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withRouter } from 'react-router';
import AddCommunityRule from './AddCommunityRule';
import UpdateCommunity from './UpdateCommunity';

const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class Community extends React.Component {
  constructor(props) {
    super(props);

    const { match } = this.props;
    this.state = {
      communityName: match.params.communityName.replace('_', '/'),
      community: {},
      updateCommunity: false,
      defaultAvatar: 'data:image/png;base64,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',
    };

    this.updateCommunity = this.updateCommunity.bind(this);
  }

  async componentDidMount() {
    const { communityName } = this.state;
    const response = await axios.get(`${API_URL}/community?communityName=${communityName}`);
    this.setState({ community: response.data });
  }

  async componentDidUpdate() {
    const { updateCommunity, communityName } = this.state;

    if (updateCommunity) {
      const response = await axios.get(`${API_URL}/community?communityName=${communityName}`);
      this.setState({
        community: response.data,
        updateCommunity: true,
      });
    }
  }

  getRulesTable(community) {
    if (community.rules && community.rules.length > 0) {
      const ruleRows = community.rules.map((rule) => (
        <tr key={uuidv4()}>
          <td style={{ verticalAlign: 'middle' }}>{rule.title}</td>
          <td style={{ verticalAlign: 'middle' }}>{rule.description}</td>
        </tr>
      ));

      return (
        <>
        <h4 style={{'paddingTop': '25px' }}>Rules</h4>
        <div className="table-responsive" style={{ paddingTop: '25px' }}>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              {ruleRows}
            </tbody>
          </table>
        </div>
        </>
      );
    } else {
      return (
        <h4 style={{'paddingTop': '25px' }}>No Community Rules</h4>
      );
    }
  }

  updateCommunity(updateCommunity) {
    this.setState({ updateCommunity });
  }

  render() {
    const { community, defaultAvatar } = this.state;

    return (
      <header style={{'margin': '25px' }}>
        <div class="card border-dark mb-3" style={{'width': '100%' }}>
          <div class="card-header">
            <span style={{'margin': '5px' }}>
              <img
                src={community.photo ? community.photo : defaultAvatar}
                id={uuidv4()}
                alt={community.name}
                style={{ width: '50px', height: '50px' }}
              />
            </span>
            {community.name}
          </div>
          <div class="card-body text-dark">
            <h5 class="card-title">{community.description}</h5>
            <p class="card-text">{`Num users: ${community.numUsers}`}</p>
            <p class="card-text">{`Num posts: ${community.numPosts}`}</p>
          </div>
        </div>
        <UpdateCommunity updateCommunity={this.updateCommunity} community={this.state}/>
        {this.getRulesTable(community)}
        <AddCommunityRule updateCommunity={this.updateCommunity} community={this.state}/>
      </header>
    );
  }
}

export default withRouter(Community);
