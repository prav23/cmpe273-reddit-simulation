import axios from "axios";

import {
  GET_COMMENTS,
  COMMENTS_LOADING,
  CLEAR_COMMENTS,
  GET_ERRORS
} from "./types";

// Get Dashboard Details
export const getComments =  postId => dispatch => {
  dispatch(setCommentsLoading());
  axios
    .get(`http://localhost:3001/api/comments/${postId}`)
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
    .post("http://localhost:3001/api/comments", rootCommentData)
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
    .post("http://localhost:3001/api/comments/subcomment", subCommentData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};