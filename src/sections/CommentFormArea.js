import React from 'react';
import { createComment } from '../actions/CommentActions';


export default function CommentFormArea () {
    const hiddenFeature = {display: 'none'};

    const handleCreateComment = (event) => {
        event.preventDefault();
        const alerts = {
            INFO: {
                class: 'alert-info',
                message: 'Posting your comment...'
            },
            WARNING: {
                class: 'alert-warning',
                message: 'Could not post your comment. Refresh the page and try again'
            }
        };
        
        const alertDiv = document.getElementById('comment-alert');
        const alertMessageDiv = document.getElementById('comment-alert-message');
        const form = event.target;
        
        if (alertDiv) {
            alertDiv.classList.remove(alerts.WARNING.class);
            alertDiv.classList.add(alerts.INFO.class);
            alertMessageDiv.innerText = alerts.INFO.message;
            alertDiv.style.display = '';
        }

        createComment(event.target, () => {
            alertDiv.style.display = 'none';
            form.reset()
        }, () => {
            if (alertDiv) {
                alertDiv.classList.remove(alerts.INFO.class);
                alertDiv.classList.add(alerts.WARNING.class);
                alertMessageDiv.innerText = alerts.WARNING.message;
                alertDiv.style.display = '';
            }
        });


    };

    return (
        <form method="post" encType="multipart/form-data" onSubmit={handleCreateComment}>
            <div className="form-group">
                <label>Comment:</label>
                <textarea name='comment' className="form-control" cols="40" rows="10" maxLength="140" required id="id_comment" placeholder="add comment here (use '@username' to mention someone)"></textarea>
            </div>
            <hr />

            <div id="comment-alert" className="alert alert-info" role="alert" style={hiddenFeature}>
                <p id="comment-alert-message">Posting your comment...</p>
            </div>

            <div className="col-sm-4">
                <button type='submit' className='form-control'>Comment</button>
            </div>
        </form>
    );
};
