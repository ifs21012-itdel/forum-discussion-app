/* eslint-disable linebreak-style */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from './App';
import * as threadActions from './redux/actions/threadAction';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

// Mock fetchThreads action agar tidak menjalankan network request asli
// dan kita bisa memverifikasi pemanggilannya
jest.mock('./redux/actions/threadAction', () => {
  const originalModule = jest.requireActual('./redux/actions/threadAction');
  return {
    __esModule: true,
    ...originalModule, // Ini penting agar semua export lain tetap ada
    fetchThreads: jest.fn(() => ({ type: 'MOCK_FETCH_THREADS_CALLED' })), // Mock yang mengembalikan plain action
  };
});

describe('App component', () => {
  let store;

  beforeEach(() => {
    // Reset mock implementasi dan panggilan sebelum setiap tes
    threadActions.fetchThreads.mockImplementation(() => ({ type: 'MOCK_FETCH_THREADS_CALLED' }));
    threadActions.fetchThreads.mockClear();

    store = mockStore({
      auth: { token: null, user: null, error: null, isAuthenticated: false },
      thread: {
        threads: [], // Pastikan threads awal kosong atau sesuai kebutuhan
        loading: false,
        error: null,
        detailThread: null,
        loadingDetail: false,
      },
    });
  });

  it('should render the main title "Forum Diskusi Sederhana" and call fetchThreads', async () => {
    // Gunakan act untuk memastikan semua update (termasuk useEffect) selesai
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );
    });

    const mainTitle = screen.getByText(/Forum Diskusi Sederhana/i);
    expect(mainTitle).toBeInTheDocument();
    // HomePage akan dipanggil, dan di dalamnya ThreadList akan memanggil fetchThreads
    expect(threadActions.fetchThreads).toHaveBeenCalledTimes(1);
  });

  it('should render HomePage component when path is "/" and call fetchThreads', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );
    });
    expect(screen.getByText(/Daftar Diskusi/i)).toBeInTheDocument();
    expect(threadActions.fetchThreads).toHaveBeenCalledTimes(1);
  });
});