/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import {
  FETCH_THREADS_REQUEST,
  FETCH_THREADS_SUCCESS,
  FETCH_THREADS_FAILURE,
  FETCH_THREAD_DETAIL_REQUEST,
  FETCH_THREAD_DETAIL_SUCCESS,
  FETCH_THREAD_DETAIL_FAILURE,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
} from '../types';

const initialState = {
  loading: false,
  threads: [],
  error: null,
  loadingDetail: false,
  detailThread: null,
  errorDetail: null,
};

const threadReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_THREADS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_THREADS_SUCCESS:
      return {
        ...state,
        loading: false,
        threads: action.payload,
      };
    case FETCH_THREADS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_THREAD_DETAIL_REQUEST:
      return {
        ...state,
        loadingDetail: true,
        errorDetail: null,
        detailThread: null,
      };
    case FETCH_THREAD_DETAIL_SUCCESS:
      return {
        ...state,
        loadingDetail: false,
        detailThread: action.payload,
      };
    case FETCH_THREAD_DETAIL_FAILURE:
      return {
        ...state,
        loadingDetail: false,
        errorDetail: action.payload,
      };
    case CREATE_COMMENT_SUCCESS:
      // Kita akan refetch detail thread, jadi tidak perlu update state secara manual di sini
      return state;
    case CREATE_COMMENT_FAILURE:
      return {
        ...state,
        errorDetail: action.payload,
      };
    default:
      return state;
  }
};

export default threadReducer;
