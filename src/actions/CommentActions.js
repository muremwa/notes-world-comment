import dispatcher from '../dispatcher/dispatcher';
import { storeEvents } from '../stores/CommentStore';
import ajax from './ajaxWrapper';
import { noteCommentsApi } from '../index';


/**
* @param {() => void} onError Callback for an error occurred
* */
export function fetchComments (onError) {
    // fetch comments on load and populate notes and user details
    fetch(noteCommentsApi, {
        // TODO: REMOVE this header
        headers: {
            Authorization: 'Token 29c5cfba69582d9814d7fc3dc837327bdd2ec5cc',
        }
    }).then((resp) => resp.json()).then((data) => {
        dispatcher.dispatch({
            type: storeEvents.FETCH_INIT_DATA,
            payload: data
        })
    }).catch(() => onError());
}


export function deleteComment(commentDeleteUrl, form, commentId, onError) {
    /* 
     delete a comment
     */
    const deleteOptions = {
        headers: [{
            name: 'X-HTTP-Method-Override',
            value: 'DELETE'
        },],
        url: commentDeleteUrl,
        form,
        success: (response) => {
            if (response.response.success === true){
                dispatcher.dispatch({
                    type: 'DELETE_COMMENT',
                    comment: commentId,
                })
            } else {
                onError()
            }
        },
        error: function (err) {
            onError()
        }
    };

    ajax.post(deleteOptions);
};


export function editComment (form, url, onError) {
    /* 
     edit a comment    
     */
    const editCommentOptions = {
        headers: [
            {
                name: 'X-HTTP-Method-Override',
                value: 'PATCH'   
            },
        ],
        url: url,
        form,
        success: (response) => {
            if (response.response.success === true) {
                dispatcher.dispatch ({
                    type: 'COMMENT_EDIT',
                    payload: response.response
                });
            } else {
                onError()
            }
        },
        error: function (err) {
            onError()
        }
    };

    ajax.post(editCommentOptions);
};


export function createComment (form, onSuccess = () => {}, onError = () => {}) {
    /*
    Create a new comment
    */
   const createCommentOptions = {
       url: noteCommentsApi,
       form,
       success: function (response) { 
            dispatcher.dispatch({
                type: 'COMMENT_CREATED',
                payload: response.response.comment,
            })
            onSuccess();
       },
       error: function () {
           onError();
       }
   };

   ajax.post(createCommentOptions);

};