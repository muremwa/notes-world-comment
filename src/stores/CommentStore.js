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
        
            default:
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
