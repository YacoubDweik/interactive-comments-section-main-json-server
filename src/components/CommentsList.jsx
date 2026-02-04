"use client";

import CommentElement from "./CreateElement";

function CommentsList(props) {
  return (
    <section className="comments-list">
      {props.comments.map((comment) => (
        <CommentElement
          key={comment.id}
          data={comment}
          currentUser={props.currentUser}
          onUpdate={props.onUpdate}
          type="comment" // Root level is always a comment
        />
      ))}
    </section>
  );
}

export default CommentsList;
