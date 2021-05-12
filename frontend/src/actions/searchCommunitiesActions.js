import { SEARCH_REDIRECT, RESET_SEARCH_REDIRECT } from "./types";

export const searchRedirect = () => (dispatch) => {
  dispatch({
    type: SEARCH_REDIRECT,
  });
};

export const resetSearchRedirect = () => (dispatch) => {
  dispatch({
    type: RESET_SEARCH_REDIRECT,
  });
};
