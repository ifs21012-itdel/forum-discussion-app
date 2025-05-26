/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import * as api from '../../services/threadService';
import {
  FETCH_THREADS_REQUEST,
  FETCH_THREADS_SUCCESS,
  FETCH_THREADS_FAILURE,
  FETCH_THREAD_DETAIL_REQUEST,
  FETCH_THREAD_DETAIL_SUCCESS,
  FETCH_THREAD_DETAIL_FAILURE,
  CREATE_COMMENT_SUCCESS,
  CREATE_COMMENT_FAILURE,
  CREATE_THREAD_REQUEST,
  CREATE_THREAD_SUCCESS,
  CREATE_THREAD_FAILURE,
} from '../types';

export const fetchThreads = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_THREADS_REQUEST });
  try {
    const token = getState().auth.token || localStorage.getItem('token');
    const threadsResponse = await api.getAllThreads(token);
    const threadsWithOwners = await Promise.all(
      threadsResponse.data.threads.map(async (thread) => {
        const detailResponse = await api.getThreadDetail(thread.id);
        return detailResponse.data.detailThread; // Asumsi getThreadDetail mengembalikan objek thread lengkap
      })
    );
    dispatch({
      type: FETCH_THREADS_SUCCESS,
      payload: threadsWithOwners,
    });
  } catch (error) {
    dispatch({
      type: FETCH_THREADS_FAILURE,
      payload: error.message,
    });
    console.error('Gagal mengambil daftar thread dengan detail pemilik:', error);
  }
};

export const fetchThreadDetail = (id) => async (dispatch) => {
  dispatch({ type: FETCH_THREAD_DETAIL_REQUEST });
  try {
    const data = await api.getThreadDetail(id);
    dispatch({
      type: FETCH_THREAD_DETAIL_SUCCESS,
      payload: data.data.detailThread,
    });
  } catch (error) {
    dispatch({
      type: FETCH_THREAD_DETAIL_FAILURE,
      payload: error.message,
    });
    console.error('Gagal mengambil detail thread:', error);
  }
};

// src/redux/actions/threadAction.js - potongan relevan
export const createComment = (threadId, content, token) => async (dispatch) => {
  try {
    const data = await api.addComment(threadId, content, token);
    dispatch({
      type: CREATE_COMMENT_SUCCESS,
      payload: data.data.comment,
    });
    // Pastikan baris ini memiliki 'await'
    await dispatch(fetchThreadDetail(threadId)); // <--- AWAIT INI SANGAT PENTING
  } catch (error) {
    dispatch({
      type: CREATE_COMMENT_FAILURE,
      payload: error.message,
    });
    alert(`Gagal membuat komentar: ${error.message}`);
  }
};

export const createThread = (title, body, token, navigate) => async (dispatch) => {
  dispatch({ type: CREATE_THREAD_REQUEST });
  try {
    const data = await api.createThread({ title, body }, token); // Asumsi api.createThread menerima objek { title, body }
    dispatch({
      type: CREATE_THREAD_SUCCESS,
      payload: data.data.thread, // Asumsi respons memiliki data.thread
    });
    navigate('/'); // Setelah berhasil membuat thread, arahkan kembali ke halaman utama
  } catch (error) {
    dispatch({
      type: CREATE_THREAD_FAILURE,
      payload: error.message,
    });
    alert(`Gagal membuat thread: ${error.message}`);
  }
};