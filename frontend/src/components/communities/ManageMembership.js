import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const { API_URL } = require('../../utils/Constants').default;

class ManageMembership extends React.Component {
  constructor(props) {
    super(props);
    const { auth, user } = this.props;
    setAuthToken(auth.user.token);

    this.state = {
      createdBy: auth.user.user_id,
      user,
      communities: [],
      communitiesToRemove: [],
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const { createdBy, user } = this.state;
    const response = await axios.get(`${API_URL}/user/communities?createdBy=${createdBy}&userId=${user._id}`);
    this.setState({ communities: response.data.communities });
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
    const { communitiesToRemove, user } = this.state;
    const { updateUsers } = this.props;

    const deleteData = { userId: user._id, communityIds: communitiesToRemove };
    const deleteParams = new URLSearchParams(deleteData).toString();

    const response = await axios.delete(`${API_URL}/user/communities?${deleteParams}`);
    updateUsers(true);
    this.setState({ show: false, communitiesToRemove: [] });
  }

  addCommunity(communityId) {
    const { communitiesToRemove } = this.state;
    communitiesToRemove.push(communityId);
  }

  getCommunityList() {
    const { communities } = this.state;
    const communityList = [];

    communities.forEach((community) => {
      communityList.push(
        <div className="form-check" style={{ margin: '15px' }} key={community._id}>
          <input className="form-check-input" type="checkbox" id="flexCheckDefault" onClick={() => this.addCommunity(community._id)} />
          <label className="form-check-label" for="flexCheckDefault" style={{ verticalAlign: 'middle' }}>
            <span style={{'margin': '5px', verticalAlign: 'middle' }}>
              <img
                src={community.photo}
                id={community._id}
                style={{ width: '25px', height: '25px' }}
              />
            </span>
            {community.name}
          </label>
        </div>
      );
    });

    return communityList;
  }

  render() {
    const { show, error, user } = this.state;
    return (
      <>
        <div style={{ paddingTop: '25px' }}>
          <Button variant="dark" onClick={this.handleShow} style={{ width: '100px' }}>
            Manage
          </Button>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>{`Manage memberships for ${user.name}`}</Modal.Title>
              <span style={{ color: 'red' }}>{error}</span>
            </Modal.Header>

            {this.getCommunityList()}

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleSubmit}>
                Remove User
              </Button>
            </Modal.Footer>

          </Modal>
        </div>
      </>
    );
  }
}

ManageMembership.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ManageMembership);
