import dispatcher from '../dispatcher';
import $ from 'jquery';
import { noteCommentsApi } from '../index';


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
            console.log('an error occured', err.statusText, err.status);
        }
    });
}

export function deleteComment(commentDeleteUrl) {
    /* 
     delete a comment      
     */
    $.ajax({
        type: "DELETE",
        url: commentDeleteUrl,
        crossDomain: true,
        success: function (response, commentId) {
            dispatcher.dispatch({
                type: 'DELETE_COMMENT',
                comment: commentId,
            })
        },
        error: function (err) {
            console.log('The following error occured =', err.statusText, err.status);
        }
    })
}

export function editComment (newComment, url, errorDiv) {
    /* 
     edit a comment    
     */
    $.ajax({
        type: 'PATCH',
        url: url,
        crossDomain: true,
        data: {
            'original_comment': newComment
        },
        success: function (response) {
            if (response.success === true) {
                dispatcher.dispatch ({
                    type: 'COMMENT_EDIT',
                    payload: response
                });
            } else {
                errorDiv.innerHTML = `<div class="alert alert-warning"> \
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> \
                                        <strong>Error!</strong> Could not edit your comment: ${response.error_message}. Refresh the page and try again... \
                                    </div>`
            }
        },
        error: function (err) {
            console.log('the following error occured', err.statusText);
            errorDiv.innerHTML = `<div class="alert alert-warning"> \
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> \
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
           comment: commentText
       },
       success: function (response) { 
            dispatcher.dispatch({
                type: 'COMMENT_CREATED',
                payload: response.comment,
            })
            document.getElementById('comment-alert-info').style.display = 'none';
            document.getElementById('id_comment').value = '';
       },
       error: function (err) {
           console.log('an error occured', err.statusText, err.status);
           document.getElementById('comment-alert-info').style.display = 'none';
           document.getElementById('comment-alert-error').style.display = '';
       }
   })
}
