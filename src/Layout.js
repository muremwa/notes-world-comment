import React, { Component } from 'react';
import CommentForm from './sections/CommentFormArea';
import Comment from './sections/comments/Comment';
import * as CommentActions  from './actions/CommentActions';

import CommentStore from './stores/CommentStore';


function LoadingComments () {
	/* 
    Show comments are loading
    */
	return <h2>Loading comments...</h2>
}

function NoCommentsAvalible (props) {
	/* 
    No comments on this post
    */
	return (
		<div id="no-comments">
            <h3 className="alert-heading text-center">no comments yet to { props.noteTitle }</h3>
        </div>
	);
}

function CommentSite (props) {
	/* 
    Decide whether to show comments are loading or that no comments are available
    */
	if (!props.noComments) {
		return <NoCommentsAvalible noteTitle={props.noteTitle} />
	} else {
		if (props.comments.length === 0) {
			return <LoadingComments />
		} else {
			return (
				<div>
					{props.comments}
				</div>
			)
		}
	}
}

class Layout extends Component {
	constructor () {
		super();
    	this.getComments = this.getComments.bind(this);
    	this.state = {
			note: CommentStore.getNote(),
			user: CommentStore.getUser(),
			comments: CommentStore.getComments(),
			commentsExist: CommentStore.commentsExist
    	}
	}


  	componentWillMount() {
    	CommentActions.fetchComments();
		CommentStore.on('change', this.getComments);
	}
	  
	componentWillUnmount () {
		CommentStore.removeListener('change', this.getComments)
	}
	

	getComments () {
		this.setState({
			comments: CommentStore.getComments(),
			note: CommentStore.getNote(),
			user: CommentStore.getUser(),
			commentsExist: CommentStore.commentsExist,
		})
	}


	render() {
		const ownsNote = this.state.note.ownerId === this.state.user.id? true: false;
		let comments = this.state.comments.map((comment) => <Comment key={comment.uuid} {...comment} ownsNote={ownsNote}/>)
		const commentType = this.state.note.comments === 1? 'comment': 'comments';
		const hasCommentMessage = this.state.note.comments === 0? 'no comments': `${this.state.note.comments} ${commentType}`;

		return (
			<div id="comments-section">
				<h3>comments <small className="text-warning">{this.state.note.title} has {hasCommentMessage}</small></h3>
				<CommentForm />
				<hr />
				<CommentSite noComments={this.state.commentsExist} comments={comments} noteTitle={this.state.note.title} />
			</div>
		);
	}
}

export default Layout;
