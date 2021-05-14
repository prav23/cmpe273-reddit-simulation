import axios from "axios";
import { GET_USER_PROFILE, GET_USER_COMMUNITY } from "./types";
const { API_URL } = require('../utils/Constants').default;

//get user profile
export const getUserProfile = (data) => dispatch => {
  const user_name = data.user_name;
  axios.get(`${API_URL}/userprofile/${user_name}`)
    .then(response => { 
      console.log(response.data);
      dispatch({
        type: GET_USER_PROFILE,
        payload: response.data
      })
    })
    .catch(error => { 
      console.log(error) 
      if (error.response && error.response.data) {
        return dispatch({
            type: GET_USER_PROFILE,
            payload: error.response.data
        });
      }
      return;
    }); 
};
  
//get user community
export const getUserCommunity = (data) => dispatch => {
  const user_name = data.user_name;
  axios.get(`${API_URL}/userprofile/community/${user_name}`)
  .then(response => { 
    console.log(response.data);
    dispatch({
      type: GET_USER_COMMUNITY,
      payload: response.data
    })
  })
  .catch(error => { 
    console.log(error) 
    if (error.response && error.response.data) {
      return dispatch({
          type: GET_USER_COMMUNITY,
          payload: error.response.data
      });
    }
    return;
  }); 
};