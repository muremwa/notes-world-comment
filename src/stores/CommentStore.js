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
        this.post = {
            'title':'Worst behavior by Drake',
            'comments':5
        }
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
                this.comments = action.comments;
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
