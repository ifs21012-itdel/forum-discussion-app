/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../types';

const initialState = {
  token: localStorage.getItem('token'),
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        token: null,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
