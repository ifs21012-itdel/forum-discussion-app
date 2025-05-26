/* eslint-disable linebreak-style */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk'; // <-- Import thunk
import LoginPage from './LoginPage';
import * as authActions from '../../redux/actions/authActions';

// Mock Redux store dengan middleware thunk
const middlewares = [thunk];
const mockStore = configureStore(middlewares);
let store;

jest.mock('../../redux/actions/authActions', () => ({
  loginUser: jest.fn(),
}));

/**
 * Test scenario for LoginPage component
 * (comments remain the same)
 */
describe('LoginPage component', () => {
  beforeEach(() => {
    store = mockStore({
      auth: { token: null, user: null, error: null },
    });
    authActions.loginUser.mockImplementation(() => ({ type: 'MOCK_LOGIN_USER_ACTION' })); // Simulate thunk returning an action or another thunk
    authActions.loginUser.mockClear();

    render(
      <Provider store={store}>
        <Router>
          <LoginPage />
        </Router>
      </Provider>
    );
  });

  it('should render login form correctly', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should allow typing in email and password fields', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('should call loginUser action when login button is clicked with valid data', () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(authActions.loginUser).toHaveBeenCalledTimes(1);
    expect(authActions.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', expect.any(Function));
  });

  it('should display a link to the register page', () => {
    const registerLink = screen.getByText(/Daftar di sini/i);
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});