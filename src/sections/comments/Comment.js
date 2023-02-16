import React from "react";
import BottomAction from "./bottom";

import './Comment.css';
import commentStore from "../../stores/CommentStore";
import { processDate } from "../../stores/utility";


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

const Edited = ({ edited }) => edited? <> <span className='text-info'>edited</span> • </>: null;

function CommentBody ({ comment }) {
    const { replies: commentReplies, created: commentCreated, time: commentTime } = comment;

    return (
        <div className="col-sm-11">
            <span className="r-comment-info">
                <strong>{ comment.user.fullName }</strong>
                <small className="text-danger"> @{ comment.user.username }</small>
                <span> • </span>
                <strong data-toggle="tooltip" data-placement="top" title={processDate(commentCreated)} className="dated"> { commentTime }</strong>
                <span> • </span>
                <Edited edited={comment.edited} />
                <span className="text-info"> {commentReplies} {commentReplies === 1? 'reply': 'replies'}</span>
            </span>

            <div className="r-comment-text" id="comment-text">
                <p>{ comment.text }</p>
            </div>

            <BottomAction {...{comment}} />
        </div>
    )
}


function Comment ({ comment }) {
    const { commentId } = comment;

    return (
        <div className="row text-primary comment" id={`comment${ commentId }`}>
            <UserImage name={comment.user.username} profile={comment.user.profile}/>
            <CommentBody {...{ comment }}/>
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

    const commentsParsed = note.comments.map((comment) => ({
        ...comment,
        canEdit: commentStore.user.id === comment.user.id,
        canDelete: (commentStore.user.id === comment.user.id) || (commentStore.user.ownsNote)
    })).map((comment) => {
        const { commentId } = comment;
        return <Comment {...{comment, key: commentId}} />
    });

    return (
        <div>
            { commentsParsed }
        </div>
    )
}