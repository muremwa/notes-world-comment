import React,{ Component } from "react";
import { deleteComment, editComment } from '../actions/CommentActions';
import parseComment from '../logic/CommentParse';

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


function ActionButton (props) {
    /* 
    buttons under the comment
    */
    const buttonType = props.action === 'delete comment'? 'danger': 'dark';
    return <button onClick={props.clickHandler} className={"btn btn-link text-"+buttonType} data-id={props.id} data-url={props.actionUrl}>{props.action}</button>
}


class CommentEditForm extends Component {    
    /* 
    Form that appears under a comment section to enable one to edit the comment
    */
    editComment (e) {
        e.preventDefault();
        const url = this.props.actionUrl;
        const newComment = e.target.children[0].children[0].value;
        const commentDiv = e.target.parentElement.parentElement.children[1];
        const preEdit = commentDiv.innerHTML;
        commentDiv.innerHTML = '<h2>Editing comment...</h2>'

        // only send a changed comment to the backend
        if (newComment !== this.props.comment) {
            editComment(newComment, url, e.target);
        } else {
            e.target.style.display = 'none';
            commentDiv.innerHTML = preEdit;
        };
    };
    
    handleAbort (e) {
        // when abort button is clicked close the edit comment form
        e.target.parentElement.style.display = 'none';  
    };
    
    render () {
        // if a user cannot edit a comment, this form will not appear
        if (!this.props.editable) {
            return null;
        };

        const formStyle = {
            display: 'none'
        }

        return (
            <form className="form-inline" style={formStyle} name='edit-comment-form' onSubmit={this.editComment.bind(this)}>
                <div className="form-group col-sm-7" name='edit-control'>
                    <textarea className="form-control" name='edit-comment' required defaultValue={this.props.comment}></textarea>
                </div>
                <div style={{width: '30%'}} className="form-group col-sm-2">
                    <input type="submit" className="btn form-control" value="edit" />
                </div>
                <span onClick={this.handleAbort} className="btn text-danger close-edit">abort</span>
            </form>
        )
    }
}


class BottomAction extends Component {
    /* 
    The bottom section of a comment
    */
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
                        // handle editting a comment
                        const editForm = e.target.parentElement.children[e.target.parentElement.children.length - 2];
                        editForm.style.display = '';
                    }
                },
                {
                    action: 'delete comment',
                    actionUrl: '/delete/',
                    edit: true,
                    clickHandler: function (e) {
                        // handle deletion of a comment
                        const url = e.target.attributes['data-url'].value;
                        const commentId = e.target.attributes['data-id'].value;
                        e.target.innerText = 'Deleting comment';
                        deleteComment(url, commentId, e.target);
                    }
                },
                {
                    action: 'flag',
                    actionUrl: '/flag/',
                    edit: false,
                    clickHandler: function (e) {
                        console.log('flag coming soon');
                    }
                },
            ]
        }
    };

    render () {
        const {replyUrl, actionUrl, id, comment} = this.props;

        const actionButtons = this.state.actions.filter(
            (action) => action.edit === this.props.editable || action.action === 'reply'
        ).map(function (action, i) {
            // use appropriate urls mappings
            if (action.action === 'reply') {
                action.actionUrl = replyUrl;
            } else if (action.action === 'delete comment') {
                action.actionUrl = actionUrl;
            };
            return <ActionButton key={i} id={id} {...action} />;
        });

        // if the user owns this note they can delete the comment
        if (this.props.ownsNote) {
            if (actionButtons.length === 2) {
                const deleteButton = <ActionButton key={2} id={id} {...this.state.actions[2]} actionUrl={actionUrl} />;
                actionButtons.splice(1, 0, deleteButton);
            }
        }

        return (
            <div className="action-buttons">
                {actionButtons}
                <CommentEditForm comment={comment} actionUrl={actionUrl} editable={this.props.editable}/>
                <hr />
            </div>
        )
    }
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