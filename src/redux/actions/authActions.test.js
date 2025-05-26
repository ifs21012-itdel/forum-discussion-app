/* eslint-disable linebreak-style */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { loginUser, registerUser, logoutUser } from './authActions';
import * as api from '../../services/authService';
import { LOGIN_SUCCESS, LOGIN_FAILURE, REGISTER_SUCCESS, REGISTER_FAILURE } from '../types';
import * as threadActions from './threadAction'; // Import untuk spy

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockNavigate = jest.fn();
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
global.localStorage = mockLocalStorage;
const originalAlert = global.alert;

jest.mock('../../services/authService');
// Tidak perlu jest.mock('./threadAction') lagi jika kita menggunakan spyOn di beforeEach

describe('authActions thunks', () => {
  let store;
  let fetchThreadsSpy;

  beforeEach(() => {
    store = mockStore({ auth: { token: null } });
    mockNavigate.mockClear();
    api.login.mockClear();
    api.register.mockClear();
    localStorage.clear();
    global.alert = jest.fn();

    // Setup spy untuk fetchThreads sebelum setiap tes
    fetchThreadsSpy = jest.spyOn(threadActions, 'fetchThreads')
      .mockImplementation(() => ({ type: 'MOCK_FETCH_THREADS_CALLED_FROM_AUTH' }));
  });

  afterEach(() => {
    global.alert = originalAlert;
    fetchThreadsSpy.mockRestore(); // Restore original implementation after each test
  });

  describe('loginUser thunk', () => {
    it('should dispatch LOGIN_SUCCESS, call fetchThreads and navigate on successful login', async () => {
      const fakeToken = 'fake-login-token';
      api.login.mockResolvedValue({ data: { token: fakeToken } });

      await store.dispatch(loginUser('test@example.com', 'password', mockNavigate));

      const actions = store.getActions();
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(actions[0]).toEqual({ type: LOGIN_SUCCESS, payload: fakeToken });
      expect(localStorage.getItem('token')).toBe(fakeToken);
      expect(fetchThreadsSpy).toHaveBeenCalledTimes(1); // Verifikasi spy dipanggil
      // Karena fetchThreadsSpy mengembalikan plain action, itu yang akan di-dispatch
      expect(actions[1]).toEqual({ type: 'MOCK_FETCH_THREADS_CALLED_FROM_AUTH' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should dispatch LOGIN_FAILURE and alert on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      api.login.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(loginUser('test@example.com', 'wrongpassword', mockNavigate));

      const actions = store.getActions();
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
      expect(actions[0]).toEqual({ type: LOGIN_FAILURE, payload: errorMessage });
      expect(localStorage.getItem('token')).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith(`Login gagal: ${errorMessage}`);
      expect(fetchThreadsSpy).not.toHaveBeenCalled(); // Pastikan tidak dipanggil jika login gagal
    });
  });

  describe('registerUser thunk', () => {
    it('should dispatch REGISTER_SUCCESS and navigate on successful registration', async () => {
      const newUser = { id: 'user-test-123', name: 'Test User Reg' };
      api.register.mockResolvedValue({ data: { user: newUser } });

      await store.dispatch(registerUser('Test User Reg', 'register@example.com', 'password123', mockNavigate));

      const actions = store.getActions();
      expect(api.register).toHaveBeenCalledWith('Test User Reg', 'register@example.com', 'password123');
      expect(actions[0]).toEqual({ type: REGISTER_SUCCESS, payload: newUser });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should dispatch REGISTER_FAILURE and alert on failed registration', async () => {
      const errorMessage = 'Email already exists';
      api.register.mockRejectedValue(new Error(errorMessage));

      await store.dispatch(registerUser('Test User Reg', 'register@example.com', 'password123', mockNavigate));
      const actions = store.getActions();

      expect(api.register).toHaveBeenCalledWith('Test User Reg', 'register@example.com', 'password123');
      expect(actions[0]).toEqual({ type: REGISTER_FAILURE, payload: errorMessage });
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalledWith(`Pendaftaran gagal: ${errorMessage}`);
    });
  });

  describe('logoutUser thunk', () => {
    it('should remove token from localStorage, dispatch LOGIN_FAILURE, and navigate to /login', () => {
      localStorage.setItem('token', 'fake-token-to-remove');
      // Inisialisasi store dengan state yang relevan jika logoutUser bergantung pada getState
      store = mockStore({ auth: { token: 'fake-token-to-remove' } });


      store.dispatch(logoutUser(mockNavigate));

      const actions = store.getActions();
      expect(localStorage.getItem('token')).toBeNull();
      expect(actions[0]).toEqual({ type: LOGIN_FAILURE });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});