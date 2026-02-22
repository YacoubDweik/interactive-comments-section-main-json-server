const getTargetAuthor = (targetId, users, comments) => {
  if (!targetId) return null;

  // 1. Find the target comment object
  const targetComment = comments.find((c) => c.id === targetId);

  if (!targetComment) return null;

  // 2. Use the userId from that target to find the user in the users array
  const targetAuthor = users.find((u) => u.id === targetComment.userId);

  return targetAuthor; // This is the full {id, username, image} object
};

export default getTargetAuthor;
