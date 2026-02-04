"use client";

import { useState } from "react";
import TextBox from "./TextBox";

function Reply({ replyData, currentUser, onUpdate }) {
  const { content, createdAt, score, user, replyingTo, id } = replyData;
  const isYou = user.username == currentUser.username;
  const [isScoreSet, setIsScoreSet] = useState(false);
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);

  function handleUpvote() {
    if (isScoreSet) return;
    const newScore = score + 1;
    setIsScoreSet(true);
    // Update db
    onUpdate(id, "change score", newScore);
  }

  function handleDownvote() {
    if (!isScoreSet) return;
    const newScore = score - 1;
    setIsScoreSet(false);
    // Update db
    onUpdate(id, "change score", newScore);
  }

  function handleReplyClick() {
    // Show the Text Box when the user clicks on the reply btn
    setIsReplyExpanded((prev) => !prev);
  }

  function handleReplySubmission(updatedContent) {
    // Hide the Text Box
    setIsReplyExpanded(false);
    // Send the data when the user submits the Text Box btn
    // Update db
    onUpdate(id, "reply", updatedContent);
  }

  function handleDeleteClick() {
    onUpdate(id, "delete", type, "internal reply");
  }

  function handleEditClick() {
    // Show the Text Box when the user clicks on the edit btn
    setIsEditClicked((prev) => !prev);
  }

  function handleEditSubmission(updatedContent) {
    // Hide the Text Box
    setIsEditClicked(false);
    // Send the data when the user submits the Text Box btn
    // Update db
    onUpdate(id, "edit", updatedContent);
  }

  return (
    <div className="reply-container">
      <div className="line"></div>
      <div className="reply-list">
        <div className="main-comment">
          <div className="score">
            <button
              className={`upvote-btn ${isScoreSet ? "disabled" : "  "}`}
              onClick={handleUpvote}
              disabled={isScoreSet}>
              <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                  fill="hsl(239, 57%, 85%)"></path>
              </svg>
            </button>
            <span className="score-counter">{score}</span>
            <button
              className={`downvote-btn ${!isScoreSet ? "disabled" : ""}`}
              onClick={handleDownvote}
              disabled={!isScoreSet}>
              <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                  fill="hsl(239, 57%, 85%)"></path>
              </svg>
            </button>
          </div>

          <div className="user-details">
            <img src={user.image} alt={user.username} className="profile-pic" />

            <div className="username-group">
              <p className="username">{user.username}</p>
              {isYou && <span className="label">You</span>}
            </div>

            <p className="time-created">{createdAt}</p>
          </div>

          {!isYou && (
            <button className="reply-button" onClick={handleReplyClick}>
              <img src="/assets/images/icon-reply.svg" alt="" />
              <span>Reply</span>
            </button>
          )}

          {isYou && (
            <div className="reply-buttons">
              <button className="reply-button delete" onClick={() => handleDeleteClick(id, "reply")}>
                <img src="/assets/images/icon-delete.svg" alt="" /> Delete
              </button>
              <button className="reply-button edit" onClick={() => handleEditClick(id, "reply")}>
                <img src="/assets/images/icon-edit.svg" alt="" /> Edit
              </button>
            </div>
          )}

          <div className="content">
            {!isEditClicked && (
              <p>
                <span className="reply-username">{replyingTo} </span>
                {content}
              </p>
            )}
            {isEditClicked && (
              <TextBox
                currentUser={currentUser}
                content={`@${replyingTo} ${content}`}
                type="edit"
                onSend={handleEditSubmission}
              />
            )}
          </div>
        </div>
        {isReplyExpanded && <TextBox currentUser={currentUser} onSend={handleReplySubmission} />}
      </div>
    </div>
  );
}

export default Reply;
