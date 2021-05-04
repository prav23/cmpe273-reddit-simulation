import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ManageMembership from './ManageMembership';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const { API_URL } = require('../../utils/Constants').default;
const defaultAvatars = require('./testImages');

class CommunityUsers extends React.Component {
  constructor(props) {
    super(props);
    const { auth } = this.props;
    setAuthToken(auth.user.token);

    this.state = {
      createdBy: auth.user.user_id,
      members: [],
      updateUsers: false,
    };

    this.updateUsers = this.updateUsers.bind(this);
  }

  async componentDidMount() {
    this.setState({
      members: await this.getMembers(),
    });
  }

  async componentDidUpdate() {
    const { updateUsers } = this.state;

    if (updateUsers) {
      this.setState({
        members: await this.getMembers(),
        updateUsers: false,
      });
    }
  }

  updateUsers(updateUsers) {
    this.setState({ updateUsers });
  }

  async getMembers() {
    const { createdBy } = this.state;
    const response = await axios.get(`${API_URL}/community/members?createdBy=${createdBy}&status=joined`);
    return response.data;
  }

  render() {
    const { members } = this.state;

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
          <ManageMembership member={member} updateUsers={this.updateUsers} />
        </td>
      </tr>
    ));

    return (
      <>
      <h2 className="h2" style={{ margin: '25px' }}>{`${members.length} active users`}</h2>
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

export default connect(mapStateToProps)(CommunityUsers);
