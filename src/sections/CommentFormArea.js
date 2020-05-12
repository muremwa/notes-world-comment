import React, {Component} from 'react';
import { createComment } from '../actions/CommentActions';

class CommentForm extends Component {
    /* 
    Top comment creating form
    */
    submitComment (e) {
        e.preventDefault();
        window.f = e.target.children;
        const comment = e.target.children[0].children[1].value;
        e.target.children[2].style.display = '';
        createComment(comment);
    };

    render () {
        const hiddenFeature = {display: 'none'};

        return (
            <form method="post" encType="multipart/form-data" onSubmit={this.submitComment.bind(this)}>
                <div className="form-group" name='comment-textarea-group'>
                    <label>Comment:</label>
                    <textarea name='comment-textarea' className="form-control" cols="40" rows="10" maxLength="140" required id="id_comment" placeholder="add comment here (use '@username' to mention someone ',' '.' '?' are supported after the username)(markdown is supported)"></textarea>
                </div>
                <hr />
                <div className="alert alert-info" id="comment-alert-info" name='comment-info' style={hiddenFeature}>
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    Posting your comment...
                </div>
                <div className="alert alert-warning" id="comment-alert-error" style={hiddenFeature}>
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    Could not post your comment. Refresh the page and try again
                </div>
                <button type='submit' className='col-sm-4 form-control'>Comment</button>
            </form>
        );
    };
};

export default CommentForm;
