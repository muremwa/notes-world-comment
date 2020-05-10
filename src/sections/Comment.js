import React,{ Component } from "react";
import { deleteComment } from '../actions/CommentActions';
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
    return <button onClick={props.clickHandler} className={"btn btn-link text-"+buttonType} data-id={props.id} data-url={props.actionUrl}>{props.action}</button>
}


class BottomAction extends Component {
    constructor () {
        super();
        this.state = {
            actions: [
                {
                    action: 'reply',
                    actionUrl: '/reply/',
                    edit: true,
                    clickHandler: function (e) {
                        // handle the reply button click
                        const replyUrl = e.target.attributes['data-url'].value;
                        window.location.href = replyUrl;
                    }
                },
                {
                    action: 'edit comment',
                    actionUrl: '/edit/',
                    edit: true,
                    clickHandler: function (e) {
                        console.log(e.target);
                    }
                },
                {
                    action: 'delete comment',
                    actionUrl: '/delete/',
                    edit: true,
                    clickHandler: function (e) {
                        const url = e.target.attributes['data-url'].value;
                        const commentId = e.target.attributes['data-id'].value;
                        e.target.parentElement.parentElement.parentElement.innerHTML = "<h2 class='text-center' style='margin-left: 20%'>comment deleted!</h2>"
                        deleteComment(url, commentId);
                    }
                },
                {
                    action: 'flag',
                    actionUrl: '/flag/',
                    edit: false,
                    clickHandler: function (e) {
                        console.log(e.target);
                    }
                },
            ]
        }
    };

    render () {
        const {replyUrl, deleteUrl, id} = this.props;

        const actionButtons = this.state.actions.filter(
            (action) => action.edit === this.props.editable || action.action === 'reply'
        ).map(function (action, i) {
            // use appropriate urls mappings
            if (action.action === 'reply') {
                action.actionUrl = replyUrl;
            } else if (action.action === 'delete comment') {
                action.actionUrl = deleteUrl;
            };
            return <ActionButton key={i} id={id} {...action} />;
        });

        return (
            <div className="action-buttons">
                {actionButtons}
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
                <BottomAction id={this.props.commentId} editable={this.props.editable} replyUrl={this.props.replyUrl} deleteUrl={this.props.deleteUrl}/>
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