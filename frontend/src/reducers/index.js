import {combineReducers} from 'redux';
import authReducer from './authReducer';
// import errorReducer from './errorReducer';
import dashboardReducer from './dashboardReducer';
import postsReducer from './postsReducer';
import commentsReducer from './commentsReducer';
import { USER_LOGOUT } from '../actions/types';

const appReducer = combineReducers({
/* your app’s top-level reducers */
    auth:authReducer,
    dashboard: dashboardReducer,
    posts: postsReducer,
    comments: commentsReducer,
})
  
const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer;