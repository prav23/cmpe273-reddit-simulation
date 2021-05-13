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
import { getMessage, sendMessage } from '../../actions/messageActions';

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

class Message extends Component {
  constructor(props){
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);
    this.state = {
        sentBy : "",
        receivedBy : "",
        message : "",
        allmessagelist : [],
        messagelist : [],
        //auto suggest
        emaillist : [],
        emailsuggestions : [],
        emailtext : ""
    }
  }
  componentDidMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('jwtToken');
    axios.get(`${API_URL}/users`)
    .then(response => { 
      let emaillist = response.data.data.allUsers;
      console.log(response.data.data.allUsers);
      let emailarray = [];
      emaillist.map((listing) => {
        emailarray.push(listing.email);
        this.setState({emaillist : emailarray})
      })
    })
    .catch(error => { console.log(error) });  
  }
  componentWillMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('jwtToken');
    const data = {
      email : this.props.auth.user.email
    }
    this.props.getMessage(data);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
        var { message } = nextProps;
        let allmessage = Array.from(message);
        console.log(allmessage);
        let allmessagelist = [];
        allmessage.map((listing) => {
          if (listing.sentBy === this.props.auth.user.email || listing.receivedBy === this.props.auth.user.email)
            allmessagelist.push(listing);
        })
        allmessagelist.sort(function(a, b){return a.message_id - b.message_id});
        this.setState({allmessagelist : allmessagelist})
        let messagelist = [];
        allmessage.map((listing) => {
          if ((listing.sentBy === this.props.auth.user.email && listing.receivedBy === localStorage.getItem("receivedBy"))
            || (listing.receivedBy === this.props.auth.user.email && listing.sentBy === localStorage.getItem("receivedBy")))
            messagelist.push(listing);
        })
        messagelist.sort(function(a, b){return a.message_id - b.message_id});
        this.setState({messagelist : messagelist})
    }  
  }
  messageChangeHandler = (event) => {
    this.setState({message : event.target.value})
  }
  submitSearch = () => {
    let messagelist = this.state.allmessagelist;
    let message = [];
    messagelist.map((listing) => {
      if ((listing.sentBy === this.props.auth.user.email && listing.receivedBy === localStorage.getItem("receivedBy"))
            || (listing.receivedBy === this.props.auth.user.email && listing.sentBy === localStorage.getItem("receivedBy")))
        message.push(listing);
    })
    this.setState({messagelist : message})
  }
  sendMessage = () => {
    const data = {
      receivedBy : localStorage.getItem("receivedBy"),
      sentBy : this.props.auth.user.email,
      message : this.state.message
    }
    console.log(data);
    this.props.sendMessage(data); 
  }
  emailTextChange = (event) => {
    this.setState({receivedBy: event.target.value});
    const value = event.target.value;
    localStorage.setItem("receivedBy", value);
    let emailsuggestions = [];
    if (value.length > 0){
        const regex = new RegExp(`^${value}`, 'i');
        emailsuggestions = this.state.emaillist.sort().filter(v => regex.test(v));
    } 
    this.setState(() => ({emailsuggestions, emailtext:value}));
  }
  emailSuggestionSelected=(value)=>{
      this.setState(() => ({
          receivedBy : value,
          emailsuggestions : [],
      }));
      localStorage.setItem("receivedBy", value);
  }
  renderEmailSuggestions = () => {
      const {emailsuggestions} = this.state;
      if (emailsuggestions.length===0){
          return null;
      }
      return(
          <ul>
              {emailsuggestions.map((emaillist)=>
                  <li onClick={() => this.emailSuggestionSelected(emaillist)}>{emaillist}</li>
              )}
          </ul>
      )
  }

  render() {
    const { classes } = this.props;
    let redirectVar = null;
    console.log(this.state);
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
                            My Messages
                        </Typography>
                    </Toolbar>
                    <ListItem>
                      <Form.Group controlId="formUseremail">
                          <Form.Label>Please enter the user Email</Form.Label>
                          <Form.Control 
                              type="text" 
                              name="useremail" 
                              value={this.state.receivedBy}
                              onChange={this.emailTextChange}
                              placeholder="user email (required)" />
                      </Form.Group>
                    </ListItem>
                    {this.renderEmailSuggestions()}
                    <ListItem>
                      <Button variant="primary" type="submit" onClick = {this.submitSearch}>
                          Search
                      </Button>
                    </ListItem>
                    <div className="error" id="errorMsg" />  
                  </Grid>
                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                    <List>
                      <Typography className={classes.message}>Chat with {this.state.receivedBy}</Typography>
                      {!this.state.messagelist.length && <Typography className={classes.message}>No Recent Chat to Show...</Typography>}
                      { this.state.messagelist.map((listing) => {
                          return (
                              <div>
                                {/* sent from other */}
                                {listing.sentBy === localStorage.getItem("receivedBy") && <div>
                                  <Grid container spacing={1}>
                                    <Grid item xs={8}>
                                      <Accordion>
                                        <AccordionDetails>
                                          <Grid container spacing={1}>
                                              <Grid item xs={5}>
                                                <Typography className={classes.text}>{listing.sentBy}</Typography>
                                              </Grid>
                                              <Grid item xs={7}>
                                                  <Typography className={classes.date}>{listing.createdAt}</Typography>
                                              </Grid>
                                              <Grid item xs={8}>
                                                  <Typography className={classes.text}>{listing.message}</Typography>
                                              </Grid>
                                            </Grid>
                                          </AccordionDetails>
                                      </Accordion>
                                      <Divider />
                                    </Grid>
                                    <Grid item xs={4}></Grid>
                                  </Grid>
                                </div>}
                                {/* sent from the user */}
                                {listing.sentBy === this.props.auth.user.email && <div>
                                  <Grid container spacing={1}>
                                    <Grid item xs={4}></Grid>
                                    <Grid item xs={8}>
                                      <Accordion className={classes.accord}>
                                          <AccordionDetails>
                                              <Grid container spacing={1}>
                                                  <Grid item xs={5}>
                                                      <Typography className={classes.text}>{this.props.auth.user.name}</Typography>                                              </Grid>
                                                  <Grid item xs={7}>
                                                      <Typography className={classes.date}>{listing.createdAt}</Typography>
                                                  </Grid>
                                                  <Grid item xs={8}>
                                                      <Typography className={classes.text}>{listing.message}</Typography>
                                                  </Grid>
                                              </Grid>
                                          </AccordionDetails>
                                      </Accordion>
                                      <Divider />
                                    </Grid>
                                  </Grid>
                                </div>}
                              </div>
                              );        
                          })
                      }                                            
                      </List>

                      <Grid container spacing={1}>
                        <Grid item xs={11}>
                          <Form.Group controlId="formMessage">
                              <Form.Control 
                                  type="text" 
                                  name="message" 
                                  value={this.state.message}
                                  onChange={this.messageChangeHandler}
                                  placeholder="Please enter the message" />
                          </Form.Group>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton onClick = {this.sendMessage}>
                            <SendIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
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

Message.propTypes = {
  auth: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getMessage: PropTypes.object.isRequired,
  sendMessage: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  message: state.message.message,
  user: state.message.user,
});

export default connect(mapStateToProps, { getMessage, sendMessage})(withStyles(useStyles)(Message));