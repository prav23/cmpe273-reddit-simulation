import { GET_MESSAGE, SEND_MESSAGE } from '../actions/types';
  
const initialState = {
  message: {},
  user: {}
};

const messageReducer = (state = initialState, action) => {
  switch(action.type){
      case GET_MESSAGE:
        return {
          ...state,
          message: action.payload
        };
      case SEND_MESSAGE:
        return {
          ...state,
          user: action.payload
        };
      default:
        return state;
  }
};

export default messageReducer;