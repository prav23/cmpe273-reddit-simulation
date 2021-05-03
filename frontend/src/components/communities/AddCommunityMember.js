import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal } from 'react-bootstrap';

const testMembers = require('./testMembers');
const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class AddCommunityMember extends React.Component {
  constructor(props) {
    super(props);

    const { community } = this.props;
    this.state = {
      members: [],
      membersToApprove: [],
      communityName: community.communityName,
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
    const { membersToApprove } = this.state;
    if (membersToApprove.length > 0) {
      
    }

    this.setState({ show: false });
  }

  async getMembers() {
    const { communityName } = this.state;
    try {
      // TODO: replace created by with logged in user from redux state
      const response = await axios.get(`${API_URL}/community/members?communityName=${communityName}&createdBy=admin`);
      return response.data;
    } catch(error) {
      if (error.response) {
        console.log(error.response);
      }
      return testMembers;
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
    if (members.length === 0) {
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

export default AddCommunityMember;
