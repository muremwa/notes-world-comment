import React, { useEffect, useRef, useMemo, useState } from "react";

import './Comment.css';
import BottomAction from "./bottom";
import commentStore from "../../stores/CommentStore";
import parseComment from "../../logic/CommentParse";
import { processDate } from "../../stores/utility";


/**
 * Match comment ID from a URL hash
 * @param { string } hash
 * @return { number }
 * */
function matchCommentId (hash) {
    const match = hash.match(/comment(?<commentId>\d+)/);

    if (match && match.groups && match.groups['commentId']) {
        return Number(match.groups['commentId']);
    }
    return -1;
}


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
    const { replies: commentReplies, created: commentCreated, time: commentTime, mentioned, text } = comment;
    const commentText = parseComment(text, mentioned);

    return (
        <div className="col-sm-11">
            <span className="r-comment-info">
                <strong>{ comment.user.fullName }</strong>
                <small className="text-danger"> @{ comment.user.username }</small>
                <span> • </span>
                <strong data-toggle="tooltip" data-placement="top" title={processDate(commentCreated)} className="dated">
                    { commentTime }
                </strong>
                <span> • </span>
                <Edited edited={comment.edited} />
                <span className="text-info"> {commentReplies} {commentReplies === 1? 'reply': 'replies'}</span>
            </span>

            <div className="r-comment-text">
                <p dangerouslySetInnerHTML={{ __html: commentText }}></p>
            </div>

            <BottomAction {...{comment}} />
        </div>
    )
}


function Comment ({ comment, focusComment }) {
    const { commentId } = comment;
    const commentRef = useRef(null);

    // scroll to requested comment
    useEffect(() => {
        if (focusComment === commentId) {
            const removeHighlight = () => commentRef.current.classList.remove('highlight-comment');
            commentRef.current.classList.add('highlight-comment');
            commentRef.current.scrollIntoView({ block: 'center' });
            commentRef.current.addEventListener('click', removeHighlight, { once: true });
            window.addEventListener('hashchange', removeHighlight, { once: true });
        }
    }, [focusComment]);

    return (
        <div ref={commentRef} className="row text-primary comment" id={`comment${ commentId }`}>
            <UserImage name={comment.user.username} profile={comment.user.profile}/>
            <CommentBody {...{ comment }}/>
            <hr />
        </div>
    )
}


export default function CommentSite ({ note }) {
    const [ locationHash, setLocationHash ] = useState(window.location.hash);
    const navCommentId = useMemo(() => matchCommentId(locationHash), [locationHash]);
    window.addEventListener('hashchange', () => setLocationHash(window.location.hash));

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
        return <Comment {...{comment, key: commentId, focusComment: navCommentId }} />
    });

    return (
        <div>
            { commentsParsed }
        </div>
    )
}