import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ListGroup, Button } from "react-bootstrap";
import axios from "axios";
import Constants from "../../utils/Constants";

import "./Invite.css";

const Invite = ({ user, jwtToken }) => {
  const [inviteList, setInviteList] = React.useState([]);
  const [bInvites, setBInvites] = React.useState(false);
  const headers = {
    headers: {
      Authorization: jwtToken || localStorage.getItem("jwtToken"),
    },
  };
  // const userId = user.user_id || localStorage.getItem("u")

  useEffect(() => {
    axios
      .get(`${Constants.API_URL}/users/${user.user_id}/invites`, headers)
      .then((invites) => {
        if (invites.data.length !== 0) {
          setInviteList(invites.data);
          setBInvites(true);
        } else {
          setInviteList([]);
          setBInvites(false);
        }
      })
      .catch(() => {
        setInviteList([]);
        setBInvites(false);
      });
  }, []);

  return (
    <div className="invite">
      <header>
        <h1>Community invites</h1>
      </header>
      <ListGroup>
        {inviteList.map((invite) => {
          return (
            <ListGroup.Item key={invite._id} id={invite._id}>
              <div className="d-flex w-100 justify-content-between">
                <h4>
                  <img
                    alt={invite.communityName}
                    src={invite.community_info.photo || Constants.REDDIT_LOGO_1}
                    className="communityImg"
                  />
                  <span className="communityName">{invite.communityName}</span>
                </h4>
                <small style={{ fontFamily: "Noto Sans" }}>
                  {new Date(invite.createdAt).toDateString()}
                </small>
              </div>
              <Button
                size="sm"
                className="acceptInvite"
                id={invite.communityId}
                // onClick={handleAccept}
              >
                Accept
              </Button>
              <Button
                size="sm"
                className="rejectInvite"
                id={invite.communityId}
                // onClick={handleReject}
              >
                Reject
              </Button>
            </ListGroup.Item>
          );
        })}
        {!bInvites && (
          <h4 style={{ textAlign: "center" }}>There are no invites for you</h4>
        )}
      </ListGroup>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    jwtToken: state.auth.jwtToken,
  };
};

export default connect(mapStateToProps)(Invite);
