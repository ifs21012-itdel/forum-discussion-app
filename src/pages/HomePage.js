/* eslint-disable linebreak-style */
import React from 'react';
import ThreadList from '../components/Thread/ThreadList';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions'; // Pastikan path ini benar

function HomePage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser(navigate));
  };

  return (
    <div>
      <div className='auth-links'>
        {!isAuthenticated ? (
          <>
            <Link to='/login'>Login</Link>
            <span> | </span>
            <Link to='/register'>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
      <ThreadList />
    </div>
  );
}

export default HomePage;