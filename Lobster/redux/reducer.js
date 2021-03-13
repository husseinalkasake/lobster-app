import defaultState from './state';
import {UPDATE_KEYBOARD, UPDATE_EMAIL, UPDATE_NAME, UPDATE_HEIGHT, SIGN_IN_USER, UPDATE_SESSION_ID, UPDATE_DESK_CONNECTION, LOG_OUT} from './action_types';

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_KEYBOARD:
      return {...state, keyboardShowing: action.keyboardShowing};
    case UPDATE_EMAIL:
      return {...state, email: action.email};
    case UPDATE_NAME:
      return {...state, name: action.name};
    case UPDATE_HEIGHT:
      return {...state, height: action.height};
    case SIGN_IN_USER:
      return {...state, userId: action.userId, height: action.height, name: action.name, isSignedIn: true};
    case UPDATE_SESSION_ID:
      return {...state, sessionId: action.sessionId};
    case UPDATE_DESK_CONNECTION:
      return {...state, deskConnected: action.deskConnected};
    case LOG_OUT:
      return {...state, isSignedIn: false};
    default:
      return state;
  }
};

export default rootReducer;
