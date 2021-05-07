import axios from "axios";

import {
  GET_POSTS,
  POSTS_LOADING,
  CLEAR_POSTS,
  GET_ERRORS
} from "./types";
const { API_URL } = require('../utils/Constants').default;

// Get Dashboard Details
export const getPosts =  () => dispatch => {
  dispatch(setPostsLoading());
  axios
    .get(`${API_URL}/posts`)
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: POSTS_LOADING,
        payload: {}
      })
    );
};
  
// Posts loading
export const setPostsLoading = () => {
  return {
    type: POSTS_LOADING
  };
};

// Clear Posts
export const clearPosts = () => {
  return {
    type: CLEAR_POSTS
  };
};

// Create Posts
export const createPost = (postData, history) => dispatch => {
  axios
    .post(`${API_URL}/posts`, postData)
    .then(res => {
      const updatePostData = {
        communityName : postData.communityName,
      }
      axios.put(`${API_URL}/community/posts`, updatePostData)
      .then(res => history.push("/dashboard"));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
