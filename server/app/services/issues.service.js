const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new issue and add the creator as a participant
 */
async function createIssue({
  title,
  description,
  category,
  location,
  picture1,
  picture2,
  picture3,
  creatorId
}) {
  const imageUrls = [picture1, picture2, picture3].filter(Boolean);
  console.log("Image urls", imageUrls);
  return await prisma.issue.create({
    data: {
      title,
      description,
      category,
      location,
      imageUrls,
      creatorId,
      upvotes: [],
      downvotes: []
    }
  });
}

/**
 * Fetch public issues and private issues for the user
 */
async function getIssues(userId) {
  // Get all issues, sorted by most recent first
  const issues = await prisma.issue.findMany({
    include: {
      creator: {
        select: {
          email: true,
          displayName: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return issues;
}

module.exports = { createIssue, getIssues };
