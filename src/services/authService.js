/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import fetchData from './api';

export const register = (name, email, password) => {
  return fetchData('/register', 'POST', { name, email, password });
};

export const login = (email, password) => {
  return fetchData('/login', 'POST', { email, password });
};
