import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ListGroup, Col } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";

import Constant from "../../utils/Constants";

import "./navbar.css";

const Sidebar = ({ auth }) => {
  const [commList, setCommList] = React.useState([]);

  useEffect(() => {
    axios.get(`${Constant.API_URL}/communities/all`).then(
      (results) => {
        if (results.status === 200) {
          setCommList(results.data);
        }
      },
      (error) => {
        console.log(error);
        setCommList([]);
      }
    );
  }, []);

  return (
    <Col xs={2} style={{ display: "inline-block" }}>
      <h4>Communities</h4>
      <ListGroup>
        {commList.map((item) => {
          return (
            <ListGroup.Item key={item._id}>
              <Link to={`/communityhome/${item.name}`}>
                <span>r/{item.name}</span>
              </Link>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Col>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Sidebar);
