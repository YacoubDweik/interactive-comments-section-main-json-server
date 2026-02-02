function AddComment({ currentUser }) {
  const { username, image } = currentUser;
  return (
    <div className="input-field-you">
      <img src={image} alt={username} className="profile-pic" />
      <textarea
        className="input-textarea"
        placeholder="Add a comment..."
        id="inputTextarea"
        name="inputTextarea"></textarea>
      <button className="button">Send</button>
    </div>
  );
}

export default AddComment;
