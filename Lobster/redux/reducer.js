import defaultState from './state';

const rootReducer = (state = defaultState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default rootReducer;
