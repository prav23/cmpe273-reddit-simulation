import {
    GET_DASHBOARD_DETAILS,
    DASHBOARD_LOADING,
    CLEAR_DASHBOARD_DETAILS
  } from '../actions/types';
  
  const initialState = {
    dashboardDetails: null,
    postsLoading: false,
  };
  
  export default function dashRed(state = initialState, action) {
    switch (action.type) {
      case DASHBOARD_LOADING:
        return {
          ...state,
          dashboardLoading: true
        };
      case GET_DASHBOARD_DETAILS:
        return {
          ...state,
          dashboardDetails: action.payload,
          dashboardLoading: false
        };
      
      case CLEAR_DASHBOARD_DETAILS:
        return {
          ...state,
          dashboardDetails: null,
        };
       
      default:
        return state;
    }
  }