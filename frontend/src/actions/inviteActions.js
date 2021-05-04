import { SET_INVITE_UPDATED } from "./types";

export function setInviteUpdated(modalState) {
  return {
    type: SET_INVITE_UPDATED,
    bInviteUpdated: modalState,
  };
}
