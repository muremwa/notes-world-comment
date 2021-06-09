import React, { useState, useEffect } from 'react';
import CommentForm from './sections/CommentFormArea';
import Comment from './sections/comments/Comment';
import { fetchComments }  from './actions/CommentActions';
import commentStore, { storeEvents } from './stores/CommentStore';



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


export default function Layout () {		
	const [ note, noteChanger ] = useState({});
	const [ user, userChanger ] = useState({});
	const [ comments, commentsChanger ] = useState([]);
	const [ commentsExist, commentsExistChanger ] = useState(true);
	const [ loadData, loadDataChanger ] = useState(true);

	if (loadData) {
		fetchComments();
		loadDataChanger(false);
	};

	const hasCommentMessage = !note.comments || note.comments === 0? 'no comments': `${note.comments} ${note.comments === 1? 'comment': 'comments'}`;

	// create <Comment />
	const makeComments = (comments_ = []) => {
		return comments_.map((comment) => {
			return <Comment key={comment.uuid} {...comment} ownsNote={note.ownerId === user.id? true: false}/>
		});
	};

	// load fresh comments from server
	const loadComments = () => {
		commentsExistChanger(commentStore.commentsExist);
		noteChanger(commentStore.getNote());
		userChanger(commentStore.getUser());
		commentsChanger(makeComments(commentStore.getComments()));
	};

	// A comment has been updated
	const updateComments = () => {
		noteChanger(commentStore.getNote());
		commentsChanger(makeComments(commentStore.getComments()));
		commentsExistChanger(commentStore.commentsExist);
	};

	
	useEffect(() => {
		commentStore.on(storeEvents.FETCH_INIT_DATA, loadComments);
		commentStore.on(storeEvents.COMMENTS_UPDATE, updateComments);
		
		return () => {
			commentStore.removeListener(storeEvents.FETCH_INIT_DATA, loadComments);
			commentStore.removeListener(storeEvents.COMMENTS_UPDATE, updateComments);
		};
	});

	return (
		<div id="comments-section">
			<h3>comments <small className="text-warning">{note.title} has {hasCommentMessage}</small></h3>
			<CommentForm />
			<hr />
			<CommentSite noComments={commentsExist} comments={comments} noteTitle={note.title} />
		</div>
	);
};
