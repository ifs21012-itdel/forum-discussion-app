/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchThreadDetail } from '../redux/actions/threadAction'; // Path diperbaiki
import ThreadDetail from '../components/Thread/ThreadDetail'; // Path diperbaiki
import { useParams } from 'react-router-dom';

function ThreadDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchThreadDetail(id));
    }, [dispatch, id]);

    return (
        <div>
            <ThreadDetail />
        </div>
    );
}

export default ThreadDetailPage;