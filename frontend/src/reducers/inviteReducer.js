import {
  SET_INVITE_UPDATED,
  SET_COMMUNITY_ID,
  SET_COMMUNITY_NAME,
} from "../actions/types";

const initialState = {
  bInviteUpdated: false,
  communityId: "",
  communityName: "",
};

const inviteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INVITE_UPDATED:
      return {
        ...state,
        bInviteUpdated: action.bInviteUpdated,
      };
    case SET_COMMUNITY_ID:
      return {
        ...state,
        communityId: action.communityId,
      };
    case SET_COMMUNITY_NAME:
      return {
        ...state,
        communityName: action.communityName,
      };
    default:
      return {
        ...state,
      };
  }
};

export default inviteReducer;
