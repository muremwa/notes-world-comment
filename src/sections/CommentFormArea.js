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
                    <textarea name='comment-textarea' className="form-control" cols="40" rows="10" maxLength="140" required id="id_comment" placeholder="add comment here (use '@username' to mention someone)"></textarea>
                </div>
                <hr />

                <div id="comment-alert-info" className="alert alert-info alert-dismissible fade show" role="alert" style={hiddenFeature}>
                    <p>Posting your comment...</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <div id="comment-alert-error" className="alert alert-warning alert-dismissible fade show" role="alert" style={hiddenFeature}>
                    <p>Could not post your comment. Refresh the page and try again</p>
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <div className="col-sm-4">
                    <button type='submit' className='form-control'>Comment</button>
                </div>
            </form>
        );
    };
};

export default CommentForm;
