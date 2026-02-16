const getParentAuthor = (parentId, users, comments) => {
  if (!parentId) return null;

  // 1. Find the parent comment object
  const parentComment = comments.find((c) => c.id === parentId);

  if (!parentComment) return null;

  // 2. Use the userId from that parent to find the user in the users array
  const parentAuthor = users.find((u) => u.id === parentComment.userId);

  return parentAuthor; // This is the full {id, username, image} object
};

export default getParentAuthor;
