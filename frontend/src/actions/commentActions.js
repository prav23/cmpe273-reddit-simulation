import axios from "axios";

import {
  GET_COMMENTS,
  COMMENTS_LOADING,
  CLEAR_COMMENTS,
  GET_ERRORS
} from "./types";
const { API_URL } = require('../utils/Constants').default;
// Get Dashboard Details
export const getComments =  postId => dispatch => {
  dispatch(setCommentsLoading());
  axios
    .get(`${API_URL}/comments/${postId}`)
    .then(res =>
      dispatch({
        type: GET_COMMENTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: COMMENTS_LOADING,
        payload: {}
      })
    );
};
  
// Posts loading
export const setCommentsLoading = () => {
  return {
    type: COMMENTS_LOADING
  };
};

// Clear Posts
export const clearPosts = () => {
  return {
    type: CLEAR_COMMENTS
  };
};

// Create Root Comments
export const createRootComment = (rootCommentData, history) => dispatch => {
  axios
    .post(`${API_URL}/comments`, rootCommentData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create Sub Comments
export const createSubComment = (subCommentData, history) => dispatch => {
  axios
    .post(`${API_URL}/comments/subcomment`, subCommentData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};