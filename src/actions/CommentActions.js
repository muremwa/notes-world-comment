import dispatcher from '../dispatcher';
import $ from 'jquery';
import { noteCommentsApi, token } from '../index';


 export function fetchComments () {
     /* 
     fetch comments on load      
     */
    $.ajax({
        type: "GET",
        url: noteCommentsApi,
        crossDomain: true,
        success: function (response) {
            dispatcher.dispatch({
                type: 'COMMENTS',
                payload: response
            })
        },
        error: function (err) {
            //
        }
    });
}

export function deleteComment(commentDeleteUrl, commentId, onError) {
    /* 
     delete a comment      
     */
    $.ajax({
        headers: {
            'X-HTTP-Method-Override': 'DELETE'
        },
        type: "POST",
        url: commentDeleteUrl,
        crossDomain: true,
        data: {
            csrfmiddlewaretoken: token
        },
        success: function (response) {
            if (response.success === true){
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
    })
}

export function editComment (newComment, url, onError) {
    /* 
     edit a comment    
     */
    $.ajax({
        headers: {
            'X-HTTP-Method-Override': 'PATCH'
        },
        type: 'POST',
        url: url,
        crossDomain: true,
        data: {
            original_comment: newComment,
            csrfmiddlewaretoken: token
        },
        success: function (response) {
            if (response.success === true) {
                dispatcher.dispatch ({
                    type: 'COMMENT_EDIT',
                    payload: response
                });
            } else {
                onError()
            }
        },
        error: function (err) {
            onError()
        }
    })
}


export function createComment (commentText) {
    /*
    Create a new comment
    */
   $.ajax({
       type: 'POST',
       url: noteCommentsApi,
       crossDomain: true,
       data: {
           comment: commentText,
           csrfmiddlewaretoken: token
       },
       success: function (response) { 
            dispatcher.dispatch({
                type: 'COMMENT_CREATED',
                payload: response.comment,
            })
            document.getElementById('comment-alert-info').style.display = 'none';
            document.getElementById('comment-alert-error').style.display = 'none';
            document.getElementById('id_comment').value = '';
       },
       error: function (err) {
           document.getElementById('comment-alert-info').style.display = 'none';
           document.getElementById('comment-alert-error').style.display = '';
       }
   })
}
