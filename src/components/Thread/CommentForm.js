/* eslint-disable linebreak-style */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../redux/actions/threadAction';
import styled from 'styled-components';

const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 16px;
  min-height: 80px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  align-self: flex-start;
  background-color: #28a745; /* Green */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }
`;

function CommentForm({ threadId }) {
  const [content, setContent] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token) {
      dispatch(createComment(threadId, content, token));
      setContent('');
    } else {
      alert('Anda harus login untuk membuat komentar.');
    }
  };

  return (
    <div>
      <h3>Buat Komentar</h3>
      <Form onSubmit={handleSubmit}>
        <TextArea
          placeholder='Tulis komentar Anda di sini...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          data-testid="comment-input"
        />
        <Button type='submit' data-testid="submit-comment-button">Kirim Komentar</Button>
      </Form>
    </div>
  );
}

export default CommentForm;