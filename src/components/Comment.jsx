import { useState } from "react";
import TextBox from "./TextBox";
import { formatDistanceToNow } from "date-fns";

function Comment({ users, votes, commentData, allReplies = [], currentUser, onUpdate }) {
  const { id, content, createdAt, score, userId, replyingToUserId } = commentData;
  // get the user obj
  const user = users.find((user) => user.id == userId);
  // check is this comment for this current user?
  const isYou = user.username == currentUser.username;
  // check is the type of this comment using replying to
  const type = replyingToUserId == null ? "comment" : "reply";
  // if it's a reply then who it's replying to?
  const replyingTo = users.find((user) => user.id == replyingToUserId);
  // if it's a root comment then grab its replies
  const replies = type == "comment" ? allReplies.filter((reply) => reply.parentId == id) : [];
  // check has the current user voted for this comment before?
  const isVoted = votes.find((vote) => vote.commentId == id && vote.userId == currentUser.id);

  // Shared States
  const [isScoreSet, setIsScoreSet] = useState(isVoted);
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  // Shared Logic
  const handleVote = (modifier) => {
    if ((modifier === 1 && isScoreSet) || (modifier === -1 && !isScoreSet)) return;
    setIsScoreSet(modifier === 1);
    // SEND THE DIRECTION, NOT THE SCORE
    const direction = modifier === 1 ? "up" : "down";
    onUpdate(id, "vote", direction);
  };

  const handleAction = (action, updatedContent) => {
    if (action === "reply") setIsReplyExpanded(false);
    if (action === "edit") setIsEditClicked(false);
    if (action === "delete") setIsEditClicked(false);

    onUpdate(id, action, updatedContent);
  };

  return (
    // 1. Dynamic Wrapper Class
    <div className={type === "reply" ? "reply-container" : "comment-container"}>
      {/* 2. Conditionally render the vertical line for replies only */}
      {type === "reply" && <div className="line"></div>}

      <div className={type === "reply" ? "reply-list" : ""}>
        <article className="main-comment">
          {/* Score Section (Identical) */}
          <div className="score">
            <button className={`upvote-btn ${isScoreSet ? "disabled" : ""}`} onClick={() => handleVote(1)}>
              <svg width="11" height="11">
                <path
                  d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                  fill="hsl(239, 57%, 85%)"
                />
              </svg>
            </button>
            <span className="score-counter">{score}</span>
            <button className={`downvote-btn ${!isScoreSet ? "disabled" : ""}`} onClick={() => handleVote(-1)}>
              <svg width="11" height="3">
                <path
                  d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                  fill="hsl(239, 57%, 85%)"
                />
              </svg>
            </button>
          </div>

          <div className="user-details">
            <img src={user.image} alt={user.username} className="profile-pic" />
            <div className="username-group">
              <p className="username">{user.username}</p>
              {isYou && <span className="label">You</span>}
            </div>
            <p className="time-created" suppressHydrationWarning>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>

          {/* Action Buttons (Unified Logic) */}
          <div className="actions-wrapper">
            {!isYou ? (
              <button className="reply-button" onClick={() => setIsReplyExpanded(!isReplyExpanded)}>
                <img src="/assets/images/icon-reply.svg" alt="" /> <span>Reply</span>
              </button>
            ) : (
              <div className="reply-buttons">
                <button className="reply-button delete" onClick={() => setIsDeleteClicked(true)}>
                  <img src="/assets/images/icon-delete.svg" alt="" /> Delete
                </button>
                <button className="reply-button edit" onClick={() => setIsEditClicked(!isEditClicked)}>
                  <img src="/assets/images/icon-edit.svg" alt="" /> Edit
                </button>
              </div>
            )}
          </div>

          <div className="content">
            {!isEditClicked ? (
              <p>
                {/* 3. Check for replyingTo inside the text flow */}
                {replyingTo && <span className="reply-username">@{replyingTo.username} </span>}
                {content}
              </p>
            ) : (
              <TextBox
                currentUser={currentUser}
                content={content}
                type="edit"
                onSubmit={(val) => handleAction("edit", val)}
              />
            )}
          </div>

          {isDeleteClicked && (
            <section className="delete-confirmation-container">
              <div className="delete-confirmation">
                <h2>Delete comment</h2>
                <p>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                <div className="confirmation-buttons">
                  <button className="cancel" onClick={() => setIsDeleteClicked(false)}>
                    no, cancel
                  </button>
                  <button className="confirm" onClick={() => onUpdate(id, "delete")}>
                    yes, delete
                  </button>
                </div>
              </div>
            </section>
          )}
        </article>

        {/* 4. Sub-actions and Recursion */}
        {isReplyExpanded && <TextBox currentUser={currentUser} onSubmit={(val) => handleAction("reply", val)} />}

        {/* This handles the "Recursive" part: Replies rendering more Replies */}
        {replies && replies.length > 0 && (
          <div className="replies-wrapper">
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                users={users}
                votes={votes}
                commentData={reply}
                currentUser={currentUser}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
