import React from "react";

import './Comment.css';



function UserImage({ profile, name }) {
    /*
    user's image on the comment section
    */
    return (
        <div className="col-sm-1 r-user-img">
            <img src={profile} alt={`profile picture for ${name}`} />
        </div>
    );
}

const Edited = ({ edited }) => edited? <span className='text-info'>edited sucker</span>: null;

function CommentBody ({ comment, note }) {
    return (
        <div className="col-sm-11">
            <span className="r-comment-info">
                <strong>{ comment.user.fullName }</strong>
                <small className="text-danger">@{ comment.user.username }</small>
                posted <strong className="dated">{ comment.time }</strong>
                <Edited edited={comment.edited} />
                <span className="text-info"> { comment.replies } {comment.replies === 1? 'reply': 'replies'}</span>
            </span>

            <div className="comment-text" id="comment-text">
                <p>Comment text goes here</p>
            </div>
        </div>
    )
}


function Comment ({ comment, note }) {
    return (
        <div className="row text-primary comment" id={`comment${ comment.commentId }`}>
            <UserImage name={comment.user.username} profile={comment.user.profile}/>
            <CommentBody {...{ comment, note }}/>
            <hr />
        </div>
    )
}


export default function CommentSite ({ note }) {
    if (note.comments.length === 0) {
        return (
            <div id="no-comments">
                <h3 className="alert-heading text-center">no comments yet to { note.note }</h3>
            </div>
        );
    }

    const commentsParsed = note.comments.map((comment, k) => <Comment {...{ comment, note, key: k}} />);

    return (
        <div>
            { commentsParsed }
        </div>
    )
}