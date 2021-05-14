import axios from "axios";
import { USER_PROFILE_GET, USER_PROFILE_UPDATE, USER_IMAGE_GET, USER_IMAGE_UPDATE } from "./types";
const { API_URL } = require('../utils/Constants').default;

export const getUserProfile = (data) => dispatch => {
  const user_email = data.user_email;
  axios.get(`${API_URL}/profile/${user_email}`)
  .then(response => {
      dispatch({
          type: USER_PROFILE_GET,
          payload: response.data
      })
      console.log(response.data);
  })
  .catch(error => {
      console.log(error);
  });   
}

export const updateUserProfile = (userProfileData) => dispatch => {
  axios.post(`${API_URL}/profile`, userProfileData)
      .then(response => response.data)
      .then(data => {
          if (data === 'Success_Update') {
              localStorage.setItem("email", userProfileData.email);
              alert("Profile Successfully Updated!");
          }
          else { // (data === 'User_Exist') 
              alert("Failed to update! The email is already exist, please enter another one.");
          }
          return dispatch({
              type: USER_PROFILE_UPDATE,
              payload: data
          })
      })
      .catch(error => {
          console.log(error);
          alert("Failed to update! The email is already exist, please enter another one.");
      });
}

export const getUserImage = (data) => dispatch => {
  const user_email = data.user_email;
  axios.get(`${API_URL}/image/${user_email}`)
  .then(response => {
      dispatch({
          type: USER_IMAGE_GET,
          payload: response.data
      });
      console.log(response.data);
  })
  .catch(error => {
      console.log(error);
  });  
}

export const updateUserImage = (data, formData, uploadConfig) => dispatch => {
  const user_email = data.user_email;
  axios.post(`${API_URL}/image/${user_email}`, formData, uploadConfig)
      .then(response => {
          dispatch({
              type: USER_IMAGE_UPDATE,
              payload: response.data,
              status: response.status
          })
          if (response.status === 200){
              console.log(response.data)
              alert("Image Successfully Uploaded!");
          }
          else {
              alert("Failed to upload");
          }
      })
      .catch(error => {
          console.log(error);
          alert("Failed to upload");
      });
}