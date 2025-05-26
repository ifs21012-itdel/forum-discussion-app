/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createThread } from '../redux/actions/threadAction';
import styled from 'styled-components';

const CreateThreadContainer = styled.div`
  padding: 20px;
  max-width: 700px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #333;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 16px;
    &:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }

  &.cancel {
    background-color: #6c757d;
    &:hover {
      background-color: #5a6268;
    }
  }
`;

function CreateThreadPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body && token) {
      dispatch(createThread(title, body, token, navigate));
    } else if (!token) {
      alert('Anda harus login untuk membuat thread.');
      navigate('/login');
    }
    else {
      alert('Judul dan isi thread harus diisi.');
    }
  };

  return (
    <CreateThreadContainer>
      <h2>Buat Thread Baru</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="title">Judul:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            data-testid="title-input"
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="body">Isi Thread:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="5"
            required
            data-testid="body-input"
          ></textarea>
        </FormGroup>
        <ButtonContainer>
          <Button type="submit" data-testid="create-thread-button">Buat Thread</Button>
          <Button type="button" className="cancel" onClick={() => navigate('/')}>
                        Batal
          </Button>
        </ButtonContainer>
      </form>
    </CreateThreadContainer>
  );
}

export default CreateThreadPage;