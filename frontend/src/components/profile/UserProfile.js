import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import {Redirect} from 'react-router';
import { Accordion, AccordionDetails, Divider, List } from "@material-ui/core";
import { Grid, Toolbar, Typography, Paper } from "@material-ui/core";
import { Form, Button } from 'react-bootstrap';
import { SendIcon } from '@livechat/ui-kit';
import IconButton from '@material-ui/core/IconButton';
import setAuthToken from '../../utils/setAuthToken';
import { getUserProfile, getUserCommunity } from '../../actions/userprofileActions';

const { API_URL } = require('../../utils/Constants').default;
const axios = require('axios').default;
const useStyles = (theme) => ({
  root: {
      flexGrow: 1,
      margin: theme.spacing(1),
  },
  title: {
      flexGrow: 1,
      fontSize: 30,
      fontWeight: 'bold',
      textAlign: 'left'
  },
  paper: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: "#ebeef5",
  },
  text: {
    flexGrow: 1,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  date: {
    flexGrow: 1,
    fontSize: 13,
    textAlign: 'left',
  },
  message: {
      flexGrow: 1,
      fontSize: 20,
  },
  accord: {
    backgroundColor: "#b4eefa"
  }
});

class UserProfile extends Component {
  constructor(props){
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);
    this.state = {
      userprofile: "",
      communitylist: [],
    }
  }
  componentWillMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('jwtToken');
    const data = {
      user_id : localStorage.getItem("user_id")
    }
    this.props.getUserProfile(data);
    this.props.getUserCommunity(data);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      var { user } = nextProps;
      console.log(user);
      this.setState({
        userprofile : user
      })
    }  
    if (nextProps.community) {
        var { community } = nextProps;
        console.log(community);
        let communityArray = Array.from(community);
        //console.log(communityArray);
        this.setState({
          communitylist : communityArray
        })
    }  
  }

  render() {
    const { classes } = this.props;
    let redirectVar = null;
    console.log(this.state);
    console.log(this.props.user);
    if(!localStorage.getItem("jwtToken")){
        redirectVar = <Redirect to= "/"/>
    }
    return (
      <div>
      {redirectVar}
      <div className={classes.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} spacing={1}>
              <Grid container spacing={5}>
                  <Grid item xs={4}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            User Profile
                        </Typography>
                    </Toolbar>
                    
                  </Grid>
                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <List>
                      <Typography className={classes.text}>username: {this.props.user.name}</Typography>
                      <Typography className={classes.text}>email: {this.props.user.email}</Typography>
                      <Typography className={classes.text}>gender: {this.props.user.gender}</Typography>
                      <Typography className={classes.text}>location: {this.props.user.location}</Typography>                            
                      </List>

                    </Paper>
                    
                  </Grid>
              </Grid>
            </Grid>
        </Grid>
      </div>  
      </div>
    );
  }
}

UserProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  community: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getUserProfile: PropTypes.object.isRequired,
  getUserCommunity: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  community: state.userprofile.community,
  user: state.userprofile.user,
});

export default connect(mapStateToProps, { getUserProfile, getUserCommunity })(withStyles(useStyles)(UserProfile));