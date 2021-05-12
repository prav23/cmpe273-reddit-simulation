import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';

const { API_URL } = require('../../utils/Constants').default;

class CreateCommunity extends React.Component {
  constructor(props) {
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);

    this.state = {
      show: false,
      user: user,
      fields: {
        name: '',
        description: '',
      },
      error: '',
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClose() {
    this.setState({ show: false, error: '', fields: {} });
  }

  handleShow() {
    this.setState({ show: true, error: '', fields: {} });
  }

  handleChange(field, event) {
    const { fields } = this.state;
    fields[field] = event.target.value;
    this.setState({ fields });
  }

  async handleSubmit() {
    const { fields, user } = this.state;
    const { updateCommunities } = this.props;

    if (!fields.name) {
      this.setState({ error: 'Community name is required', fields: {} });
      return;
    }

    try {
      fields.createdBy = user.user_id;
      await axios.post(`${API_URL}/community`, fields);
      updateCommunities(true);
    } catch(error) {
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data, fields: {} });
        return;
      }
    }
    this.setState({ show: false, fields: {} });
  }

  render() {
    const { show, error } = this.state;
    return (
      <>
        <div style={{ paddingTop: '25px' }}>
          <Button variant="dark" onClick={this.handleShow} style={{ width: '200px' }}>
            Create Community
          </Button>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>New Community</Modal.Title>
            </Modal.Header>

            <form>
              <div className="form-group">
                <input
                  className="form-control"
                  id="name"
                  placeholder="Enter Community Name"
                  onChange={this.handleChange.bind(this, 'name')}
                  required
                />
                <span style={{ color: 'red' }}>{error}</span>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  id="description"
                  placeholder="Enter Community Description"
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

CreateCommunity.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(CreateCommunity);
