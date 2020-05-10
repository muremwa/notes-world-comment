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
                        user: comment.username,
                        name: comment.full_name,
                        imageUrl: comment.profile,
                        commentId: comment.comment_id,
                        comment: comment.text,
                        time: comment.time,
                        replies: comment.replies,
                        replyUrl: comment.reply_url,
                        deleteUrl: comment.delete_url,
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
        
            default:
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
