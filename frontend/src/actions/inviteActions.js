import {
  SET_INVITE_UPDATED,
  SET_COMMUNITY_ID,
  SET_COMMUNITY_NAME,
} from "./types";

export function setInviteUpdated(modalState) {
  return {
    type: SET_INVITE_UPDATED,
    bInviteUpdated: modalState,
  };
}

export function setCommunityId(modalState) {
  return {
    type: SET_COMMUNITY_ID,
    communityId: modalState,
  };
}

export function setCommunityName(modalState) {
  return {
    type: SET_COMMUNITY_NAME,
    communityName: modalState,
  };
}
