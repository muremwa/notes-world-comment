import React, { useRef, forwardRef } from 'react';

import { deleteComment as deleteCommentAction, editComment } from '../../actions/CommentActions';


const EditForm = forwardRef((props, ref) => {
    const { commentText, url } = props;
    const textAreaRef = useRef(null);
    const infoBannerRef = useRef(null);
    const errorBannerRef = useRef(null);

    const closeForm = () => {
        [infoBannerRef, errorBannerRef, ref].forEach((divRef) => {
            if (divRef.hasOwnProperty('current')) {
                divRef.current.style.display = 'none';
            }
        });
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
                errorBannerRef.current.scrollIntoView({ block: 'center' })
            });
        } else {
            closeForm();
        }
    }

    return (
        <>
            <form style={{ display: 'none' }} ref={ref} className='row edit-form' method="POST" onSubmit={submitEditForm}>
                <div className="form-group col-sm-8">
                    <textarea required rows={4} name='comment' ref={textAreaRef} className="form-control" defaultValue={commentText}></textarea>
                </div>

                <div className="form-group col-sm-2">
                    <input type="submit" value="edit" className="btn btn-link form-control"/>
                </div>

                <div className="form-group col-sm-2">
                    <button type='button' onClick={closeForm} className="btn btn-link form-control">close</button>
                </div>
            </form>

            <div className="alert alert-info" ref={infoBannerRef} style={{ display: 'none' }}>
                Editing your comment...
            </div>

            <div className="alert alert-warning" ref={errorBannerRef} style={{ display: 'none' }}>
                An error occurred editing your comment!
            </div>
        </>
    )
})


export default function BottomAction ({ comment }) {
    const { replyUrl, actionUrl } = comment;
    const actK = 'col-sm-3 action-row-item btn btn-link';
    const editFormRef = useRef(null);

    const openEditForm = () => {
        editFormRef.current.style.display = 'flex'
        const textAreaElement = editFormRef.current.querySelector('[name="comment"]');

        if (textAreaElement) {
            textAreaElement.focus();
            textAreaElement.value = comment.text;
        }
    };

    // function to delete a comment
    const deleteComment = (event_) => {
        if (comment.canDelete) {
            const delBtn = event_.target;
            delBtn.innerText = 'deleting comment';

            deleteCommentAction(actionUrl, () => {
                delBtn.innerText = 'could not delete comment';
                delBtn.disabled = true;
            });
        }
    };

    return (
        <div className="action-buttons">
            <hr className="stupid-line"/>
            
            <div className="row action-row">
                <a href={replyUrl} className={`${actK} text-primary`}>reply</a>

                { comment.canEdit? <button onClick={openEditForm} className={`${actK} text-dark`}>edit comment</button>: void 0}

                { comment.canDelete? <button onClick={deleteComment} className={`${actK} text-danger`}>delete comment</button>: void 0}
            </div>

            {comment.canEdit? <EditForm ref={editFormRef} commentText={comment.text} url={actionUrl} />: null}
        </div>
    )
}