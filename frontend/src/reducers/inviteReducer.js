import { SET_INVITE_UPDATED } from "../actions/types";

const initialState = {
  bInviteUpdated: false,
};

const inviteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INVITE_UPDATED:
      return {
        ...state,
        bInviteUpdated: action.bInviteUpdated,
      };
    default:
      return {
        ...state,
      };
  }
};

export default inviteReducer;
