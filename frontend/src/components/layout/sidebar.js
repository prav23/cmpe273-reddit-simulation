import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Sidebar extends Component {

  render() {
    const { isAuthenticated } = this.props.auth;
    return <></>;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Sidebar);
