import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';


class CommentStore extends EventEmitter {
    constructor () {
        super();
        this.user = {};
        this.note = {};
        this.comments = [];
        this.commentsExist = true;
    }

    getComments () {
        return this.comments;
    }

    getNote () {
        return this.note;
    }

    getUser () {
        return this.user;
    }

    synthesisComment (rawComment) {
        return {
            uuid: rawComment.key,
            user: rawComment.username,
            name: rawComment.full_name,
            imageUrl: rawComment.profile,
            commentId: rawComment.comment_id,
            comment: rawComment.text,
            time: rawComment.time,
            replies: rawComment.replies,
            replyUrl: rawComment.reply_url,
            actionUrl: rawComment.action_url,
            edited: rawComment.edited,
            editable: rawComment.editable
        }
    }

    fetchComments (payload) {
        this.comments = payload.comments.map((comment) => this.synthesisComment(comment));

        if (this.comments.length === 0) {
            this.commentsExist = false;
        };

        this.note = {
            'title': payload.note,
            'ownerId': payload.owner_id,
            'comments': payload.comments.length
        };
        this.user = {
            id: payload.user.id,
            userName: payload.user.username,
            fullName: payload.user.full_name,
            profileUrl: payload.user.profile,
        };
        this.emit('change');
    }

    createComment (newComment) {
        const cleanComment = this.synthesisComment(newComment);
        this.comments.unshift(cleanComment);
        this.commentsExist = true;
        this.note.comments++;
        this.emit('change');
    }

    editComment (newComment) {
        const comment = this.comments.find(comment => comment.commentId === newComment.comment_id);
        comment.edited = true;
        comment.replies = newComment.replies;
        comment.comment = newComment.comment;
        comment.uuid = newComment.new_key;
        this.emit('change');
    }

    deleteComment(commentId) {
        // delete a comment from this.comments
        const index = this.comments.findIndex(comment => comment.commentId === +commentId);
        this.comments.splice(index, 1);
        this.note.comments--;
        this.commentsExist = this.note.comments === 0? false: true;
        this.emit('change');
    }

    handleActions (action) {
        switch (action.type) {
            case 'COMMENTS':
                this.fetchComments(action.payload);
                break;
            
            case 'DELETE_COMMENT':
                this.deleteComment(action.comment);
                break;

            case 'COMMENT_EDIT':
                this.editComment(action.payload)
                break;

            case 'COMMENT_CREATED':
                this.createComment(action.payload);
                break;
        
            default:
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
