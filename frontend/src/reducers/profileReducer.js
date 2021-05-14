import { USER_PROFILE_GET, USER_PROFILE_UPDATE, USER_IMAGE_GET, USER_IMAGE_UPDATE } from '../actions/types';
  
const initialState = {
  user: {},
  image: {}
};

const profileReducer = (state = initialState, action) => {
  switch(action.type){
      case USER_PROFILE_GET:
        return {
            ...state,
            user: action.payload
        };
      case USER_PROFILE_UPDATE:
          return {
              ...state,
              user: action.payload
          };
      case USER_IMAGE_GET:
          return {
              ...state,
              image: action.payload
          };
      case USER_IMAGE_UPDATE:
          return {
              ...state,
              image: action.payload
          };
      default:
          return state;
  }
};

export default profileReducer;