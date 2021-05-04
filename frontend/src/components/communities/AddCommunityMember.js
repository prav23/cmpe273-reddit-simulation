import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';
import setAuthToken from '../../utils/setAuthToken';

const testMembers = require('./testMembers');
const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class AddCommunityMember extends React.Component {
  constructor(props) {
    super(props);

    const { community, auth } = this.props;
    setAuthToken(auth.user.token);

    this.state = {
      members: [],
      membersToApprove: [],
      communityId: community.communityId,
      createdBy: auth.user.user_id,
      error: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.addMember = this.addMember.bind(this);
  }

  async componentDidMount() {
    this.setState({ members: await this.getMembers() });
  }

  async componentDidUpdate() {
  }

  handleClose() {
    this.setState({ show: false, error: '' });
  }

  handleShow() {
    this.setState({ show: true, error: '' });
  }

  handleChange(field, event) {
    const { fields } = this.state;
    fields[field] = event.target.value;
    this.setState({ fields });
  }

  async handleSubmit() {
    const { membersToApprove, communityId } = this.state;
    const { updateCommunity } = this.props;

    if (membersToApprove && membersToApprove.length > 0) {
      try {
        await axios.put(`${API_URL}/community/members/approve`, {
          communityId,
          members: membersToApprove,
        });
        const members = await this.getMembers();
        updateCommunity(true);
        this.setState({
          show: false,
          error: '',
          members,
        });
      } catch(error) {
        this.setState({ show: true, error: error.response.data });
      }
    }
  }

  async getMembers() {
    const { communityId, createdBy } = this.state;
    try {
      const response = await axios.get(`${API_URL}/community/members?communityId=${communityId}&createdBy=${createdBy}&status=invited`);
      return response.data;
    } catch(error) {
      this.setState({ show: true, error: error.response.data });
    }
  }

  addMember(inviteId) {
    const { membersToApprove } = this.state;
    membersToApprove.push(inviteId);
  }

  getMemberList() {
    const { members } = this.state;
    const membersList = [];

    members.forEach((member) => {
      membersList.push(
        <div className="form-check" style={{ margin: '15px' }} key={uuidv4()}>
          <input className="form-check-input" type="checkbox" id="flexCheckDefault" onClick={() => this.addMember(member._id)} />
          <label className="form-check-label" for="flexCheckDefault" style={{ verticalAlign: 'middle' }}>
            <span style={{'margin': '5px', verticalAlign: 'middle' }}>
              <img
                src={member.photo}
                id={uuidv4()}
                style={{ width: '25px', height: '25px' }}
              />
            </span>
            {member.userName}
          </label>
        </div>
      );
    });

    return membersList;
  }

  render() {
    const { show, error, members } = this.state;
    if (!members || members.length === 0) {
      return (
        <h5 className="card-title" style={{ 'paddingTop': '25px' }}>No invitations to approve</h5>
      );
    }

    return (
      <>
        <div style={{ paddingTop: '25px' }}>
          <Button variant="dark" onClick={this.handleShow} style={{ width: '200px' }}>
            Approve Invitations
          </Button>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>{`${members.length} users to approve`}</Modal.Title>
              <span style={{ color: 'red' }}>{error}</span>
            </Modal.Header>

            {this.getMemberList()}

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleSubmit}>
                Approve
              </Button>
            </Modal.Footer>

          </Modal>
        </div>
      </>
    );
  }
}

AddCommunityMember.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AddCommunityMember);
