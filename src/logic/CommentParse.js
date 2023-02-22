/**
 * Receive comment_text, and a list of mentionedUsers => [ { username: string, userId: number, profileUrl: string } ]
 * replace every user with a link to their profile.
 *
 * Example
 * comment_text: 'This comment has a reference to @jimmy and @pat from squarespace'
 * mentionedUsers: [ { username: jimmy, userId: 43, profileUrl: /to/user/43/ } ]
 *
 * parse() =>
 *
 * 'This comment has a reference to <a href='/to/user/43/'>@jimmy</a> and @pat from squarespace
 * @param { string } comment
 * @param { [ { username: string, userId: number, profileUrl: string } ] } mentionedUsers
 * @return { string }
 */
export default function parseComment (comment, mentionedUsers) {
    let newComment = comment;

    mentionedUsers.forEach(({ username, profileUrl}) => {
        newComment = newComment.replace(
            new RegExp(`@${username}`, 'g'),
            `<a href="${profileUrl}" >@${username}</a>`
        );
    });
    return newComment;
};