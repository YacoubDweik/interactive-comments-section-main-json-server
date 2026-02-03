function TextBox({ currentUser, content, type }) {
  const { username, image } = currentUser;
  return (
    <div className="input-field-you">
      <img src={image} alt={username} className="profile-pic" />
      <textarea
        className="input-textarea"
        placeholder="Add a comment..."
        id="inputTextarea"
        name="inputTextarea"
        value={content}
        readOnly></textarea>
      <button className="button">{type == "edit" ? "update" : "Send"}</button>
    </div>
  );
}

export default TextBox;
