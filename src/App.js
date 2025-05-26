/* eslint-disable linebreak-style */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import CreateThreadPage from './pages/CreateThreadPage';
import ThreadDetailPage from './pages/ThreadDetailPage';
// import { ThemeProvider } from 'styled-components'; // Uncomment jika menggunakan tema

// const theme = {
//   primaryColor: '#007bff',
//   secondaryColor: '#6c757d',
//   // ... tambahkan variabel tema lainnya
// };

function App() {
  return (
    // <ThemeProvider theme={theme}> // Uncomment jika menggunakan tema
    <div className='container'>
      <h1>Forum Diskusi Sederhana</h1>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/threads/:id' element={<ThreadDetailPage />} />
        <Route path="/create-thread" element={<CreateThreadPage />} />
      </Routes>
    </div>
    // </ThemeProvider> // Uncomment jika menggunakan tema
  );
}

export default App;