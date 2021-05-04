import { SET_CURRENT_USER, SET_JWT_TOKEN } from "../actions/types";
import isEmpty from "../validation/isEmpty";
const initialState = {
  isAuthenticated: false,
  user: {},
  jwtToken: "",
};

export default function authRed(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case SET_JWT_TOKEN:
      return {
        ...state,
        jwtToken: action.jwtToken,
      };
    default:
      return state;
  }
}
