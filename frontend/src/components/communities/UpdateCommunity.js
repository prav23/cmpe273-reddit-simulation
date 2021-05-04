import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

const { API_URL } = require('../../utils/Constants').default;

class UpdateCommunity extends React.Component {
  constructor(props) {
    // TODO: get auth token from redux state
    super(props);
    const { community, auth } = this.props;
    setAuthToken(auth.user.token);

    this.state = {
      show: false,
      fields: {
        newName: null,
        description: null,
        communityId: community.communityId,
      },
      error: ''
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    const { fields } = this.state;
    const { updateCommunity } = this.props;

    try {
      await axios.put(`${API_URL}/community`, fields);
      updateCommunity(true);
    } catch(error) {
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data });
        return;
      }
    }
    this.setState({ show: false });
  }

  render() {
    const { show, error, fields } = this.state;
    return (
      <>
        <div style={{ paddingTop: '25px' }}>
          <Button variant="dark" onClick={this.handleShow} style={{ width: '200px' }}>
            Update Community
          </Button>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>{`Update Community ${fields.name}`}</Modal.Title>
            </Modal.Header>

            <form>
              <div className="form-group">
                <input
                  className="form-control"
                  id="newName"
                  placeholder="New Community Name"
                  onChange={this.handleChange.bind(this, 'newName')}
                  required
                />
                <span style={{ color: 'red' }}>{error}</span>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  id="description"
                  placeholder="Community Description"
                  onChange={this.handleChange.bind(this, 'description')}
                  required
                />
              </div>
            </form>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>

          </Modal>
        </div>
      </>
    );
  }
}

UpdateCommunity.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(UpdateCommunity);
