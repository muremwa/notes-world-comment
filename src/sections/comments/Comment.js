import React from "react";
import parseComment from '../../logic/CommentParse';

import BottomAction from './bottom';


function UserImage(props) {
    /* 
    user's image on the comment section
    */
    return (
        <div className="col-sm-1 user-img">                
            <img src={props.profile} alt={"profile picture for "+props.user} />
        </div>
    );
}


function Edited (props) {
    if (!props.edited) {
        return null;
    }
    return <span className="text-info">edited</span>;
}


function CommentBody (props) {
    const { name, user, time, edited, replies, comment, commentId, ownsNote, editable, replyUrl, actionUrl } = props;
    const cleanComment = parseComment(comment);

    return (
        <div className="col-sm-11">
            <span className="comment-info">
                <strong>{name} </strong> 
                <small className="text-danger">@{user} </small> 
                posted <strong className="dated">{time} </strong>
                <Edited edited={edited} />
                <span className="text-info"> {replies} replies</span>
            </span>
            <div className="comment-text" name='comment-text'>
                <p dangerouslySetInnerHTML={{__html: cleanComment}}></p>
            </div>
            <BottomAction {...{commentId, ownsNote, comment, editable, replyUrl, actionUrl}} />
        </div>
    );
};


export default function Comment (props) {
    return (
        <div className="row text-primary comment" id={`comment${props.commentId}`}>
            <UserImage user={props.user} profile={props.imageUrl}/>
            <CommentBody {...props}/>
            <hr />
        </div>
    )
};