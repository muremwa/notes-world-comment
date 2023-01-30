import React, { useRef, forwardRef } from 'react';

import { deleteComment as deleteCommentAction, editComment } from '../../actions/CommentActions';


const EditForm = forwardRef((props, ref) => {
    const { commentText, url } = props;
    const textAreaRef = useRef(null);
    const infoBannerRef = useRef(null);
    const errorBannerRef = useRef(null);

    const closeForm = () => {
        if (ref.hasOwnProperty('current')) {
            ref.current.style.display = 'none';
            textAreaRef.current.value = commentText;
        }
    };

    const submitEditForm = (event_) => {
        event_.preventDefault();
        const newText = textAreaRef.current.value;

        if (newText && newText !== commentText) {
            infoBannerRef.current.style.display = 'block';
            errorBannerRef.current.style.display = 'none';

            editComment(url,  newText,() => {
                infoBannerRef.current.style.display = 'none';
                closeForm();
            }, () => {
                infoBannerRef.current.style.display = 'none';
                errorBannerRef.current.style.display = 'block';
            });
        }
    }

    return (
        <form style={{ display: 'none' }} ref={ref} className='row' method="POST" onSubmit={submitEditForm}>
            <div className="form-group col-sm-8">
                <textarea name='comment' ref={textAreaRef} className="form-control" defaultValue={commentText}></textarea>
            </div>

            <div className="form-group col-sm-2">
                <input type="submit" value="edit" className="btn btn-link form-control"/>
            </div>

            <div className="form-group col-sm-2">
                <button type='button' onClick={closeForm} className="btn btn-link form-control">close</button>
            </div>

            <div className="alert alert-info" ref={infoBannerRef} style={{ display: 'none' }}>
                Editing your comment...
            </div>

            <div className="alert alert-warning" ref={errorBannerRef} style={{ display: 'none' }}>
                An error occurred editing your comment...
            </div>
        </form>
    )
})


export default function BottomAction ({ comment }) {
    const actK = 'col-sm-3 action-row-item';
    const editFormRef = useRef(null);
    const openEditForm = () => {
        editFormRef.current.style.display = 'flex'
        editFormRef.current.querySelector('[name="comment"]').focus();
    };

    // function to delete a comment
    const deleteComment = (event_) => {
        if (comment.canDelete) {
            const delBtn = event_.target;
            delBtn.innerText = 'deleting comment';

            deleteCommentAction(comment.actionUrl, () => {
                delBtn.innerText = 'could not delete comment';
                delBtn.disabled = true;
            });
        }
    };

    return (
        <div className="action-buttons">
            <hr className="stupid-line"/>
            
            <div className="row action-row">
                <a href={comment.replyUrl} className={actK}>reply</a>

                { comment.canEdit? <button onClick={openEditForm} className={actK}>edit comment</button>: void 0}

                { comment.canDelete? <button onClick={deleteComment} className={actK}>delete comment</button>: void 0}
            </div>

            {comment.canEdit? <EditForm ref={editFormRef} commentText={comment.text} url={comment.actionUrl} />: null}
        </div>
    )
}