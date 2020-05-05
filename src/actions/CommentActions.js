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

