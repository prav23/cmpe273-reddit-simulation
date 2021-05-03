import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { withRouter } from 'react-router';
import AddCommunityRule from './AddCommunityRule';
import AddCommunityMember from './AddCommunityMember';
import UpdateCommunity from './UpdateCommunity';

const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;
const defaultAvatars = require('./testImages');

class Community extends React.Component {
  constructor(props) {
    super(props);

    const { match } = this.props;
    this.state = {
      communityName: match.params.communityName.replace('_', '/'),
      community: {},
      updateCommunity: false,
      defaultAvatar: defaultAvatars.communityAvatar,
    };

    this.updateCommunity = this.updateCommunity.bind(this);
  }

  async componentDidMount() {
    const { communityName } = this.state;
    this.setState({ community: await this.getCommunity() });
  }

  async componentDidUpdate() {
    const { updateCommunity, communityName } = this.state;

    if (updateCommunity) {
      this.setState({
        community: await this.getCommunity(),
        updateCommunity: false,
      });
    }
  }

  async getCommunity() {
    const { communityName } = this.state;
    try {
      const response = await axios.get(`${API_URL}/community?communityName=${communityName}`);
      return response.data;
    } catch(error) {
      return {
        name: communityName,
        description: '',
        numUsers: 0,
        numPosts: 0,
        rules: null,
        photo: null,
      };
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
        <AddCommunityMember community={this.state} />
      </header>
    );
  }
}

export default withRouter(Community);
