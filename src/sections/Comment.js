import React,{ Component } from "react";

function UserImage(props) {
    return (
        <div className="col-sm-1 user-img">                
            <img src={props.profile} alt={"profile picture for "+props.user} />
        </div>
    );
}


class CommentBody extends Component {
    render () {
        return (
            <div className="col-sm-11">
                <span className="comment-info"><strong>{this.props.name}</strong> <small className="text-danger">@{this.props.user}</small> posted <strong className="dated">{this.props.time}</strong> <span className="text-info">edited</span> </span><span className="text-info">{this.props.replies} replies</span>
                <div className="comment-text"><p>{this.props.comment}</p></div>
            </div>
        );
    }
}


function ActionButton (props) {
    return <button className="btn btn-link" data-url={props.actionUrl}>{props.action}</button>
}


class BottomAction extends Component {
    render () {
        return (
            <div>
                <ActionButton action={'reply'} actionUrl='/notes/'/>
                <ActionButton action={'delete'} actionUrl='/notes/'/>
                <ActionButton action={'flag'} actionUrl='/notes/'/>
            </div>
        )
    }
}



class Comment extends Component {
    render () {
        return (
            <div id="comment14" class="row text-primary comment">
                <UserImage user={this.props.user} profile={this.props.imageUrl}/>
                <CommentBody user={this.props.user} name={this.props.name} comment={this.props.comment} time={this.props.time} replies={this.props.replies}/>
                <BottomAction />
                <hr />
            </div>
        )
    }
}



export default Comment;