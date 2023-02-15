import React, { useRef } from 'react';
import { createComment } from '../actions/CommentActions';

import './CommentFormArea.css';
import loadingGif from '../img/l.gif';


function TextArea () {
    return (
        <textarea
            name='comment'
            className="form-control"
            cols="40"
            maxLength="140"
            id="id_comment"
            placeholder="add comment here (use '@username' to mention someone)"
            required
        ></textarea>
    );
}


export default function CommentFormArea () {
    const messageZone = useRef(null);
    const errorZone = useRef(null);
    const formRef = useRef(null);

    // turn input controls on and off
    const inputControl = (disable = false) => {
        [...formRef.current.querySelectorAll('.form-control')].forEach((control) => control.disabled = disable);
    }

    const successPostComment = () => {
        [messageZone, errorZone].forEach((zone) => zone.current.style.display = 'none');
        inputControl(false);
        formRef.current.reset();
    };

    const errorPostComment = () => {
        messageZone.current.style.display = 'none';
        errorZone.current.style.display = 'block';
        errorZone.current.scrollIntoView({ block: 'center' });
        inputControl(false);
    };

    // on submit form
    /**
     * @param {SubmitEvent} submitAction
     * */
    const postComment = (submitAction) => {
        submitAction.preventDefault();
        errorZone.current.style.display = 'none';
        messageZone.current.style.display = 'block';

        // extract the comment from the form
        const comment = new FormData(submitAction.target);
        inputControl(true);

        // engage action
        createComment(comment, successPostComment, errorPostComment);
    }

    return (
        <form ref={formRef} method="post" encType="multipart/form-data" onSubmit={postComment}>
            <div className="form-group">
                <label>Comment:</label>
                <TextArea />
            </div>
            <hr />

            <div ref={messageZone} className="comment-alert alert alert-info" role="alert">
                <p id="comment-alert-message">Posting your comment <img src={loadingGif} alt="loading GIF"/></p>
            </div>

            <div ref={errorZone} className="comment-alert alert alert-warning" role="alert">
                <p id="comment-alert-message">Could not post your comment. Refresh the page and try again</p>
            </div>

            <div className="col-sm-4">
                <button type='submit' className='form-control'>Comment</button>
            </div>
        </form>
    );
}