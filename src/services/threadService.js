/* eslint-disable linebreak-style */
import axios from 'axios';

const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

export const getAllThreads = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/threads`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil semua thread:', error);
    throw error;
  }
};

export const getThreadDetail = async (threadId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/threads/${threadId}`);
    return response.data;
  } catch (error) {
    console.error(`Gagal mengambil detail thread dengan ID ${threadId}:`, error);
    throw error;
  }
};

export const createThread = async (threadData, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/threads`,
      threadData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Gagal membuat thread:', error);
    throw error;
  }
};

export const addComment = async (threadId, content, token) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/threads/${threadId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Gagal menambahkan komentar ke thread ${threadId}:`, error);
    throw error;
  }
};

// Anda bisa menambahkan fungsi lain untuk upvote, downvote, dll. sesuai kebutuhan