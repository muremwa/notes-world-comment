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
        this.comments = [
            {
                "username": "muremwa",
                "full_name": "Daniel Mburu",
                "profile": "http://127.0.0.1:8000/media/profile_images/IMG_20180826_163833.jpg",
                "time": "240 days ago",
                "text": "@lois what do you mean?",
                "edited": true,
                "replies": 2
            },
            {
                "username": "lois",
                "full_name": "Lois Griffin",
                "profile": "http://127.0.0.1:8000/media/profile_images/lois.jpg",
                "time": "240 days ago",
                "text": "mmm",
                "edited": false,
                "replies": 1
            },
            {
                "username": "bow",
                "full_name": "Rainbow Johnson",
                "profile": "http://127.0.0.1:8000/media/profile_images/tracee.jpg",
                "time": "240 days ago",
                "text": "do you slide?",
                "edited": false,
                "replies": 1
            },
            {
                "username": "chris",
                "full_name": "Chris Griffin",
                "profile": "http://127.0.0.1:8000/media/profile_images/chris.jpg",
                "time": "247 days ago",
                "text": "m,m,",
                "edited": false,
                "replies": 1
            },
            {
                "username": "muremwa",
                "full_name": "Daniel Mburu",
                "profile": "http://127.0.0.1:8000/media/profile_images/IMG_20180826_163833.jpg",
                "time": "248 days ago",
                "text": "@chris work here I Will",
                "edited": true,
                "replies": 3
            }
        ];
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
}

const commentStore = new CommentStore();

export default commentStore;