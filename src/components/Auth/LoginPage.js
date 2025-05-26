/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%;
  max-width: 400px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const RegisterLink = styled.p`
  margin-top: 20px;
  font-size: 14px;
  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(email, password, navigate));
  };

  return (
    <FormContainer>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <FormGroup>
          <label htmlFor='email'>Email:</label>
          <input
            type='email'
            id='email'
            data-testid='email-input'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            data-testid='password-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Button type='submit' data-testid='login-button'>Login</Button>
        </FormGroup>
      </form>
      <RegisterLink>
        Belum punya akun? <Link to='/register'>Daftar di sini</Link>
      </RegisterLink>
    </FormContainer>
  );
}

export default LoginPage;