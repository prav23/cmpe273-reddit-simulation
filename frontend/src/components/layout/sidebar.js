import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Sidebar extends Component {

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
        isAuthenticated && <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse w-100">
          <div class="position-sticky pt-3">
            <ul class="nav flex-column">
            <li><Link class="nav-link" to="/dashboard">
                Dashboard
              </Link></li>
              {/* <li><Link class="nav-link" to="/activity">
                Activity
              </Link></li>
              <li><Link class="nav-link" to="/mygroups">
                My Groups
              </Link></li> */}
            </ul>
          </div>
       </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Sidebar);
