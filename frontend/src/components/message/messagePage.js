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
import { getDashboardDetails } from '../../actions/dashboardActions';

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
  },
  message: {
      flexGrow: 1,
      fontSize: 20,
  }
});

class Message extends Component {
  constructor(props){
    super(props);
    this.state = {
        sentBy : "",
        receivedBy : "",
        message : "",
        messagelist : [],
        //auto suggest
        emaillist : [],
        emailsuggestions : [],
        emailtext : "",
        redirectVar: ""
    }
    //Bind the handlers to this class
    // this.sendMessage = this.sendMessage.bind(this); 
    // this.submitSearch = this.submitSearch.bind(this);
    this.messageChangeHandler = this.messageChangeHandler.bind(this);
    //auto complete
    this.emailSuggestionSelected = this.emailSuggestionSelected.bind(this);
    this.emailTextChange = this.emailTextChange.bind(this);
    this.renderEmailSuggestions = this.renderEmailSuggestions.bind(this);
  }
  componentDidMount() {
    axios.defaults.headers.common['authorization'] = localStorage.getItem('jwtToken');
    axios.get(`${API_URL}/users`)
    .then(response => { 
      let emaillist = response.data.data;
      console.log(emaillist);
      let emailarray = [];
      emaillist.allUsers.map((listing) => {
        emailarray.push(listing.email);
        this.setState({emaillist : emailarray})
      })
    })
    .catch(error => { console.log(error) });  
  }
  messageChangeHandler = (event) => {
    this.setState({message : event.target.message})
  }
  emailTextChange = (event) => {
    this.setState({receivedBy: event.target.value});
    const value = event.target.value;
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
    console.log(localStorage.getItem('jwtToken'));
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
                      {!this.state.messagelist.length && <Typography className={classes.message}>No Recent Chat to Show...</Typography>}
                      { this.state.messagelist.map((listing) => {
                          return (
                              <div>
                                  <Accordion>
                                      <AccordionDetails>
                                          <Grid container spacing={3}>
                                              <Grid item xs={3}>
                                                  <Typography className={classes.text}>Username: </Typography>
                                              </Grid>
                                              <Grid item xs={9}>
                                                  <Typography className={classes.text}>Date: </Typography>
                                              </Grid>
                                              <Grid item xs={8}>
                                                  <Typography className={classes.text}>message: </Typography>
                                              </Grid>
                                          </Grid>
                                      </AccordionDetails>
                                  </Accordion>
                                  <Divider />
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
  
};

const mapStateToProps = state => ({
  
});

export default connect(mapStateToProps, { getDashboardDetails})(withStyles(useStyles)(Message));