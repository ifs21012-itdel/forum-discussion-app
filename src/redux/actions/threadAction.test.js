/* eslint-disable linebreak-style */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchThreads, fetchThreadDetail, createComment, createThread } from './threadAction';
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

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const mockNavigate = jest.fn();
const originalAlert = global.alert;

jest.mock('../../services/threadService');

describe('threadActions thunks', () => {
  let store;

  beforeEach(() => {
    store = mockStore({ auth: { token: 'fake-token' } });
    mockNavigate.mockClear();
    global.alert = jest.fn();
    jest.clearAllMocks();

    const mockLocalStorage = (() => {
      let lsStore = { token: 'fake-token' };
      return {
        getItem: (key) => lsStore[key] || null,
        setItem: (key, value) => { lsStore[key] = value.toString(); },
        removeItem: (key) => { delete lsStore[key]; },
        clear: () => { lsStore = {}; },
      };
    })();
    global.localStorage = mockLocalStorage;
  });

  afterEach(() => {
    global.alert = originalAlert;
  });

  describe('fetchThreads thunk', () => {
    it('should dispatch FETCH_THREADS_REQUEST then FETCH_THREADS_SUCCESS on successful fetch', async () => {
      const threadsResponse = {
        data: {
          threads: [
            { id: 'thread-1', title: 'Thread 1', ownerId: 'user-1' },
            { id: 'thread-2', title: 'Thread 2', ownerId: 'user-2' },
          ],
        },
      };
      const detailThread1 = { data: { detailThread: { id: 'thread-1', title: 'Thread 1', owner: { name: 'Owner 1' } } } };
      const detailThread2 = { data: { detailThread: { id: 'thread-2', title: 'Thread 2', owner: { name: 'Owner 2' } } } };

      api.getAllThreads.mockResolvedValue(threadsResponse);
      api.getThreadDetail
        .mockResolvedValueOnce(detailThread1)
        .mockResolvedValueOnce(detailThread2);

      await store.dispatch(fetchThreads());
      const actions = store.getActions();

      expect(actions[0]).toEqual({ type: FETCH_THREADS_REQUEST });
      expect(api.getAllThreads).toHaveBeenCalledWith('fake-token');
      expect(api.getThreadDetail).toHaveBeenCalledWith('thread-1');
      expect(api.getThreadDetail).toHaveBeenCalledWith('thread-2');

      // PASTIKAN BAGIAN INI KEMBALI KE KONDISI YANG BENAR
      expect(actions[1]).toEqual({
        type: FETCH_THREADS_SUCCESS,
        payload: [detailThread1.data.detailThread, detailThread2.data.detailThread],
      });
    });

    it('should dispatch FETCH_THREADS_REQUEST then FETCH_THREADS_FAILURE on failed fetch', async () => {
      const errorMessage = 'Failed to fetch threads';
      api.getAllThreads.mockRejectedValue(new Error(errorMessage));
      console.error = jest.fn(); // Mock console.error untuk mencegah log di output tes

      await store.dispatch(fetchThreads());
      const actions = store.getActions();

      expect(actions[0]).toEqual({ type: FETCH_THREADS_REQUEST });
      expect(actions[1]).toEqual({ type: FETCH_THREADS_FAILURE, payload: errorMessage });
      expect(console.error).toHaveBeenCalledWith('Gagal mengambil daftar thread dengan detail pemilik:', expect.any(Error));
      console.error.mockRestore(); // Kembalikan implementasi asli console.error
    });
  });

  describe('fetchThreadDetail thunk', () => {
    it('should dispatch FETCH_THREAD_DETAIL_REQUEST then FETCH_THREAD_DETAIL_SUCCESS', async () => {
      const threadId = 'thread-xyz';
      const mockDetail = { id: threadId, title: 'Detail Test' };
      api.getThreadDetail.mockResolvedValue({ data: { detailThread: mockDetail } });

      await store.dispatch(fetchThreadDetail(threadId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({ type: FETCH_THREAD_DETAIL_REQUEST });
      expect(api.getThreadDetail).toHaveBeenCalledWith(threadId);
      expect(actions[1]).toEqual({ type: FETCH_THREAD_DETAIL_SUCCESS, payload: mockDetail });
    });

    it('should dispatch FETCH_THREAD_DETAIL_REQUEST then FETCH_THREAD_DETAIL_FAILURE', async () => {
      const threadId = 'thread-xyz';
      const errorMessage = 'Failed to fetch detail';
      api.getThreadDetail.mockRejectedValue(new Error(errorMessage));
      console.error = jest.fn();

      await store.dispatch(fetchThreadDetail(threadId));
      const actions = store.getActions();

      expect(actions[0]).toEqual({ type: FETCH_THREAD_DETAIL_REQUEST });
      expect(actions[1]).toEqual({ type: FETCH_THREAD_DETAIL_FAILURE, payload: errorMessage });
      expect(console.error).toHaveBeenCalledWith('Gagal mengambil detail thread:', expect.any(Error));
      console.error.mockRestore();
    });
  });


  describe('createComment thunk', () => {
    it('should dispatch CREATE_COMMENT_SUCCESS and then actions from refetching thread detail', async () => {
      const threadId = 'thread-123';
      const content = 'New comment';
      const token = 'user-token-for-comment';
      const mockComment = { id: 'comment-1', content };
      const mockThreadDetailAfterComment = { id: threadId, title: 'Test Thread', comments: [mockComment] };

      store = mockStore({ auth: { token } });

      api.addComment.mockResolvedValue({ data: { comment: mockComment } });
      api.getThreadDetail.mockResolvedValue({ data: { detailThread: mockThreadDetailAfterComment } });

      await store.dispatch(createComment(threadId, content, token));

      const actions = store.getActions();

      expect(api.addComment).toHaveBeenCalledWith(threadId, content, token);
      expect(actions.length).toBe(3);
      expect(actions[0]).toEqual({ type: CREATE_COMMENT_SUCCESS, payload: mockComment });
      expect(actions[1]).toEqual({ type: FETCH_THREAD_DETAIL_REQUEST });
      expect(actions[2]).toEqual({ type: FETCH_THREAD_DETAIL_SUCCESS, payload: mockThreadDetailAfterComment });
      expect(api.getThreadDetail).toHaveBeenCalledWith(threadId);
    });

    it('should dispatch CREATE_COMMENT_FAILURE and alert on failed comment creation', async () => {
      const threadId = 'thread-123';
      const content = 'New comment';
      const token = 'user-token';
      const errorMessage = 'Failed to create comment';
      api.addComment.mockRejectedValue(new Error(errorMessage));

      store = mockStore({ auth: { token } });
      await store.dispatch(createComment(threadId, content, token));

      const actions = store.getActions();
      expect(api.addComment).toHaveBeenCalledWith(threadId, content, token);
      expect(actions.length).toBe(1);
      expect(actions[0]).toEqual({ type: CREATE_COMMENT_FAILURE, payload: errorMessage });
      expect(global.alert).toHaveBeenCalledWith(`Gagal membuat komentar: ${errorMessage}`);
    });
  });

  describe('createThread thunk', () => {
    it('should dispatch CREATE_THREAD_REQUEST, then CREATE_THREAD_SUCCESS and navigate', async () => {
      const title = 'New Thread Title';
      const body = 'New Thread Body';
      const token = 'user-token';
      const mockThread = { id: 'thread-new', title, body };
      api.createThread.mockResolvedValue({ data: { thread: mockThread } });

      store = mockStore({ auth: { token } });
      await store.dispatch(createThread(title, body, token, mockNavigate));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CREATE_THREAD_REQUEST });
      expect(api.createThread).toHaveBeenCalledWith({ title, body }, token);
      expect(actions[1]).toEqual({ type: CREATE_THREAD_SUCCESS, payload: mockThread });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should dispatch CREATE_THREAD_REQUEST, then CREATE_THREAD_FAILURE and alert', async () => {
      const title = 'New Thread Title';
      const body = 'New Thread Body';
      const token = 'user-token';
      const errorMessage = 'Failed to create thread';
      api.createThread.mockRejectedValue(new Error(errorMessage));

      store = mockStore({ auth: { token } });
      await store.dispatch(createThread(title, body, token, mockNavigate));

      const actions = store.getActions();
      expect(actions[0]).toEqual({ type: CREATE_THREAD_REQUEST });
      expect(api.createThread).toHaveBeenCalledWith({ title, body }, token);
      expect(actions[1]).toEqual({ type: CREATE_THREAD_FAILURE, payload: errorMessage });
      expect(global.alert).toHaveBeenCalledWith(`Gagal membuat thread: ${errorMessage}`);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});