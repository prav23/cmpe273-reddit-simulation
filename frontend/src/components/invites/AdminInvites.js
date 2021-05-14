import React, { useEffect } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";

import Constants from "../../utils/Constants";
import "./Invite.css";

const AdminInvites = ({ user, jwtToken, communityId, communityName }) => {
  const [bInvites, setBInvites] = React.useState(false);
  const [inviteList, setInviteList] = React.useState([]);
  const [activePage, setActivePage] = React.useState(0);
  const [displayList, setDisplayList] = React.useState([]);
  const [numPages, setNumPages] = React.useState(1);
  const headers = {
    headers: {
      Authorization: jwtToken || user.token || localStorage.getItem("jwtToken"),
    },
  };

  const handlePageChange = (e) => {
    setActivePage(e.selected);
    const list = inviteList;
    setDisplayList(list.slice(5 * e.selected, 5 + 5 * e.selected));
  };

  useEffect(() => {
    axios
      .get(`${Constants.API_URL}/communities/${communityId}/invites?createdBy=${user.user_id}`, headers)
      .then(
        (result) => {
          if (result.status === 200) {
            setInviteList(result.data);
            setBInvites(true);
            const mod = result.data.length % 5;
            if (mod == 0) {
              setNumPages(parseInt(result.data.length / 5, 10));
            } else {
              setNumPages(parseInt(result.data.length / 5 + 1, 10));
            }
            const list = result.data;
            setDisplayList(list.slice(0, 5));
          } else {
            setInviteList([]);
            setBInvites(false);
            setNumPages(0);
          }
        },
        (error) => {
          console.log(error);
          setInviteList([]);
          setBInvites(false);
          setNumPages(0);
        }
      );
  }, []);

  return (
    <div className="invite">
      <Container>
        <Row className="justify-content-center">
          <header>
            <h1>Community invites sent by you</h1>
          </header>
          <Col xs={8}>
            <ListGroup>
              {displayList.map((invite) => {
                return (
                  <ListGroup.Item key={invite._id} id={invite._id}>
                    <div className="d-flex w-100 justify-content-between">
                      <h4>
                        <img
                          alt={invite.communityName}
                          src={invite.photo || Constants.REDDIT_LOGO_1}
                          className="userImg"
                        />
                        <span className="communityName">{invite.userName}</span>
                      </h4>
                      <small style={{ fontFamily: "Noto Sans" }}>
                        {new Date(invite.createdAt).toDateString()}
                      </small>
                    </div>
                    <span>Status:</span>
                    {invite.status === Constants.INVITE_JOINED && (
                      <span className="joined">{invite.status}</span>
                    )}
                    {invite.status === Constants.INVITE_JOINED && (
                      <span className="accept">
                        Accepted on {new Date(invite.updatedAt).toDateString()}
                      </span>
                    )}
                    {invite.status === Constants.INVITE_REJECTED && (
                      <span className="reject">{invite.status}</span>
                    )}
                    {invite.status === Constants.INVITE_REJECTED && (
                      <span className="accept">
                        Declined on {new Date(invite.updatedAt).toDateString()}
                      </span>
                    )}
                    {invite.status === Constants.INVITED && (
                      <span className="pending">{invite.status}</span>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
            {!bInvites && (
              <ListGroup>
                <ListGroup.Item>
                  <h4 style={{ textAlign: "center", fontSize: "14px" }}>
                    There are no invites sent by you
                  </h4>
                </ListGroup.Item>
              </ListGroup>
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={8} style={{ marginTop: "15px" }}>
            {numPages > 1 && (
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
                pageCount={numPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={numPages}
                onPageChange={handlePageChange}
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    jwtToken: state.auth.jwtToken,
    communityId: state.invite.communityId,
    communityName: state.invite.communityName,
  };
};

export default connect(mapStateToProps)(AdminInvites);
