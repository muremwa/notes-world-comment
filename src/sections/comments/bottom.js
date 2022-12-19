import React from 'react';

import { deleteComment, editComment } from '../../actions/CommentActions';


function CommentEditForm (props) {
    const formStyle = {
        display: 'none',
        marginTop: '2em',
        marginBottom: '0.5em'
    };

    const { url, commentText, formId, formToogle, editId, alertId } = props;

    const editCommentHandler = (event) => {
        event.preventDefault();
        const alerts = {
            INFO: {
                class: 'alert-info',
                message: 'posting your edit...'
            },
            WARNING: {
                class: 'alert-warning',
                message: 'could not edit your comment'
            }
        };

        const alertDiv = document.getElementById(alertId);
        const newComment = document.getElementById(editId).value;
        
        if (alertDiv) {
            alertDiv.classList.remove(alerts.WARNING.class);
            alertDiv.classList.add(alerts.INFO.class);
            alertDiv.innerHTML = alerts.INFO.message;
            alertDiv.style.display = '';
        }

        if (newComment !== commentText) {
            editComment(event.target, url, () => {
                alertDiv.classList.remove(alerts.INFO.class);
                alertDiv.classList.add(alerts.WARNING.class);
                alertDiv.innerHTML = alerts.WARNING.message;
                alertDiv.style.display = '';
            });
        } else {
            formToogle(true);
        }
    };

    return (
        <form className="row edit-comment-form" style={formStyle} id={formId} method="POST" onSubmit={editCommentHandler}>
            <div className="form-group col-sm-7">
                <textarea id={editId} className="form-control" rows="6" name='original_comment' required defaultValue={commentText}></textarea>
            </div>
            <div className="form-group col-sm-2">
                <input type="submit" className="btn btn-link form-control" value="edit" />
            </div>
            <div className="form-group col-sm-2">
                <input type="button" onClick={() => formToogle(true)} className="btn btn-link text-danger close-edit" value="close"/>
            </div>

            <div id={alertId} className="alert alert-info" role="alert" style={formStyle}>
                posting your edited comment...
            </div>
        </form>
    )
}


function DeleteCommentButton (props) {
    const { url, commentId } = props;

    const deleteCommentHandler = (event) => {
        event.preventDefault();
        const url = event.target.action;
        const delBtn = event.target.children['del-btn'];
        delBtn? delBtn.value = 'deleting comment...': void 0;
        deleteComment(url, event.target, commentId, () => {
            delBtn.disabled = true;
            delBtn.value = 'could not delete comment'
        });
    };

    return (
        <form className="col-sm-3 action-row-item" action={url} method='POST' onSubmit={deleteCommentHandler}>
            <input type="submit" value="delete comment" className="btn text-danger" name='del-btn'/>
        </form>
    )
}


export default function BottomAction (props) {
    const { ownsNote, editable, replyUrl, actionUrl, commentId, comment } = props;
    const formId = editable? `comment-${commentId}-edit`: null;
    const editId = editable? `comment-${commentId}-textarea`: null;
    const alertId = editable? `${formId}-alert`: null;
    
    const formToogle = editable? (open = false) => {
        // open - whether the form is visible or not
        const s = open? 'none': '';
        const f = document.getElementById(formId);
        f? f.style.display = s: void 0;
        const t = document.getElementById(editId);
        t && !open? t.focus(): void 0;
        const a = document.getElementById(alertId);
        a? a.style.display = 'none': void 0;
    }: null;

    return (
        <div className="action-buttons">
            <hr className="stupid-line" />
            <div className="row action-row">
                <a href={replyUrl} className="col-sm-2 btn action-row-item">reply</a>
                {editable? <button className="col-sm-3 btn action-row-item" onClick={() => formToogle(false)}>edit comment</button>: void 0}
                {editable || ownsNote? <DeleteCommentButton {...{url: actionUrl, commentId}} />: void 0}
            </div>
            {editable? <CommentEditForm {...{formToogle, formId, editId, alertId, url: actionUrl, commentText: comment}} />: null}
        </div>
    )
};