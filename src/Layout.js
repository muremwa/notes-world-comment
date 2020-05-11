import React, { Component } from 'react';
import CommentForm from './sections/CommentFormArea';
import Comment from './sections/Comment';
import * as CommentActions  from './actions/CommentActions';

import CommentStore from './stores/CommentStore';

function LoadingComments () {
	return <h2>Loading comments...</h2>
}

function NoCommentsAvalible (props) {
	return (
		<div id="no-comments">
            <h3 className="alert-heading text-center">no comments yet to { props.noteTitle }</h3>
        </div>
	);
}

function CommentSite (props) {
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
			post: CommentStore.getPost(),
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
			post: CommentStore.getPost(),
			user: CommentStore.getUser(),
			commentsExist: CommentStore.commentsExist,
		})
	}


	render() {
		let comments = this.state.comments.map((comment) => <Comment key={comment.uuid} {...comment}/>)

		return (
			<div id="comments">
				<h3>comments <small className="text-warning">{this.state.post.title} has {this.state.post.comments} comments</small></h3>
				<CommentForm />
				<hr />
				<CommentSite noComments={this.state.commentsExist} comments={comments} noteTitle={this.state.post.title} />
			</div>
		);
	}
}

export default Layout;
