import React, { useEffect } from "react";
import { connect } from "react-redux";
import { ListGroup, Button, Col } from "react-bootstrap";
import axios from "axios";

import { setInviteUpdated } from "../../actions/inviteActions";
import Constants from "../../utils/Constants";
import { GET_ERRORS } from "../../actions/types";
import "./Invite.css";

const Invite = ({ dispatch, user, jwtToken, bInviteUpdated }) => {
  const [inviteList, setInviteList] = React.useState([]);
  const [bInvites, setBInvites] = React.useState(false);
  const headers = {
    headers: {
      Authorization: jwtToken || user.token || localStorage.getItem("jwtToken"),
    },
  };
  const userId = user.user_id;

  const handleInvite = async (e, inviteId, status) => {
    try {
      const result = await axios.put(
        `${Constants.API_URL}/invites/${inviteId}`,
        { status },
        headers
      );
      console.log(result);
      dispatch(setInviteUpdated(true));
    } catch (err) {
      if (err.response && err.response.data) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    }
  };

  const handleAccept = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const inviteId = id.split("accept_")[1];
    handleInvite(e, inviteId, Constants.INVITE_JOINED);
  };

  const handleReject = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const inviteId = id.split("reject_")[1];
    handleInvite(e, inviteId, Constants.INVITE_REJECTED);
  };

  useEffect(() => {
    axios
      .get(`${Constants.API_URL}/users/${userId}/invites`, headers)
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
  }, [bInviteUpdated]);

  return (
    <div className="invite">
      <header>
        <h1>Community invites</h1>
      </header>

      <Col xs={8} className="column">
        <ListGroup>
          {inviteList.map((invite) => {
            return (
              <ListGroup.Item key={invite._id} id={invite._id}>
                <div className="d-flex w-100 justify-content-between">
                  <h4>
                    <img
                      alt={invite.communityName}
                      src={
                        invite.community_info.photo || Constants.REDDIT_LOGO_1
                      }
                      className="communityImg"
                    />
                    <span className="communityName">
                      {invite.communityName}
                    </span>
                  </h4>
                  <small style={{ fontFamily: "Noto Sans" }}>
                    {new Date(invite.createdAt).toDateString()}
                  </small>
                </div>
                <Button
                  size="sm"
                  className="acceptInvite"
                  id={`accept_${invite._id}`}
                  onClick={handleAccept}
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  className="rejectInvite"
                  id={`reject_${invite._id}`}
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </ListGroup.Item>
            );
          })}
          {!bInvites && (
            <ListGroup>
              <ListGroup.Item>
                <h4 style={{ textAlign: "center", fontSize: "14px" }}>
                  There are no invites for you
                </h4>
              </ListGroup.Item>
            </ListGroup>
          )}
        </ListGroup>
      </Col>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    jwtToken: state.auth.jwtToken,
    bInviteUpdated: state.invite.bInviteUpdated,
  };
};

export default connect(mapStateToProps)(Invite);
