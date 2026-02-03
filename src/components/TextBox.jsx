"use client";

function TextBox({ currentUser, content, type, onSend, onNew }) {
  const { username, image } = currentUser;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const textValue = formData.get("inputTextarea"); // Matches the 'name' attribute
    if (textValue == "") return;
    if (onNew) {
      onNew(null, "add new comment", textValue);
    } else {
      onSend(textValue);
    }
    e.currentTarget.reset();
  };
  return (
    <div className="input-field-you">
      <img src={image} alt={username} className="profile-pic" />
      <form action="" onSubmit={handleSubmit}>
        <textarea
          className="input-textarea"
          placeholder="Add a comment..."
          id="inputTextarea"
          name="inputTextarea"
          defaultValue={type == "edit" ? content : ""}></textarea>
        <button type="submit" name="submit" id="submit" className="button">
          {type == "edit" ? "update" : "Send"}
        </button>
      </form>
    </div>
  );
}

export default TextBox;
