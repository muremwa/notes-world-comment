import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const commentZone = document.getElementById('comment-zone');
// url to get all comments
export const noteCommentsApi = commentZone.dataset.commentsUrl;

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    commentZone
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
