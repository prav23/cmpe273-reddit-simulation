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
      communityId: match.params.communityId,
      communityName: '',
      community: {},
      updateCommunity: false,
      defaultAvatar: defaultAvatars.communityAvatar,
    };

    this.updateCommunity = this.updateCommunity.bind(this);
  }

  async componentDidMount() {
    const community = await this.getCommunity();
    this.setState({ community, communityName: community.name });
  }

  async componentDidUpdate() {
    const { updateCommunity } = this.state;
    const community = await this.getCommunity();

    if (updateCommunity) {
      this.setState({
        community,
        communityName: community.name,
        updateCommunity: false,
      });
    }
  }

  async getCommunity() {
    const { communityId } = this.state;
    try {
      const response = await axios.get(`${API_URL}/community?communityId=${communityId}`);
      return response.data;
    } catch(error) {
      return {
        name: 'Community not found',
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
        <div className="card border-dark mb-3" style={{'width': '100%' }}>
          <div className="card-header">
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
          <div className="card-body text-dark">
            <h5 className="card-title">{community.description}</h5>
            <p className="card-text">{`Num users: ${community.numUsers}`}</p>
            <p className="card-text">{`Num posts: ${community.numPosts}`}</p>
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
