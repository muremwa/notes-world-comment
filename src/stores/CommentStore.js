import { EventEmitter } from "events";
import dispatcher from '../dispatcher/dispatcher';
import cleaner from "./utility";

export const storeEvents = {
    FETCH_INIT_DATA: 'fetch_init_data',
    COMMENTS_UPDATE: 'comments_update',
    UPDATE: 'change'
};


class CommentStore extends EventEmitter {
    user = {};
    note = {};

    /**
     * @param {{ type: storeEvents, payload: any}} action
     */
    handleActions (action) {
        const payload = cleaner(action.payload);

        switch (action.type) {
            case storeEvents.FETCH_INIT_DATA:
                this.user = payload['currentUser'];
                this.note = payload['notesInfo'];
                this.user.ownsNote = this.note.user.id === this.user.id;
                this.emit(storeEvents.FETCH_INIT_DATA)
                break;

            default:
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
