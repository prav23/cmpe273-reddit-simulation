import axios from "axios";

import {
  GET_POSTS,
  POSTS_LOADING,
  CLEAR_POSTS
} from "./types";

// Get Dashboard Details
export const getPosts =  () => dispatch => {
  dispatch(setPostsLoading());
  axios
    .get(`http://localhost:3001/api/posts`)
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

