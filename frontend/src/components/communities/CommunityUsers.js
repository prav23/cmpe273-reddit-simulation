import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
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
      users: [[]],
      allUsers: [],
      updateUsers: false,
      activitiesPerPage: 2,
      currentPage: 0,
    };

    this.updateUsers = this.updateUsers.bind(this);
    this.updatePaginations = this.updatePaginations.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  async componentDidMount() {
    const { activitiesPerPage } = this.state;
    const response = await this.getMembers();

    this.setState({
      allUsers: response,
      users: CommunityUsers.paginate(response, activitiesPerPage),
    });
  }

  async componentDidUpdate() {
    const { updateUsers, activitiesPerPage } = this.state;

    if (updateUsers) {
      const response = await this.getMembers();
      this.setState({
        allUsers: response,
        users: CommunityUsers.paginate(response, activitiesPerPage),
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

  handlePageClick(selectedPage) {
    this.setState({ currentPage: selectedPage.selected });
  }

  listPageOptions() {
    const optionMenus = [];
    [2, 5, 10].forEach((option) => {
      optionMenus.push(
        <button
          className="dropdown-item"
          key={uuidv4()}
          type="button"
          onClick={this.updatePaginations.bind(this, option)}
        >
          {option}
        </button>,
      );
    });
    return optionMenus;
  }

  static paginate(allUsers, activitiesPerPage) {
    const paginatedUsers = [];

    let page = 0;
    while (page < allUsers.length) {
      paginatedUsers.push(allUsers.slice(page, page + activitiesPerPage));
      page += activitiesPerPage;
    }

    return paginatedUsers;
  }

  updatePaginations(activitiesPerPage) {
    const { allUsers } = this.state;

    this.setState({
      activitiesPerPage,
      users: CommunityUsers.paginate(allUsers, activitiesPerPage),
      currentPage: 0
    });
  }

  render() {
    const { users, currentPage, allUsers } = this.state;

    const rows = users[currentPage].map((user) => (
      <tr key={uuidv4()}>
        <td>
          <img
            src={user.profilePicture ? user.profilePicture : defaultAvatars.userAvatar}
            id={user._id}
            alt={user._id}
            style={{ width: '50px', height: '50px' }}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>{user.name}</td>
        <td style={{ verticalAlign: 'middle' }}>
          <ManageMembership user={user} updateUsers={this.updateUsers} />
        </td>
      </tr>
    ));

    return (
      <>
      <h2 className="h2" style={{ margin: '25px' }}>{`${allUsers.length} active users`}</h2>
      <div className="input-group-prepend" key={uuidv4()} style={{ paddingTop: '25px' }}>
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          key={uuidv4()}
          style={{ width: '15rem' }}
        >
          Users per Page
        </button>
        <div className="dropdown-menu" key={uuidv4()}>
          {this.listPageOptions()}
        </div>
      </div>

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

        <div style={{ paddingTop: '25px' }}>
          <ReactPaginate
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
            pageCount={users.length}
            marginPagesDisplayed={2}
            pageRangeDisplayed={users.length}
            onPageChange={this.handlePageClick}
          />
        </div>
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
