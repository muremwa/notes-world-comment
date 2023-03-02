import React, { useState, useEffect } from 'react';
import CommentForm from './sections/CommentFormArea';
import CommentSite from "./sections/comments/Comment";

import { fetchComments } from './actions/CommentActions';
import store, { storeEvents } from './stores/CommentStore';

import './App.css';
import loadingGif from "./img/l.gif";


export default function App () {
    const initialData = { user: {}, note: {}, error: false, loadData: true }
    const [ commentAppData, setCommentAppData ] = useState(initialData);
    const reloadData = () => setCommentAppData(initialData);

    // load init data
    if (commentAppData.loadData) {
        fetchComments(() => setCommentAppData({ ...commentAppData, loadData: false, error: true }));
    }

    // listen to events from the store
    useEffect(() => {
        const initialDataUpdate = () => {
            setCommentAppData({user: store.user, note: store.note, error: false, loadData: false});
        };

        const commentsUpdate = () => {
            setCommentAppData({ ...commentAppData,  note: store.note })
        };

        store.on(storeEvents.FETCH_INIT_DATA, initialDataUpdate);
        store.on(storeEvents.COMMENTS_UPDATE, commentsUpdate);

        return () => {
            store.removeListener(storeEvents.FETCH_INIT_DATA, initialDataUpdate)
            store.removeListener(storeEvents.COMMENTS_UPDATE, commentsUpdate)
        };
    });

    // error occurred
    if (commentAppData.error) {
        return (
            <h2 className="init-sect error-sect">
                Could not load comment section
                <br/>
                <button onClick={reloadData} className="btn btn-outline-light">Try again</button>
            </h2>
        );
    }

    // no data loaded yet
    if (!commentAppData.note.note || !commentAppData.user.username) {
        return <h2 className="init-sect">Setting up comment section <img src={loadingGif} alt="loading gif"/></h2>
    }

    const commentsMessage = () => {
        if (commentAppData.note.comments.length > 1) {
            return `${commentAppData.note.comments.length} comments`;
        }
        return commentAppData.note.comments.length === 1? "1 comment": "no comments";
    };

    return (
        <div id="comments-section">
            <div className="row" id="loading-dock">
                <div className="col">
                    <button onClick={reloadData} className="btn btn-link">reload comments</button>
                </div>
            </div>

            <h3>
                comments <br/>
                <small className="text-warning">{ commentAppData.note.note } by { commentAppData.note.user.username } has {commentsMessage()}</small>
            </h3>

            <CommentForm />
            <hr/>
            <CommentSite note={commentAppData.note} />
        </div>
    );
}
