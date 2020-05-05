import React,{ Component } from "react";
import parseComment from '../logic/CommentParse';

function UserImage(props) {
    return (
        <div className="col-sm-1 user-img">                
            <img src={props.profile} alt={"profile picture for "+props.user} />
        </div>
    );
}



function ActionButton (props) {
    const buttonType = function () {
        return props.action === 'delete comment'? 'danger': 'dark';
    }();
    return <button className={"btn btn-link text-"+buttonType} href={props.actionUrl}>{props.action}</button>
}


class BottomAction extends Component {
    render () {
        return (
            <div className="action-buttons">
                <ActionButton action={'reply'} actionUrl='/notes/'/>
                <ActionButton action={'edit'} actionUrl='/notes/'/>
                <ActionButton action={'delete comment'} actionUrl='/notes/'/>
            </div>
        )
    }
}


function Edited (props) {
    let statement_edited = <span className="text-info">edited</span>;
    let statement = <span className="text-info"></span>;

    if (props.edited) {
        return statement_edited;
    } else {
        return statement;
    }
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
                </span>
                <span className="text-info"> {replies} replies</span>
                <div className="comment-text">
                    <p dangerouslySetInnerHTML={{__html: cleanComment}}></p>
                </div>
                <BottomAction />
            </div>
        );
    }
}


class Comment extends Component {
    render () {
        return (
            <div className="row text-primary comment">
                <UserImage user={this.props.user} profile={'http://127.0.0.1:8000'+this.props.imageUrl}/>
                <CommentBody {...this.props}/>
                <hr />
            </div>
        )
    }
}


export default Comment;