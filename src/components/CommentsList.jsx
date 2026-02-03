"use client";

import { useState } from "react";
import Comment from "./Comment";

function CommentsList({ comments, currentUser }) {
  const [data, setData] = useState(comments);

  // Handle the click of reply button
  function handleReplyClick(id) {
    console.log(id);
    // show the reply box
    // send the reply to the db
  }

  // Handle the click of upvote button
  function handleUpvoteClick(id, newScore) {
    const updatedComments = data.map((comment) => (comment.id == id ? { ...comment, score: newScore } : comment));
    setData(updatedComments);
    // send the new score to the db
  }

  // Handle the click of downvote button
  function handleDownvoteClick(id, newScore) {
    const updatedComments = data.map((comment) => (comment.id == id ? { ...comment, score: newScore } : comment));
    setData(updatedComments);
    // send the new score to the db
  }

  // Handle the click of Delete button
  function handleDeleteClick(id) {
    console.log(id);
    // Delete the comment/reply by filtering the array and find it
    // Send the edited version to the db
  }

  // Handle the click of edit button
  function handleEditClick(id) {
    console.log(id);
    // Edit the reply
    // Send the edited version to the db
  }

  return (
    <section className="comments-list">
      {data.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          currentUser={currentUser}
          isYou={comment.user.username == currentUser.username}
          handleDeleteClick={handleDeleteClick}
          handleDownvoteClick={handleDownvoteClick}
          handleUpvoteClick={handleUpvoteClick}
          handleEditClick={handleEditClick}
          handleReplyClick={handleReplyClick}
        />
      ))}
    </section>
  );
}

export default CommentsList;
