/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads } from '../../redux/actions/threadAction';
import ThreadItem from './ThreadItem';
import Loading from '../Loading';
import { Link } from 'react-router-dom';

function ThreadList() {
  const dispatch = useDispatch();
  const threads = useSelector((state) => state.thread.threads);
  const loading = useSelector((state) => state.thread.loading);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2>Daftar Diskusi</h2>
      <ul className='thread-list'>
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </ul>
      {token && (
        <div>
          <h3>Buat Thread Baru</h3>
          <Link to='/create-thread'>Buat Thread</Link>{' '}
        </div>
      )}
      {!token && <p>Anda harus login untuk membuat thread.</p>}
    </div>
  );
}

export default ThreadList;
