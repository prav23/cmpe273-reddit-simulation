import React, { useEffect } from "react";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Constant from "../../utils/Constants";
import "./SendInvite.css";

const SendInvite = ({ user, jwtToken, communityId, communityName }) => {
  const [usersList, setUserList] = React.useState([]);
  const [inputList, setInputList] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const history = useHistory();
  const headers = {
    headers: {
      Authorization: jwtToken || user.token || localStorage.getItem("jwtToken"),
    },
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const body = [];
    selected.forEach((item) => {
      body.push({
        userId: item._id,
        userName: item.name,
        communityId,
        communityName,
        status: Constant.INVITED,
        sentBy: user.user_id,
      });
    });
    axios.post(`${Constant.API_URL}/invites/create`, body, headers).then(
      (result) => {
        if (result.status === 200) {
          alert("Invitations sent successfully");
          history.push("/sentInvites");
        }
      },
      (error) => {
        console.log(error);
        alert("Error sending invitations");
      }
    );
    /* inputList.forEach((item) => {
      const input = document.getElementById(item.id);
      if (input.value && input.value !== "") {
        body.push({
          userId: input.value,
          communityId,
          communityName,
          status: Constant.INVITED,
        });
      }
    }); */
  };

  const fetchUsers = () => {
    axios.get(`${Constant.API_URL}/users`, headers).then(
      (result) => {
        const users = result.data.data;
        if (users.allUsers && users.allUsers.length !== 0) {
          setUserList(users.allUsers);
        } else {
          setUserList([]);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const handleAutoCompleteChange = (e, value) => {
    console.log(value);
    const id = e.target.id.split("-option-")[0];
    selected[id] = value;
    setSelected(selected);
  };

  const addUser = (e) => {
    e.preventDefault();
    const id = inputList.length + 1;
    const data = { id: id.toString() };
    const list = inputList;
    list.push(data);
    setInputList([...list]);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="send">
      <Container>
        <Row className="justify-content-center">
          <Col xs={8}>
            <h2 style={{ textAlign: "center" }}>
              Invite users to this community
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={8}>
            <ListGroup id="add" className="list">
              <ListGroup.Item>
                <Autocomplete
                  id="0"
                  options={usersList}
                  getOptionLabel={(option) => option.name}
                  onChange={handleAutoCompleteChange}
                  className="user"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search user"
                      variant="outlined"
                    />
                  )}
                />
                <Button onClick={addUser} className="add" variant="link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="black"
                    className="bi bi-plus"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                </Button>
              </ListGroup.Item>
              {inputList.map((input) => {
                return (
                  <ListGroup.Item key={input.id}>
                    <Autocomplete
                      options={usersList}
                      getOptionLabel={(option) => option.name}
                      onChange={handleAutoCompleteChange}
                      className="user"
                      id={input.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Search user"
                          variant="outlined"
                        />
                      )}
                    />
                    <Button
                      onClick={addUser}
                      className="add"
                      variant="link"
                      id={input.id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        fill="black"
                        className="bi bi-plus"
                        viewBox="0 0 20 20"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                    </Button>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col xs={8}>
            <Button className="invite" onClick={handleInvite}>
              Invite
            </Button>
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

export default connect(mapStateToProps)(SendInvite);
