import React, { Component } from 'react';
import CommentForm from './sections/CommentFormArea';
import Comment from './sections/Comment';
import * as CommentActions  from './actions/CommentActions';

import CommentStore from './stores/CommentStore';

function LoadingComments () {
	return <h2>Loading comments...</h2>
}

class Layout extends Component {
	constructor () {
		super();
    	this.getComments = this.getComments.bind(this);
    	this.state = {
			post: CommentStore.getPost(),
			user: CommentStore.getUser(),
			comments: CommentStore.getComments(),
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
		})
	}


	render() {
		let comments = this.state.comments.map((comment) => <Comment key={comment.uuid} {...comment}/>)

		if (comments.length === 0) {
			comments[0] = <LoadingComments key={0} />
		}

		return (
			<div id="comments">
				<h3>comments <small className="text-warning">{this.state.post.title} has {this.state.post.comments} comments</small></h3>
				<CommentForm />
				<hr />
				{ comments }
			</div>
		);
	}
}

export default Layout;
