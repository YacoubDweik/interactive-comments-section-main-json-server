"use client";

import { useState } from "react";
import CommentsList from "./CommentsList";
import TextBox from "./TextBox";

export default function App(props) {
  const [comments, setComments] = useState(props.comments);

  const createComment = (body) => ({
    id: Date.now(),
    content: body,
    createdAt: "Just now",
    score: 0,
    user: props.currentUser,
    replies: [],
  });

  const createReply = (body, replyingTo) => ({
    id: Date.now(),
    content: body,
    createdAt: "Just now",
    score: 0,
    replyingTo,
    user: props.currentUser,
  });

  // Function to update comments state:
  function handleUpdate(targetId, action, body) {
    // Action 1: Reply - Handle the click of the reply button
    if (action == "reply") {
      const updatedComments = comments.map((comment) => {
        // Case 1: replying to a comment
        if (comment.id === targetId) {
          const targetComment = comment;
          return {
            ...comment,
            replies: [...comment.replies, createReply(body, targetComment.user.username)],
          };
        }
        // Case 2: replying to a reply
        const targetReply = comment.replies.find((reply) => reply.id == targetId);
        if (targetReply) {
          return {
            ...comment,
            replies: [...comment.replies, createReply(body, targetReply.user.username)],
          };
        }
        return comment;
      });
      // Update the comments state
      setComments(updatedComments);
      // Send to db logic here..
    }

    // Action 2: Change score - Handle the click of the score buttons
    if (action == "change score") {
      const newScore = body;
      const updatedComments = comments.map((comment) => {
        // Case 1: comment score click
        if (comment.id == targetId) {
          return {
            ...comment,
            score: newScore,
          };
        }
        // Case 2: reply score click
        const updatedReplies = comment.replies.map((reply) =>
          reply.id == targetId ? { ...reply, score: newScore } : reply,
        );
        return {
          ...comment,
          replies: updatedReplies,
        };
      });
      // Update the comments state
      setComments(updatedComments);
      // Send to db logic here..
    }

    // Action 3: Delete - Handle the click of the delete button
    if (action == "delete") {
      const updatedComments = comments
        .filter((comment) => comment.id != targetId) // Case 1: comment delete click
        .map((comment) => {
          // Case 2: reply delete click
          const updatedReplies = comment.replies.filter((reply) => reply.id != targetId);
          return {
            ...comment,
            replies: updatedReplies,
          };
        });
      // Update the comments state
      setComments(updatedComments);
      // Send to db logic here..
    }

    // Action 4: Edit - Handle the click of the edit button
    if (action == "edit") {
      const newContent = body;
      const updatedComments = comments.map((comment) => {
        // Case 1: comment edit click
        if (comment.id == targetId) {
          return {
            ...comment,
            content: newContent,
          };
        }
        // Case 2: reply edit click
        const updatedReplies = comment.replies.map((reply) =>
          reply.id == targetId ? { ...reply, content: newContent } : reply,
        );
        return {
          ...comment,
          replies: updatedReplies,
        };
      });
      // Update the comments state
      setComments(updatedComments);
      // Send to db logic here..
    }

    // Action 5: Send - Handle the click of the send button to create a new comment
    if (action === "add new comment") {
      const newComment = createComment(body);
      // Update the comments state
      setComments([...comments, newComment]);
      // Send to db logic here..
    }
  }

  return (
    <>
      <CommentsList comments={comments} currentUser={props.currentUser} onUpdate={handleUpdate} />
      <TextBox currentUser={props.currentUser} type="new" onNew={handleUpdate} />
    </>
  );
}
