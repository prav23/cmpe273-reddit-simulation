import axios from "axios";

import {
  GET_DASHBOARD_DETAILS,
  DASHBOARD_LOADING,
  CLEAR_DASHBOARD_DETAILS
} from "./types";

const { API_URL } = require('../utils/Constants').default;

// Get Dashboard Details
export const getDashboardDetails =  user_id => dispatch => {
  console.log('actions')
  dispatch(setDashboardLoading());
  axios
    .get(`${API_URL}/dashboard?id=${user_id}`)
    .then(res =>
      dispatch({
        type: GET_DASHBOARD_DETAILS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_DASHBOARD_DETAILS,
        payload: [],
      })
    );
};
  
// Dashboard loading
export const setDashboardLoading = () => {
  return {
    type: DASHBOARD_LOADING
  };
};

// Clear Dashboard details
export const clearDashboarDetails = () => {
  return {
    type: CLEAR_DASHBOARD_DETAILS
  };
};

