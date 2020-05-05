import { EventEmitter } from 'events';

import dispatcher from '../dispatcher';


class CommentStore extends EventEmitter {
    constructor () {
        super();
        this.user = {
            'username':'testname',
            'full_name':'Test Name',
            'profile_url':'http://127.0.0.1:8000/media/profile_images/tracee.jpg'
        };
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
                        comment: comment.text,
                        time: comment.time,
                        replies: comment.replies,
                        edited: comment.edited
                    }
                ));
                this.post = {
                    'title': action.payload.note,
                    'comments': action.payload.comments.length
                }
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
