import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const axios = require('axios').default;
const { API_URL } = require('../../utils/Constants').default;

class CreateCommunity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      fields: {
        name: '',
        description: '',
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
    if (!fields.name) {
      this.setState({ error: 'Community name is required' });
      return;
    }

    try {
      await axios.post(`${API_URL}/community/community`, fields);
    } catch(error) {
      console.log(error.response);
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data });
        return;
      }
    }
    this.setState({ show: false });
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

export default CreateCommunity;
