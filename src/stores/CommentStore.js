import { EventEmitter } from "events";
import dispatcher from '../dispatcher/dispatcher';
import cleaner from "./utility";

export const storeEvents = {
    FETCH_INIT_DATA: 'fetch_init_data',
    COMMENTS_UPDATE: 'comments_update',
    COMMENT_EDIT: 'comment_edit',
    COMMENT_DELETE: 'comment_delete',
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

            case storeEvents.COMMENTS_UPDATE:
                this.note.comments.unshift(payload);
                this.emit(storeEvents.COMMENTS_UPDATE);
                break;

            case storeEvents.COMMENT_DELETE:
                const commentIndex = this.note.comments.findIndex((comment) => comment.commentId === payload.commentId);

                if (commentIndex > -1) {
                    this.note.comments.splice(commentIndex, 1);
                    this.emit(storeEvents.COMMENTS_UPDATE);
                }
                break;

            case storeEvents.COMMENT_EDIT:
                const editedCommentIndex = this.note.comments.findIndex((comment) => comment.commentId === payload.commentId);

                if (editedCommentIndex > -1) {
                    this.note.comments[editedCommentIndex] = payload;
                    this.emit(storeEvents.COMMENTS_UPDATE);
                }
                break;

            default:
                break;
        }
    }
}

const commentStore = new CommentStore();
dispatcher.register(commentStore.handleActions.bind(commentStore))
export default commentStore;
