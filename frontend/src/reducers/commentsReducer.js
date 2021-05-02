import {
    GET_COMMENTS,
    COMMENTS_LOADING,
    CLEAR_COMMENTS
    
  } from '../actions/types';
  
  const initialState = {
    commentsDetails: [],
    commentsloading: false,
  };
  
  export default function commentsRed(state = initialState, action) {
    switch (action.type) {
      case COMMENTS_LOADING:
        return {
          ...state,
          commentsloading: true
        };
      case GET_COMMENTS:
        return {
          ...state,
          commentsDetails: action.payload,
          commentsloading: false
        };
      
      case CLEAR_COMMENTS:
        return {
          ...state,
          commentsDetails: [],
        };
       
      default:
        return state;
    }
  }