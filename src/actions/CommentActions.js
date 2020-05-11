import dispatcher from '../dispatcher';
import $ from 'jquery';

 export function fetchComments () {
    $.ajax({
        type: "GET",
        url: window.api + "/api/comments/1/",
        crossDomain: true,
        success: function (response) {
            dispatcher.dispatch({
                type: 'COMMENTS',
                payload: response
            })
        },
        error: function (err) { 
            console.log('an error occured', err);
        }
    });
}

export function deleteComment(commentDeleteUrl) {
    $.ajax({
        type: "DELETE",
        url: commentDeleteUrl,
        crossDomain: true,
        success: function (response, commentId) {
            dispatcher.dispatch({
                type: 'DELETED_COMMENT',
                comment: commentId,
            })
        },
        error: function (err) {
            console.log('The following error occured =', err.statusText);
        }
    })
}

export function editComment (newComment, url, errorDiv) {
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
                                        <strong>Title!</strong> Could not edit your comment: ${response.error_message}. Refresh the page and try again... \
                                    </div>`
            }
        },
        error: function (err) {
            console.log('the following error occured', err.statusText);
            errorDiv.innerHTML = `<div class="alert alert-warning"> \
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button> \
                                        <strong>Title!</strong> Could not edit your comment: ${err.statusText}. Refresh the page and try again... \
                                    </div>`
        }
    })
}
