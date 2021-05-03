import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class AddCommunityRule extends React.Component {
  constructor(props) {
    // TODO: get auth token from redux state
    super(props);
    const { community } = this.props;

    this.state = {
      show: false,
      fields: {
        title: '',
        description: '',
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

    if (!fields.title) {
      this.setState({ error: 'Rule title is required' });
      return;
    }

    try {
      await axios.put(`${API_URL}/community/rule`, fields);
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
            Add Rule
          </Button>

          <Modal show={show} onHide={this.handleClose}>
            <Modal.Header>
              <Modal.Title>{`Add Rule to ${fields.name}`}</Modal.Title>
            </Modal.Header>

            <form>
              <div className="form-group">
                <input
                  className="form-control"
                  id="title"
                  placeholder="Enter Rule Title"
                  onChange={this.handleChange.bind(this, 'title')}
                  required
                />
                <span style={{ color: 'red' }}>{error}</span>
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  id="description"
                  placeholder="Enter Rule Description"
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

export default AddCommunityRule;
