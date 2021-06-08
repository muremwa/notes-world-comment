import React,{ Component } from "react";
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

class CommentBody extends Component {
    render () {
        const {name, user, time, edited, replies, comment} = this.props;
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
                <BottomAction id={this.props.commentId} ownsNote={this.props.ownsNote} comment={comment} editable={this.props.editable} replyUrl={this.props.replyUrl} actionUrl={this.props.actionUrl}/>
            </div>
        );
    }
}


class Comment extends Component {
    /* 
    The whole comment container
    */
    render () {
        return (
            <div className="row text-primary comment" id={"comment"+this.props.commentId}>
                <UserImage user={this.props.user} profile={this.props.imageUrl}/>
                <CommentBody {...this.props}/>
                <hr />
            </div>
        )
    }
}


export default Comment;