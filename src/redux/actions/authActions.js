/* eslint-disable linebreak-style */
/* eslint-disable prefer-template */
/* eslint-disable linebreak-style */
import * as api from '../../services/authService';

import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../types';
import { fetchThreads } from '../actions/threadAction'; // Import fetchThreads

export const registerUser =
  (name, email, password, navigate) => async (dispatch) => {
    try {
      const data = await api.register(name, email, password);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: data.data.user,
      });
      navigate('/login');
    } catch (error) {
      dispatch({
        type: REGISTER_FAILURE,
        payload: error.message,
      });
      alert('Pendaftaran gagal: ' + error.message);
    }
  };

export const loginUser = (email, password, navigate) => async (dispatch) => {
  try {
    const data = await api.login(email, password);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data.data.token,
    });
    localStorage.setItem('token', data.data.token);
    navigate('/');
    // Dispatch fetchThreads setelah login berhasil
    dispatch(fetchThreads());
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.message,
    });
    alert('Login gagal: ' + error.message);
  }
};

// Contoh action untuk logout (jika diperlukan)
export const logoutUser = (navigate) => (dispatch) => {
  localStorage.removeItem('token');
  dispatch({ type: LOGIN_FAILURE }); // Atau buat type LOGOUT
  navigate('/login');
};