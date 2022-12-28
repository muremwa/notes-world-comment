import React, { useState, useEffect } from 'react';
import { fetchComments } from './actions/CommentActions';
import store, { storeEvents } from './stores/CommentStore';
import loadingGif from "./img/l.gif";

import './App.css';


export default function App () {
    const [note, updateNote] = useState(null);
    const [user, updateUser] = useState(null);
    const [initData, updateInitData] = useState(true); // shall we load initial data
    const [error, updateError] = useState(false); // an error occurred loading the comment section

    const reloadData = () => {
        updateNote(null);
        updateUser(null);
        updateError(false);
        updateInitData(true);
    };

    // load init data
    if (initData) {
        updateInitData(false);
        fetchComments(() => updateError(true));
    }

    // listen to events from the store
    useEffect(() => {
        const initDataUpdate = () => {
            updateUser(store.user);
            updateNote(store.note);
        };
        store.on(storeEvents.FETCH_INIT_DATA, initDataUpdate);

        return () => {
            store.removeListener(storeEvents.FETCH_INIT_DATA, initDataUpdate)
        };
    })

    // error occurred
    if (error) {
        return <h2 className='init-sect error-sect'>
            Could not comment section
            <button onClick={reloadData} className="btn btn-light">Retry</button>
        </h2>
    }

    // no data loaded yet
    if (!note || !user) {
        return <h2 className="init-sect">Setting up comment section <img src={loadingGif} alt="loading gif"/></h2>
    }

    const commentsMessage = () => {
        if (note.comments.length === 1) {
            return "1 comment";
        } else if (note.comments.length === 0) {
            return "no comments";
        } else {
            return `${note.comments.length} comments`;
        }
    };

    return (
        <div id="comments-section">
            <div className="row" id="loading-dock">
                <div className="col">
                    <button onClick={reloadData} className="btn btn-link">reload comments</button>
                </div>
            </div>

            <h3>comments <br/> { note.note } by { note.user.username } has {commentsMessage()}</h3>
        </div>
    );
}
