import React, { useEffect } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import ago from "s-ago";

import Constant from "../../utils/Constants";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Analytics.css";

const Analytics = ({ user, jwtToken }) => {
  const userId = user.user_id;
  const headers = {
    headers: {
      Authorization: jwtToken || user.token || localStorage.getItem("jwtToken"),
    },
  };
  const [mostActiveCommunity, setMostActiveCommunity] = React.useState("");
  const [activeCommMap, setActiveCommMap] = React.useState({});
  const [commName, setCommName] = React.useState("");
  const [commList, setCommList] = React.useState([]);
  const [numOfPosts, setNumOfPosts] = React.useState(0);
  const [numOfUsers, setNumOfUsers] = React.useState(0);
  const [activeUser, setActiveUser] = React.useState("");
  const [mostUpvoted, setMostUpvoted] = React.useState(null);
  const [upVoteMap, setUpvoteMap] = React.useState({});

  const backgroundColor = [
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(255, 99, 132, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(0, 0, 128, 0.6)",
    "rgba(128, 128, 0, 0.6)",
    "rgba(128, 0, 0, 0.6)",
    "rgba(128, 0, 0, 1.0)",
    "rgba(128, 0, 128, 1.0)",
  ];

  const handleCommunityChange = (e) => {
    const communityName = e.target.value;
    setCommName(communityName);
    getNumberOfUsers(communityName);
    getNumberOfPosts(communityName);
    getMostActiveUser(communityName);
    getMostUpvotedPosts(communityName);
  };

  const getNumberOfUsers = async (comm) => {
    // comm = "testCommunity";
    try {
      const result = await axios.get(
        `${Constant.API_URL}/communities/${comm}/numUsers`,
        headers
      );
      setNumOfUsers(result.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const getNumberOfPosts = async (comm) => {
    // comm = "Dogs";
    try {
      const result = await axios.get(
        `${Constant.API_URL}/communities/${comm}/numPosts`,
        headers
      );
      setNumOfPosts(result.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostActiveUser = async (comm) => {
    // comm = "Dogs";
    try {
      const result = await axios.get(
        `${Constant.API_URL}/communities/${comm}/mostActiveUser`,
        headers
      );
      setActiveUser(result.data.authorName);
    } catch (error) {
      console.log(error);
    }
  };

  const getMostUpvotedPosts = async (comm) => {
    // comm = "Cooking";
    try {
      const result = await axios.get(
        `${Constant.API_URL}/communities/${comm}/mostUpvotedPost`,
        headers
      );
      if (result.data && result.data.length !== 0) {
        setMostUpvoted(result.data[0]);
        setUpvoteMap({
          labels: Array.from(result.data, (post) => post.title),
          datasets: [
            {
              label: "Top 5 most upvoted posts",
              data: Array.from(result.data, (post) => post.score),
              backgroundColor: backgroundColor.slice(0, result.data.length - 1),
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMostActiveComm = async () => {
    try {
      const mostActiveCommunities = await axios.get(
        `${Constant.API_URL}/communities/mostActiveCommunity?createdBy=${userId}`,
        headers
      );
      if (
        mostActiveCommunities.data &&
        mostActiveCommunities.data.length !== 0
      ) {
        setMostActiveCommunity(mostActiveCommunities.data[0]._id);
        setActiveCommMap({
          labels: Array.from(mostActiveCommunities.data, (comm) => comm._id),
          datasets: [
            {
              label: "Top 5 communities by number of posts",
              data: Array.from(
                mostActiveCommunities.data,
                (comm) => comm.postCount
              ),
              backgroundColor: backgroundColor.slice(
                0,
                mostActiveCommunities.data.length - 1
              ),
            },
          ],
        });
        console.log(activeCommMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUserComms = async () => {
    try {
      const communities = await axios.get(
        `${Constant.API_URL}/communities?createdBy=${userId}`,
        headers
      );
      if (communities.data && communities.length !== 0) {
        setCommList(communities.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMostActiveComm();
    fetchAllUserComms();
  }, []);

  return (
    <div className="analytic">
      <Container>
        <Row style={{ marginTop: "20px" }} className="justify-content-center">
          <Col md={8}>
            <h2 style={{ textAlign: "center" }}>Your communities Analytics</h2>
          </Col>
        </Row>
        <Row className="rows justify-content-center">
          <Col xs={8}>
            <h4 style={{ textAlign: "center" }}>
              Community with maximum posts:
              <span style={{ color: "gray" }}> r/{mostActiveCommunity}</span>
            </h4>
            <Bar
              data={activeCommMap}
              options={{
                title: {
                  display: true,
                  text: "Top 5 communities by number of posts",
                  fontSize: 20,
                },
                legend: {
                  display: true,
                  position: "right",
                },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        callback: function (value) {
                          if (Number.isInteger(value)) {
                            return value;
                          } else {
                            return 0;
                          }
                        },
                        stepSize: 1,
                      },
                    },
                  ],
                },
              }}
            />
          </Col>
        </Row>
        <Row className="rows justify-content-center">
          <Col xs={8}>
            <h4 style={{ textAlign: "center" }}>
              View analytics per community
            </h4>
            <Form style={{ marginTop: "5px" }}>
              <Form.Group controlId="formComm">
                <Col
                  xs={5}
                  style={{ display: "inline-block", textAlign: "end" }}
                >
                  <Form.Label className="auth">Community</Form.Label>
                </Col>
                <Col xs={4} style={{ display: "inline-block" }}>
                  <Form.Control
                    as="select"
                    onChange={handleCommunityChange}
                    value={commName}
                  >
                    <option>Choose a community</option>
                    {commList.map((comm) => {
                      return (
                        <option key={comm.name} id={comm.name}>
                          {comm.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col xs={8}>
            <Col xs={4} className="cardCol">
              <Card>
                <Card.Body>
                  <Card.Title>Number of Users</Card.Title>
                  <Card.Text>{numOfUsers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={4} className="cardCol">
              <Card>
                <Card.Body>
                  <Card.Title>Number of Posts</Card.Title>
                  <Card.Text>{numOfPosts}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={4} className="cardCol">
              <Card>
                <Card.Body>
                  <Card.Title>Most active user</Card.Title>
                  <Card.Text>{activeUser || "None"}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Col>
          {mostUpvoted && (
            <Col xs={8}>
              <div className="posts">
                <div className="row mt-4">
                  <div className="col-2">
                    <div className="d-flex flex-column ps-5 mt-2">
                      <i data-test="fa" class="fa fa-lg fa-angle-up"></i>
                      <p className="fs-3 mt-2 pe-1">{mostUpvoted.score}</p>
                      <i
                        data-test="fa"
                        class="fa fa-lg fa-angle-down mt-n1"
                      ></i>
                    </div>
                  </div>
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {" "}
                          /r/{mostUpvoted.communityName} &nbsp; Posted by u/
                          {mostUpvoted.author} &nbsp;{" "}
                          <span className="fw-lighter fst-italic text-muted">
                            {ago(new Date(mostUpvoted.createdAt))}
                          </span>
                        </p>
                        <h5 className="card-title">{mostUpvoted.title}</h5>
                        <p className="card-text">{mostUpvoted.text} </p>
                        {mostUpvoted.image !== "" && (
                          <img
                            className="post__image"
                            src={mostUpvoted.image}
                            class="img-thumbnail"
                            alt="..."
                          />
                        )}
                        {mostUpvoted.url !== "" && (
                          <iframe
                            title={mostUpvoted._id}
                            src={mostUpvoted.url}
                            width="400"
                            height="400"
                          ></iframe>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          )}
          {mostUpvoted && (
            <Col xs={8}>
              <Bar
                data={upVoteMap}
                options={{
                  indexAxis: "y",
                  // Elements options apply to all of the options unless overridden in a dataset
                  // In this case, we are setting the border of each horizontal bar to be 2px wide
                  elements: {
                    bar: {
                      borderWidth: 1,
                    },
                  },
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    title: {
                      display: true,
                      text: "Top 5 upvoted posts",
                    },
                  },
                }}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    jwtToken: state.auth.jwtToken,
  };
};

export default connect(mapStateToProps)(Analytics);
