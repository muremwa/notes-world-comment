import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';


class CommentStore extends EventEmitter {
    constructor () {
        super();
        this.user = {};
        this.post = {}
        this.comments = [];
    }

    getComments () {
        return this.comments;
    }

    getPost () {
        return this.post;
    }

    getUser () {
        return this.user;
    }

    createComment (newComment) {
        const cleanComment = {
            uuid: newComment.key,
            user: newComment.username,
            name: newComment.full_name,
            imageUrl: newComment.profile,
            commentId: newComment.comment_id,
            comment: newComment.text,
            time: newComment.time,
            replies: newComment.replies,
            replyUrl: newComment.reply_url,
            actionUrl: newComment.action_url,
            edited: newComment.edited,
            editable: newComment.editable
        };
        this.comments.unshift(cleanComment);
        this.emit('change');
    }

    editComment (newComment) {
        const comment = this.comments.find(comment => comment.commentId === newComment.comment_id);
        comment.edited = true;
        comment.comment = newComment.comment;
        comment.uuid = newComment.new_key;
        this.emit('change');
    }

    deleteComment(commentId) {
        // delete a comment from this.comments
        const index = this.comments.findIndex(comment => comment.commentId === commentId);
        this.comments.splice(index, 1);
        this.emit('change');
    }

    handleActions (action) {
        switch (action.type) {
            case 'COMMENTS':
                this.comments = action.payload.comments.map((comment) => (
                    {
                        uuid: comment.key,
                        user: comment.username,
                        name: comment.full_name,
                        imageUrl: comment.profile,
                        commentId: comment.comment_id,
                        comment: comment.text,
                        time: comment.time,
                        replies: comment.replies,
                        replyUrl: comment.reply_url,
                        actionUrl: comment.action_url,
                        edited: comment.edited,
                        editable: comment.editable
                    }
                ));
                this.post = {
                    'title': action.payload.note,
                    'ownerId': action.payload.owner_id,
                    'comments': action.payload.comments.length
                };
                this.user = {
                    id: action.payload.user.id,
                    userName: action.payload.user.username,
                    fullName: action.payload.user.full_name,
                    profileUrl: action.payload.user.profile,
                };
                this.emit('change');
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
                console.log(`no such ${action.type}`)
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
