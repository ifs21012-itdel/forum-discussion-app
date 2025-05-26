/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import React from 'react';
import { useSelector } from 'react-redux';
import CommentForm from './CommentForm';
import Loading from '../Loading';

function ThreadDetail() {
    const thread = useSelector((state) => state.thread.detailThread);
    const loading = useSelector((state) => state.thread.loadingDetail);
    const token = useSelector((state) => state.auth.token);

    if (loading) {
        return <Loading />;
    }

    if (!thread) {
        return <p>Thread tidak ditemukan.</p>;
    }

    const ownerNameParts = thread.owner.name.split(' ');
    const avatarInitial1 = ownerNameParts[0] ? ownerNameParts[0][0].toUpperCase() : '';
    const avatarInitial2 = ownerNameParts[1] ? ownerNameParts[1][0].toUpperCase() : '';
    const avatarText = avatarInitial1 + avatarInitial2;

    return (
        <div className="thread-detail">
            <style>
                {`
                    .thread-detail .thread-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                    }

                    .thread-detail .owner-info {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;
                    }

                    .thread-detail .avatar {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background-color: #ccc;
                        color: #fff;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 16px;
                        font-weight: bold;
                        margin-right: 10px;
                    }

                    .thread-detail .info {
                        margin: 0;
                        font-size: 0.9em;
                        color: #777;
                    }

                    /* Styling untuk komentar */
                    .thread-detail .comment-list {
                        list-style: none;
                        padding: 0;
                    }

                    .thread-detail .comment-item {
                        display: flex;
                        align-items: flex-start;
                        padding: 10px 0;
                        border-bottom: 1px solid #eee;
                    }

                    .thread-detail .comment-item:last-child {
                        border-bottom: none;
                    }

                    .thread-detail .comment-owner {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;
                    }

                    .thread-detail .comment-item .avatar {
                        width: 30px;
                        height: 30px;
                        font-size: 14px;
                    }

                    .thread-detail .comment-item .content {
                        flex-grow: 1;
                        margin: 0;
                    }
                `}
            </style>
            <div className="thread-header">
                <div className="owner-info">
                    <div className="avatar">{avatarText}</div>
                    <p className="info">Dibuat pada: {new Date(thread.createdAt).toLocaleDateString()} oleh {thread.owner.name}</p>
                </div>
                <h2>{thread.title}</h2>
            </div>
            <div className="body">{thread.body}</div>

            <h3>Komentar</h3>
            <ul className="comment-list">
                {thread.comments && thread.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </ul>

            {token && <CommentForm threadId={thread.id} />}
            {!token && <p>Anda harus login untuk memberikan komentar.</p>}
        </div>
    );
}

function CommentItem({ comment }) {
    const ownerNameParts = comment.owner.name.split(' ');
    const avatarInitial1 = ownerNameParts[0] ? ownerNameParts[0][0].toUpperCase() : '';
    const avatarInitial2 = ownerNameParts[1] ? ownerNameParts[1][0].toUpperCase() : '';
    const avatarText = avatarInitial1 + avatarInitial2;

    return (
        <li className="comment-item">
            <div className="comment-owner">
                <div className="avatar">{avatarText}</div>
                <p className="info">Dikirim pada: {new Date(comment.createdAt).toLocaleDateString()} oleh {comment.owner.name}</p>
            </div>
            <p className="content">{comment.content}</p>
        </li>
    );
}

export default ThreadDetail;