import React from "react";
import { confirmAlert } from 'react-confirm-alert';
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import AddCommunityRule from "./AddCommunityRule";
import AddCommunityMember from "./AddCommunityMember";
import UpdateCommunity from "./UpdateCommunity";
import CommunityUsers from "./CommunityUsers";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Community.css";

import { setCommunityId, setCommunityName } from "../../actions/inviteActions";
const { API_URL } = require("../../utils/Constants").default;
const defaultAvatars = require("./testImages");

class Community extends React.Component {
  constructor(props) {
    super(props);
    const { match, auth } = this.props;

    this.state = {
      communityId: match.params.communityId,
      communityName: "",
      community: {},
      updateCommunity: false,
      defaultAvatar: defaultAvatars.communityAvatar,
      createdBy: auth.user.user_id,
      redirect: false,
      isAuthenticated: auth.isAuthenticated,
    };

    this.updateCommunity = this.updateCommunity.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    const community = await this.getCommunity();
    this.setState({ community, communityName: community.name });
  }

  async componentDidUpdate() {
    const { updateCommunity } = this.state;
    const community = await this.getCommunity();

    if (updateCommunity) {
      this.setState({
        community,
        communityName: community.name,
        updateCommunity: false,
      });
    }
  }

  async getCommunity() {
    const { communityId, createdBy } = this.state;
    try {
      const response = await axios.get(
        `${API_URL}/community?communityId=${communityId}&createdBy=${createdBy}`
      );
      return response.data;
    } catch (error) {
      return {
        name: "Community not found",
        description: "",
        numUsers: 0,
        numPosts: 0,
        rules: null,
        photo: null,
      };
    }
  }

  async onClick() {
    const { community } = this.state;

    const response = await axios.delete(`${API_URL}/community/community`, {
      params: { communityId: community._id },
    });

    this.setState({ redirect: true });
    this.forceUpdate();
  }

  async deleteCommunity() {
    const { community } = this.state;

    confirmAlert({
      title: 'Confirm to delete community',
      message: `Are you sure you want to delete ${community.name}`,
      buttons: [
        {
          label: 'Yes',
          onClick: this.onClick,
        },
        {
          label: 'No',
        },
      ],
    });
  }

  getRulesTable(community) {
    if (community.rules && community.rules.length > 0) {
      const ruleRows = community.rules.map((rule) => (
        <tr key={uuidv4()}>
          <td style={{ verticalAlign: "middle" }}>{rule.title}</td>
          <td style={{ verticalAlign: "middle" }}>{rule.description}</td>
        </tr>
      ));

      return (
        <>
          <h4 style={{ paddingTop: "25px" }}>Rules</h4>
          <div className="table-responsive" style={{ paddingTop: "25px" }}>
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>{ruleRows}</tbody>
            </table>
          </div>
        </>
      );
    } else {
      return <h4 style={{ paddingTop: "25px" }}>No Community Rules</h4>;
    }
  }

  updateCommunity(updateCommunity) {
    this.setState({ updateCommunity });
  }

  render() {
    const { community, defaultAvatar, communityId, communityName, redirect, isAuthenticated } = this.state;

    if (!isAuthenticated) {
      return <Redirect to="/" />;
    }

    console.log(redirect);
    if (redirect) {
      return <Redirect to="/communities" />;
    }

    const handleInviteClick = () => {
      const { dispatch } = this.props;
      dispatch(setCommunityId(communityId));
      dispatch(setCommunityName(communityName));
    };

    return (
      <div className="community">
        <header style={{ margin: "25px" }}>
          <p className="card-text">
            <Link to={`/createpost/${community.name}`}> Create Post </Link>
          </p>
          <div className="card border-dark mb-3" style={{ width: "100%" }}>
            <div className="card-header">
              <span style={{ margin: "5px" }}>
                <img
                  src={community.photo ? community.photo : defaultAvatar}
                  id={uuidv4()}
                  alt={community.name}
                  style={{ width: "50px", height: "50px" }}
                />
              </span>
              {community.name}
            </div>
            <div className="card-body text-dark">
              <h5 className="card-title">{community.description}</h5>
              <p className="card-text">{`Num users: ${community.numUsers}`}</p>
              <p className="card-text">{`Num posts: ${community.numPosts}`}</p>
            </div>
          </div>

          
          <UpdateCommunity
            updateCommunity={this.updateCommunity}
            community={this.state}
          />

          <div style={{ paddingTop: '5px' }}>
            <Button variant="secondary" onClick={() => this.deleteCommunity()}>
              Delete Community
            </Button>
          </div>

          {this.getRulesTable(community)}
          <AddCommunityRule
            updateCommunity={this.updateCommunity}
            community={this.state}
          />
          <AddCommunityMember
            updateCommunity={this.updateCommunity}
            community={this.state}
          />
          <h4>Community Invitation actions</h4>
          <Link to={`/sendInvites`}>
            <Button
              variant="dark"
              onClick={handleInviteClick}
              className="invite"
            >
              Invite users
            </Button>
          </Link>
          <Link to={`/sentInvites`}>
            <Button
              variant="dark"
              onClick={handleInviteClick}
              className="invite"
            >
              View invites' status
            </Button>
          </Link>
        </header>
      </div>
    );
  }
}

Community.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Community));
