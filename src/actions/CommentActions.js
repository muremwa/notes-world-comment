import dispatcher from '../dispatcher';
import $ from 'jquery';

export function fetchComments () {
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/comments/5/",
        crossDomain: true,
        success: function (response) {
            dispatcher.dispatch({
                type: 'COMMENTS',
                comments: response
            })
        },
        error: function (err) { 
            console.log('an error occured', err);
        }
    });
}

