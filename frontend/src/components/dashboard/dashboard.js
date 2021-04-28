import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getDashboardDetails } from '../../actions/dashboardActions';

class Dashboard extends Component {
  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if(isAuthenticated){
      //this.props.getDashboardDetails(user.user_id);
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    // const { dashboardDetails, dashboardloading } = this.props.dashboard;

    return (
      isAuthenticated && <div className="dashboard">

      </div>
    );
  }
}

Dashboard.propTypes = {
  getDashboardDetails: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  dashboard: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  dashboard: state.dashboard,
  auth: state.auth,
});

export default connect(mapStateToProps, { getDashboardDetails})(Dashboard);