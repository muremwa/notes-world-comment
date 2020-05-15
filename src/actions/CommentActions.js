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

export function deleteComment(commentDeleteUrl, commentId, target) {
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
                target.classList.add('disabled');
                target.innerText = 'Could not delete comment';
            }
        },
        error: function (err) {
            console.log('could not delete the comment', err.statusText, err.status);
            target.classList.add('disabled');
            target.innerText = 'Could not delete comment';            
        }
    })
}

export function editComment (newComment, url, errorDiv) {
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
                errorDiv.innerHTML = `<div class="alert alert-warning"> \
                                        <strong>Error!</strong> Could not edit your comment: ${response.error_message}. Refresh the page and try again... \
                                    </div>`
            }
        },
        error: function (err) {
            errorDiv.innerHTML = `<div class="alert alert-warning"> \
                                        <strong>Error!</strong> Could not edit your comment: ${err.statusText}. Refresh the page and try again... \
                                    </div>`
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
