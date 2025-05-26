/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import threadReducer from './threadReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  thread: threadReducer,
});

export default rootReducer;
