import defaultState from './state';
import {UPDATE_KEYBOARD, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_FIRST_NAME, UPDATE_LAST_NAME, UPDATE_HEIGHT} from './action_types';

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_KEYBOARD:
      return {...state, keyboardShowing: action.keyboardShowing};
    case UPDATE_EMAIL:
      return {...state, email: action.email};
    case UPDATE_FIRST_NAME:
      return {...state, firstName: action.firstName};
    case UPDATE_LAST_NAME:
      return {...state, lastName: action.lastName};
    case UPDATE_PASSWORD:
      return {...state, password: action.password};
    case UPDATE_HEIGHT:
      return {...state, height: action.height};
    default:
      return state;
  }
};

export default rootReducer;
