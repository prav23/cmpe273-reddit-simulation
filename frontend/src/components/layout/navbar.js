import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Button } from "react-bootstrap";
import { ChatIcon } from '@livechat/ui-kit';
import IconButton from '@material-ui/core/IconButton';
import logo from "../../icons/reddit-logo.png";
import "./navbar.css";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;
    // const { profile } = this.props.dashboard;
    // const isProfile = profile != null ? true : false;
    return (
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/dashboard">
            <img alt="logo" src={logo} height="25px" />
          </Link>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav w-100 d-flex justify-content-end">
              {!isAuthenticated && (
                <>
                  <li class="nav-item">
                    <Link class="nav-link" to="/login">
                      <Button className="login">Log In</Button>
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link class="nav-link" to="/register">
                      <Button className="signup">Sign Up</Button>
                    </Link>
                  </li>
                </>
              )}
              {isAuthenticated && (
                <>
                  <li class="nav-item">
                    <Link to="/communities">
                      Communities
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link to="/message">
                      <IconButton>
                        <ChatIcon color="#0854a5" />
                      </IconButton>
                    </Link>
                  </li>
                  <li class="nav-item">
                    <div class="dropdown">
                      <button
                        class="userName btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        { user.name }
                      </button>
                      <ul
                        class="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <Link class="nav-link" to="/">
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  dashboard: state.dashboard,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
