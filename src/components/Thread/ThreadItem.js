/* eslint-disable linebreak-style */

import React from 'react';

import { Link } from 'react-router-dom';



function ThreadItem({ thread }) {

  return (

    <li className='thread-item'>

      <h3>

        <Link to={`/threads/${thread?.id}`}>{thread?.title}</Link>

      </h3>

      {thread?.body && <p>{thread?.body?.substring(0, 100)}...</p>}

      <p className='info'>

Dibuat pada: {thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : 'Tanggal tidak tersedia'} oleh{' '}

        {thread?.owner?.name || 'Pengguna Anonim'}

        <span className='comment-count'>Komentar: {thread?.totalComments || 0}</span>

      </p>

    </li>

  );

}



export default ThreadItem;

