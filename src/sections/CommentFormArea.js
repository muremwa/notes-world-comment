import React, {Component} from 'react';

class CommentForm extends Component {
    render () {
        return (
            <form method="post" encType="multipart/form-data">
                <div className="form-group">
                    <label>Comment:</label>
                    <textarea className="form-control" cols="40" rows="10" maxLength="140" required id="id_comment" placeholder="add comment here (use '@username' to mention someone ',' '.' '?' are supported after the username)(markdown is supported)"></textarea>
                </div>
                <hr />
                <button className='col-sm-4 form-control'>Comment</button>
            </form>
        );
    };
};

export default CommentForm;
