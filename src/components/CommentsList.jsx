import Comment from "./Comment";

function CommentsList({ comments }) {
  return (
    <section className="comments-list">
      {comments.map((comment) => (
        <Comment key={comment.id} commentData={comment} />
      ))}
    </section>
  );
}

export default CommentsList;
