import axios from "axios";
import { GET_MESSAGE, SEND_MESSAGE } from "./types";

//get message list
export const getMessage = (data) => dispatch => {
  axios.get(`http://localhost:3001/api/message`)
    .then(response => { 
      //console.log(response.data);
      dispatch({
        type: GET_MESSAGE,
        payload: response.data
      })
    })
    .catch(error => { 
      console.log(error) 
      if (error.response && error.response.data) {
        return dispatch({
            type: GET_MESSAGE,
            payload: error.response.data
        });
      }
      return;
    }); 
};
  
//send messages
export const sendMessage = (data) => dispatch => {
  axios.post(`http://localhost:3001/api/message`, data)
  .then(response => { 
    dispatch({
      type: SEND_MESSAGE,
      payload: response.data
    })
    window.location.href = "/message";
  })
  .catch(error => { 
    console.log(error) 
    if (error.response && error.response.data) {
      return dispatch({
          type: SEND_MESSAGE,
          payload: error.response.data
      });
    }
    return;
  }); 
};