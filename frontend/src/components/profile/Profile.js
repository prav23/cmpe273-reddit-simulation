import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';
import { Grid, Typography } from "@material-ui/core";
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import setAuthToken from '../../utils/setAuthToken';
import { getUserProfile, updateUserProfile, getUserImage, updateUserImage } from '../../actions/profileActions';

const { API_URL } = require('../../utils/Constants').default;

const useStyles = (theme) => ({
  root: {
    marginTop: theme.spacing(5),
  },
  title: {
      flexGrow: 1,
      fontSize: 25,
  },
});

class Profile extends Component {
  constructor(props){
    super(props);
    const { user } = this.props.auth;
    setAuthToken(user.token);
    this.state = {
      user_id: "",
      name : "",
      email : "",
      gender : "",
      location : "",
      description : "",
      topics : "",
      password: "",
      image : "default",
      file : ""
    }
  }
  componentWillMount() {
    const data = {
      user_email : this.props.auth.user.email
    }
    this.props.getUserProfile(data);
    this.props.getUserImage(data);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      var { user } = nextProps;
      this.setState({
          name: user.name || this.state.name,
          gender: user.gender || this.state.gender,
          location: user.location || this.state.location,
          description: user.description || this.state.description,
          password: user.password || this.state.password,
          image: user.image || this.state.image,
          topics: user.topics || this.state.topics,
      });
    }
    if (nextProps.image) {
        var { image } = nextProps;
        this.setState({
            image: image,
        });
    }
    console.log(this.state);
  }
  nameChangeHandler = (e) => {this.setState({name : e.target.value})}
  genderChangeHandler = (e) => {this.setState({gender : e.target.value})}
  locationChangeHandler = (e) => {this.setState({location : e.target.value})}
  descriptionChangeHandler = (e) => {this.setState({description : e.target.value})}
  passwordChangeHandler = (e) => {this.setState({password : e.target.value})}
  topicsChangeHandler = (e) => {this.setState({topics : e.target.value})}
  imageChangeHandler = (e) => {this.setState({file: e.target.files[0]});}
  //submit image
  submitImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", this.state.file);
    console.log(this.state.file);
    const uploadConfig = {
        headers: {
            "content-type": "multipart/form-data"
        }
    };
    this.props.updateUserImage(formData, uploadConfig); 
  }
  submitProfile = (e) => {
    e.preventDefault();
    const data = {
        name : this.state.name,
        gender : this.state.gender,
        location : this.state.location,
        description : this.state.description,
        password : this.state.password,
        topics : this.state.topics
    }
    //console.log(data);
    this.props.updateUserProfile(data);
  }

  render() {
    const { classes } = this.props;
    let redirectVar = null;
    console.log(this.state);
    console.log(this.props.user);
    var imageSrc = `${API_URL}/image/path/${this.state.image}`;
    if(!localStorage.getItem("jwtToken")){
        redirectVar = <Redirect to= "/"/>
    }
    return (
      <div>
      {redirectVar}
      <div className={classes.root}>
          <Typography variant="h6" className={classes.title}>
              My Profile
          </Typography>
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Card style={{ width: '20rem' }}>
                    <Card.Img variant="top" src={imageSrc} />
                </Card>
                <div class="custom-file" style={{width: "90%"}}>
                    <input type="file" class="custom-file-input" name="image" accept="image/*" onChange={this.imageChangeHandler}/>
                </div><br/>
                <Button type="submit" variant="primary" onClick={this.submitImage}>Upload</Button>
                <br/><br/>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Your name: {this.state.name}</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="name"
                            value={this.state.name}
                            onChange={this.nameChangeHandler}
                            placeholder="Enter new username" />
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                    <Form.Group controlId="formGender">
                        <Form.Label>Your gender: {this.state.gender}</Form.Label>
                        <Form.Control as="select" 
                            onChange={this.genderChangeHandler} 
                            value={this.state.gender}
                            defaultValue="default">
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="not wish to tell">not wish to tell</option>
                        </Form.Control>
                    </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                      <Form.Group controlId="formLocation">
                          <Form.Label>Your location: {this.state.location}</Form.Label>
                          <Form.Control 
                              type="text" 
                              name="location"
                              value={this.state.location}
                              onChange={this.locationChangeHandler}
                              placeholder="Enter new location address" />
                      </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                      <Form.Group controlId="formDescription">
                          <Form.Label>Your Description: {this.state.description}</Form.Label>
                          <Form.Control
                              type="text" 
                              name="description"
                              onChange={this.descriptionChangeHandler} 
                              value={this.state.description}
                              placeholder="Enter your description" />
                      </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                      <Form.Group controlId="formPassword">
                          <Form.Label>Change Your password:</Form.Label>
                          <Form.Control 
                              type="password" 
                              name="password"
                              value={this.state.password}
                              onChange={this.passwordChangeHandler}
                              placeholder="Enter new password" />
                      </Form.Group>
                  </Grid>
                  <Grid item xs={12}>
                      <Form.Group controlId="formTopics">
                          <Form.Label>Your chosen topics: {this.state.topics}</Form.Label>
                          <Form.Control as="select" 
                              onChange={this.topicsChangeHandler} 
                              value={this.state.topics}
                              defaultValue="English">
                              <option value="English">English</option>
                              <option value="Animal">Animal</option>
                          </Form.Control>
                      </Form.Group>
                  </Grid>
              </Grid>
              <Button variant="primary" type="submit" onClick = {this.submitProfile}>
                  Save
              </Button>
            </Grid>
            </Grid>
          </Form>
          <div className="error" id="errorMsg" />                 
        </div> 
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  getUserProfile: PropTypes.func.isRequired,
  updateUserProfile: PropTypes.func.isRequired,
  getUserImage: PropTypes.func.isRequired,
  updateUserImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  image: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.profile.user,
  image: state.profile.image
});

export default connect(mapStateToProps, { getUserProfile, updateUserProfile, getUserImage, updateUserImage })(withStyles(useStyles)(Profile));