import dispatcher from '../dispatcher';
import ajax from './ajaxWrapper';
import { noteCommentsApi } from '../index';



export function fetchComments (onError = null) {
     /* 
     fetch comments on load      
     */
    const fetchOptions = {
        url: noteCommentsApi,
        responseType: 'json',
        error: onError? onError: () => {},
        success: (response) => {
            dispatcher.dispatch({
                type: 'COMMENTS',
                payload: response.response
            })
        }
    };

    ajax.get(fetchOptions);

};


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


export function createComment (form, onSuccess = null, onError = null) {
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
            onSuccess? onSuccess(): void 0;
       },
       error: function () {
           onError? onError(): void 0;
       }
   };

   ajax.post(createCommentOptions);

};