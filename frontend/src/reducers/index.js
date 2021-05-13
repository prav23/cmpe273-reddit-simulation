import { combineReducers } from "redux";
import authReducer from "./authReducer";
// import errorReducer from './errorReducer';
import dashboardReducer from './dashboardReducer';
import postsReducer from './postsReducer';
import commentsReducer from './commentsReducer';
import inviteReducer from "./inviteReducer";
import searchCommunitiesReducer from './searchCommunitiesReducer';
import messageReducer from './messageReducer';
import userprofileReducer from './userprofileReducer';
import { USER_LOGOUT } from '../actions/types';

const appReducer = combineReducers({
/* your app’s top-level reducers */
    auth:authReducer,
    dashboard: dashboardReducer,
    posts: postsReducer,
    comments: commentsReducer,
    searchCommunities: searchCommunitiesReducer,
    invite: inviteReducer,
    message: messageReducer,
    userprofile: userprofileReducer,
})
  
const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
