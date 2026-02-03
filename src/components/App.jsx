"use client";

import { useState } from "react";
import CommentsList from "./CommentsList";
import TextBox from "./TextBox";

export default function App(props) {
  const [data, setData] = useState(props.initialComments);

  // Function to update data state:
  function handleUpdate(id, action, body, component) {
    if (component == "comment") {
      if (action == "reply") {
        // Handle the click of reply button
        // 1. Find the target comment to get the username we are replying to
        const targetComment = data.find((comment) => comment.id === id);
        if (!targetComment) return;

        // 2. Create the new reply object following your schema
        const newReply = {
          id: Date.now(), // Temporary unique ID
          content: body,
          createdAt: "Just now", // Static for now
          score: 0,
          replyingTo: targetComment.user.username,
          user: props.currentUser, // Ensure 'currentUser' is available in this scope
        };

        // 3. Update the state
        const updatedComments = data.map((comment) => {
          if (comment.id === id) {
            return {
              ...comment,
              // Append the new reply to the end of the existing replies array
              replies: [...comment.replies, newReply],
            };
          }
          return comment;
        });

        setData(updatedComments);
        // send to db logic here..
      } else if (action == "upvote") {
        // Handle the click of upvote button
        const newScore = body;
        const updatedComments = data.map((comment) => (comment.id == id ? { ...comment, score: newScore } : comment));
        setData(updatedComments);
        // send the new score to the db
      } else if (action == "downvote") {
        // Handle the click of downvote button
        const newScore = body;
        const updatedComments = data.map((comment) => (comment.id == id ? { ...comment, score: newScore } : comment));
        setData(updatedComments);
        // send the new score to the db
      } else if (action == "delete") {
        // Handle the click of Delete button
        // Delete the comment/reply by filtering the array and find it
        if (body == "comment") {
          const updatedData = data.filter((comment) => comment.id !== id);
          setData(updatedData);
        } else if (body === "reply") {
          const updatedData = data.map((comment) => {
            return {
              ...comment,
              // Filter out the reply with the matching ID from the replies array
              replies: comment.replies.filter((reply) => reply.id !== id),
            };
          });
          setData(updatedData);
        }
        // Send the edited version to the db
      } else if (action == "edit") {
        // Handle the click of edit button
        // Edit the reply
        const newContent = body;
        const updatedComments = data.map((comment) =>
          comment.id == id ? { ...comment, content: newContent } : comment,
        );
        setData(updatedComments);
        // Send the edited version to the db
      }
    }
    if (component == "internal reply") {
      if (action == "reply") {
        // Handle the click of reply button
        let targetUsername = "";
        let parentCommentId = null;

        // 1. Find the target user and the parent comment ID
        data.forEach((comment) => {
          // Is the target the main comment?
          if (comment.id == id) {
            targetUsername = comment.user.username;
            parentCommentId = comment.id;
          }
          // Or is the target inside the replies?
          const foundReply = comment.replies.find((r) => r.id == id);
          if (foundReply) {
            targetUsername = foundReply.user.username;
            parentCommentId = comment.id; // We need the main comment ID to know where to push
          }
        });

        if (!parentCommentId) return;

        // 2. Create the new reply object
        const newReply = {
          id: Date.now(),
          content: body,
          createdAt: "Just now",
          score: 0,
          replyingTo: targetUsername,
          user: props.currentUser,
        };

        // 3. Update the state
        const updatedComments = data.map((comment) => {
          if (comment.id === parentCommentId) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          return comment;
        });

        setData(updatedComments);
        // send to db logic here..
      } else if (action == "upvote") {
        // Handle the click of upvote button
        const newScore = body;
        const updatedComments = data.map((comment) => {
          // 1. Create a new version of the replies array
          // If a reply matches the ID, update its score; otherwise, keep it as is.
          const updatedReplies = comment.replies.map((reply) => {
            return reply.id == id ? { ...reply, score: newScore } : reply;
          });

          // 2. Return the comment object with the potentially updated replies array
          return {
            ...comment,
            replies: updatedReplies,
          };
        });
        setData(updatedComments);
        // send the new score to the db
      } else if (action == "downvote") {
        // Handle the click of downvote button
        const newScore = body;
        const updatedComments = data.map((comment) => {
          // 1. Create a new version of the replies array
          // If a reply matches the ID, update its score; otherwise, keep it as is.
          const updatedReplies = comment.replies.map((reply) => {
            return reply.id == id ? { ...reply, score: newScore } : reply;
          });

          // 2. Return the comment object with the potentially updated replies array
          return {
            ...comment,
            replies: updatedReplies,
          };
        });
        setData(updatedComments);
        // send the new score to the db
      } else if (action == "delete") {
        // Handle the click of Delete button
        // Delete the comment/reply by filtering the array and find it
        if (body == "comment") {
          const updatedData = data.filter((comment) => comment.id !== id);
          setData(updatedData);
        } else if (body === "reply") {
          const updatedData = data.map((comment) => {
            return {
              ...comment,
              // Filter out the reply with the matching ID from the replies array
              replies: comment.replies.filter((reply) => reply.id !== id),
            };
          });
          setData(updatedData);
        }
        // Send the edited version to the db
      } else if (action == "edit") {
        // Handle the click of edit button
        // Edit the reply
        const newContent = body;
        const updatedComments = data.map((comment) => {
          // 1. Create a new version of the replies array
          // If a reply matches the ID, update its score; otherwise, keep it as is.
          const updatedReplies = comment.replies.map((reply) => {
            return reply.id == id ? { ...reply, content: newContent } : reply;
          });

          // 2. Return the comment object with the potentially updated replies array
          return {
            ...comment,
            replies: updatedReplies,
          };
        });
        setData(updatedComments);
        // Send the edited version to the db
      }
    }
    if (action === "add new comment") {
      const newComment = {
        id: Date.now(), // Generate unique ID
        content: body,
        createdAt: "Just now",
        score: 0,
        user: props.currentUser, // Matches the user object in your JSON
        replies: [], // Essential: must be an empty array for future replies
      };

      // Append to the end of the existing comments
      setData([...data, newComment]);
      // Send the new updated comments list to the db
    }
  }

  return (
    <>
      <CommentsList comments={data} currentUser={props.currentUser} onUpdate={handleUpdate} />
      <TextBox currentUser={props.currentUser} type="new" onNew={handleUpdate} />
    </>
  );
}
