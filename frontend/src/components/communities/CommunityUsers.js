import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import ManageMembership from './ManageMembership';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const { API_URL } = require('../../utils/Constants').default;
const defaultAvatars = require('./testImages');

class CommunityUsers extends React.Component {
  constructor(props) {
    super(props);
    const { match, auth } = this.props;
    setAuthToken(auth.user.token);

    this.state = {
      createdBy: auth.user.user_id,
      communityId: match.params.communityId,
      community: {
        name: 'Not found',
        numUsers: 0,
      },
      members: [],
    };
  }

  async componentDidMount() {
    this.setState({
      members: await this.getMembers(),
      community: await this.getCommunity(),
    });
  }

  async getMembers() {
    const { communityId, createdBy } = this.state;
    const response = await axios.get(`${API_URL}/community/members?communityId=${communityId}&createdBy=${createdBy}&status=joined`);
    return response.data;
  }

  async getCommunity() {
    const { communityId, createdBy } = this.state;
    const response = await axios.get(`${API_URL}/community?communityId=${communityId}&createdBy=${createdBy}`);
    return response.data;
  }

  render() {
    const { members, community } = this.state;

    const rows = members.map((member) => (
      <tr key={uuidv4()}>
        <td>
          <img
            src={member.photo}
            id={member._id}
            alt={member._id}
            style={{ width: '50px', height: '50px' }}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>{member.userName}</td>
        <td style={{ verticalAlign: 'middle' }}>
          <ManageMembership member={member} />
        </td>
      </tr>
    ));

    return (
      <>
      <h2 className="h2" style={{ margin: '25px' }}>{`${community.numUsers} active users in ${community.name}`}</h2>
      <div className="table-responsive" style={{ paddingTop: '25px' }}>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Communities</th>
            </tr>
          </thead>
          {rows}
        </table>
      </div>
      </>
    );
  }
}

CommunityUsers.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(CommunityUsers));
