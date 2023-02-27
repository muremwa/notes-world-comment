import React, { useState, useEffect } from 'react';
import CommentForm from './sections/CommentFormArea';
import CommentSite from "./sections/comments/Comment";

import { fetchComments } from './actions/CommentActions';
import store, { storeEvents } from './stores/CommentStore';

import './App.css';
import loadingGif from "./img/l.gif";


export default function App () {
    const [note, setNote] = useState(null);
    const [user, setUser] = useState(null);
    const [initData, setInitData] = useState(true); // shall we load initial data
    const [error, setError] = useState(false); // an error occurred loading the comment section

    const reloadData = () => {
        setNote(null);
        setUser(null);
        setError(false);
        setInitData(true);
    };

    // load init data
    if (initData) {
        fetchComments(() => setError(true));
    }

    // listen to events from the store
    useEffect(() => {
        const initDataUpdate = () => {
            setInitData(false);
            setUser(store.user);
            setNote(store.note);
        };

        const commentsUpdate = () => {
            setNote({
                ...note,
                comments: store.note.comments
            });
        };

        store.on(storeEvents.FETCH_INIT_DATA, initDataUpdate);
        store.on(storeEvents.COMMENTS_UPDATE, commentsUpdate);

        return () => {
            store.removeListener(storeEvents.FETCH_INIT_DATA, initDataUpdate)
            store.removeListener(storeEvents.COMMENTS_UPDATE, commentsUpdate)
        };
    });

    // error occurred
    if (error) {
        return (
            <h2 className="init-sect error-sect">
                Could not load comment section
                <br/>
                <button onClick={reloadData} className="btn btn-outline-light">Try again</button>
            </h2>
        );
    }

    // no data loaded yet
    if (!note || !user) {
        return <h2 className="init-sect">Setting up comment section <img src={loadingGif} alt="loading gif"/></h2>
    }

    const commentsMessage = () => {
        if (note.comments.length > 1) {
            return `${note.comments.length} comments`;
        }
        return note.comments.length === 1? "1 comment": "no comments";
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
                <small className="text-warning">{ note.note } by { note.user.username } has {commentsMessage()}</small>
            </h3>

            <CommentForm />
            <hr/>
            <CommentSite note={note} />
        </div>
    );
}
