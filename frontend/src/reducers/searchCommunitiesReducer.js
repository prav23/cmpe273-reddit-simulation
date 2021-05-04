import {
    RESET_SEARCH_REDIRECT,
    SEARCH_REDIRECT,
    
  } from '../actions/types';

  const initialState = {
    redirectToSearchPage: false,
  };

  export default function searchComRed(state = initialState, action) {
    switch (action.type) {
      case SEARCH_REDIRECT:
        return {
          ...state,
          redirectToSearchPage: true,
        };
      case RESET_SEARCH_REDIRECT:
        return {
            ...state,
            redirectToSearchPage: false,
        }
      default:
        return state;
    }
  }