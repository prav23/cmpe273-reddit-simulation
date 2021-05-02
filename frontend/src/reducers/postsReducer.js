import {
    GET_POSTS,
    POSTS_LOADING,
    CLEAR_POSTS
    
  } from '../actions/types';
  
  const initialState = {
    postsDetails: [],
    postsloading: false,
  };
  
  export default function postsRed(state = initialState, action) {
    switch (action.type) {
      case POSTS_LOADING:
        return {
          ...state,
          postsloading: true
        };
      case GET_POSTS:
        return {
          ...state,
          postsDetails: action.payload,
          postsloading: false
        };
      
      case CLEAR_POSTS:
        return {
          ...state,
          postsDetails: [],
        };
       
      default:
        return state;
    }
  }