"use client";

// states
import { useRouter } from "next/navigation";

// components
import Comment from "./Comment";
import TextBox from "./TextBox";

// utils
import deleteComment from "@/utils/deleteComment";
import { createComment, postNewComment } from "@/utils/postNewComment";
import getParentAuthor from "@/utils/getParentAuthor";
import updateComment from "@/utils/updateComment";

export default function App({ users, comments, votes, currentUser }) {
  const router = useRouter();
  const rootComments = comments.filter((comment) => comment.parentId == null);
  const allReplies = comments.filter((comment) => comment.parentId != null);
  const userId = currentUser.id;
  // Function to update the DB:
  async function handleUpdate(targetId, action, body) {
    // Grab the comment
    const targetComment = comments.find((comment) => comment.id == targetId) ?? {};
    // Check if the comment has a parent?
    const parentComment = comments.find((comment) => comment.id == targetComment["parentId"]) ?? {};
    const parentId = parentComment["id"] ?? targetComment["id"];
    const replyingToUser = getParentAuthor(targetId, users, comments) ?? {};

    // Action 1: Reply - Handle the click of the reply button
    if (action == "reply") {
      const newComment = createComment(body, parentId, replyingToUser["id"]);
      await postNewComment(newComment);
    }

    // Action 2: vote - Handle the click of the vote buttons
    if (action == "vote") {
      await updateComment(targetId, action, body);
    }

    // Action 3: Delete - Handle the click of the delete button
    if (action == "delete") {
      await deleteComment(targetId);
    }

    // Action 4: Edit - Handle the click of the edit button
    if (action == "edit") {
      await updateComment(targetId, action, { content: body });
    }

    // Action 5: Send - Handle the click of the send button to create a new comment
    if (action === "add new comment") {
      const newComment = createComment(body);
      await postNewComment(newComment);
    }

    router.refresh();
  }

  return (
    <>
      {/* Comments List */}
      <section className="comments-list">
        {rootComments.map((comment) => (
          <Comment
            key={comment.id}
            users={users}
            votes={votes}
            commentData={comment}
            allReplies={allReplies}
            currentUser={currentUser}
            onUpdate={handleUpdate}
          />
        ))}
      </section>

      {/* New comment Box */}
      <TextBox currentUser={currentUser} type="new" onSubmit={(val) => handleUpdate(null, "add new comment", val)} />
    </>
  );
}
