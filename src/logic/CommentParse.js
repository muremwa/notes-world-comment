/* 
Receive a comment and check whether it has a username in it the add link for it
eg 'This comment has a reference to @jimmy from squarespace'

parse() => 

'This comment has a reference to <a href='/api/get/user/?username=jimmy'>@jimmy</a> from squarespace

*/
// TODO: REMOVE
const userSearchUrl = '';

function paintComment (comment, paint) {
    /*
    Given a text and a word in it, split the text the join with a link in it
    'why would @kim do that to @bill, why?', ;@kim' => 
    'why would <a href='/api/get/user/?username=kim'>@kim</a> do that to @bill, why?'
    */
    const link = `<a href='${userSearchUrl}?username=${paint.split('@')[1]}'>${paint}</a>`;
    return comment.split(paint).join(link)
}

export default function parseComment (comment) {
    const pattern = /@\w+/g

    let users = comment.match(pattern);
    let newComment = comment;

    if (users !== null) {
        for (let user of users) {
            newComment = paintComment(newComment, user);
        }
    }

    return newComment;
};