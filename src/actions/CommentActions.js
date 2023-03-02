import dispatcher from '../dispatcher/dispatcher';
import { storeEvents } from '../stores/CommentStore';
import { noteCommentsApi } from '../index';
import commentStore from "../stores/CommentStore";


/**
* @param {() => void} onError Callback for an error occurred
* */
export function fetchComments (onError) {
    // fetch comments on load and populate notes and user details
    fetch(noteCommentsApi, {
        credentials: 'include'
    }).then((resp) => resp.json()).then((data) => {
        dispatcher.dispatch({
            type: storeEvents.FETCH_INIT_DATA,
            payload: data
        })
    }).catch(() => onError());
}


/**
 * @param {string} commentDeleteUrl
 * @param {() => void} errorCallback
 * */
export function deleteComment (commentDeleteUrl, errorCallback) {
    // delete a comment
    fetch(commentDeleteUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            Authorization: `Token ${commentStore.user.token}`,
        }
    }).then((payload) => {
        if (payload.ok) {
            return payload.json()
        } else {
            throw new Error()
        }
    }).then((data) => {
        dispatcher.dispatch({
            type: storeEvents.COMMENT_DELETE,
            payload: data
        });
    }).catch(() => errorCallback())
}


/**
 * @param {string} url 'comment action url'
 * @param {string} commentText 'Comment text to be saved'
 * @param {() => void} successCallback 'function run on success posting'
 * @param {() => void} errorCallback 'function run if an error occurs'
 * */
export function editComment(url, commentText, successCallback, errorCallback) {
    fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        body: JSON.stringify({ 'comment': commentText }),
        headers: {
            Authorization: `Token ${commentStore.user.token}`,
            'Content-Type': 'application/json'
        }
    }).then((payload) => {
        if (payload.ok) {
            return payload.json();
        } else {
            throw new Error(`${payload.status}: ${payload.statusText}`)
        }
    }).then((data) => {
        const { success, comment } = data;

        if (!success) {
            throw new Error('Success: False')
        }

        successCallback();
        dispatcher.dispatch({
            type: storeEvents.COMMENT_EDIT,
            payload: comment
        });
    }).catch(() => errorCallback());
}


/**
 * @param {FormData} commentFormData 'comment to be posted'
 * @param {() => void} successCallback 'function run on success posting'
 * @param {() => void} errorCallback 'function run if an error occurs'
 * */
export function createComment (commentFormData, successCallback, errorCallback) {
    fetch(noteCommentsApi, {
        method: 'POST',
        body: commentFormData,
        credentials: 'include',
        headers: { Authorization: `Token ${commentStore.user.token}` }
    }).then((payload) => {
        if (payload.ok) {
            return payload.json();
        } else {
            throw new Error(`${payload.status}: ${payload.statusText}`)
        }
    }).then((data) => {
        // comment posted successfully
        successCallback();
        dispatcher.dispatch({
            type: storeEvents.COMMENTS_UPDATE,
            payload: data.comment
        });
    }).catch(() => errorCallback());
}