"use client";

function TextBox({ currentUser, content, type, onSubmit }) {
  const { username, image } = currentUser;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const textValue = formData.get("inputTextarea");
    if (textValue == "") return;
    onSubmit(textValue);
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
