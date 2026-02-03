"use client";

import Comment from "./Comment";

function CommentsList(props) {
  return (
    <section className="comments-list">
      {props.comments.map((comment) => (
        <Comment key={comment.id} commentData={comment} currentUser={props.currentUser} onUpdate={props.onUpdate} />
      ))}
    </section>
  );
}

export default CommentsList;
