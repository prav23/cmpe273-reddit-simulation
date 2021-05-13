import { GET_USER_PROFILE, GET_USER_COMMUNITY } from '../actions/types';
  
const initialState = {
  community: {},
  user: {}
};

const userprofileReducer = (state = initialState, action) => {
  switch(action.type){
      case GET_USER_PROFILE:
        return {
          ...state,
          user: action.payload
        };
      case GET_USER_COMMUNITY:
        return {
          ...state,
          community: action.payload
        };
      default:
        return state;
  }
};

export default userprofileReducer;