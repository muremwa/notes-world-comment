import React, { Component } from 'react';
import CommentForm from './sections/CommentFormArea';
import Comment from './sections/Comment';
import * as CommentActions  from './actions/CommentActions';

import CommentStore from './stores/CommentStore';

function LoadingComments () {
  return <h2>Loading comments...</h2>
}

class Layout extends Component {
  constructor () {
    super();
    this.getComments = this.getComments.bind(this);
    this.state = {
        'post': CommentStore.getPost(),
        'comments': CommentStore.getComments(),
    }
  }

  componentWillMount() {
    CommentActions.fetchComments();
    CommentStore.on('change', this.getComments);
  }
  

  getComments () {
    this.setState({
      'comments': CommentStore.getComments(),
    })
  }

  render() {
    var comments = this.state.comments.map((comment, k) => {
      return <Comment key={k} user={comment.username} name={comment.full_name} time={comment.time} replies={comment.replies} comment={comment.text} imageUrl={comment.profile}/>
    })
    if (comments.length === 0) {
      comments[0] = <LoadingComments />
    }
    return (
      <div id="comments">
        <h3>comments <small className="text-warning">{this.state.post.title} has {this.state.post.comments} comments</small></h3>
        <CommentForm />
        <hr />
        { comments }

      </div>
    );
  }
}

export default Layout;
