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
      creatorId
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

/**
 * Delete an issue if the user is the creator and status is PENDING
 */
async function deleteIssue(issueId, userId) {
  // First, check if the issue exists and the user is the creator
  const issue = await prisma.issue.findUnique({
    where: { id: issueId }
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.creatorId !== userId) {
    throw new Error("Unauthorized: Only the creator can delete this issue");
  }

  if (issue.status !== "PENDING") {
    throw new Error("Only PENDING issues can be deleted");
  }

  // If all checks pass, delete the issue
  return await prisma.issue.delete({
    where: { id: issueId }
  });
}

/**
 * Add an upvote to an issue
 * Ensures each user can only vote once per issue (either upvote or downvote)
 */
async function upvoteIssue(issueId, userId) {
  // Check if user already upvoted

  console.log(prisma);
  const existingUpvote = await prisma.upvote.findFirst({
    where: {
      issueId,
      voterId: userId
    }
  });
  if (existingUpvote) {
    // Remove upvote
    await prisma.upvote.delete({
      where: { id: existingUpvote.id }
    });
  } else {
    // Remove any existing downvote
    await prisma.downvote.deleteMany({
      where: {
        issueId,
        voterId: userId
      }
    });
    // Create new upvote
    await prisma.upvote.create({
      data: {
        voterId: userId,
        issueId
      }
    });
  }

  // Return updated issue with vote counts
  return await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      upvotes: true,
      downvotes: true
    }
  });
}

/**
 * Add a downvote to an issue
 * Ensures each user can only vote once per issue (either upvote or downvote)
 */
async function downvoteIssue(issueId, userId) {
  // Check if user already downvoted
  const existingDownvote = await prisma.downvote.findFirst({
    where: {
      issueId,
      voterId: userId
    }
  });

  if (existingDownvote) {
    // Remove downvote
    await prisma.downvote.delete({
      where: { id: existingDownvote.id }
    });
  } else {
    // Remove any existing upvote
    await prisma.upvote.deleteMany({
      where: {
        issueId,
        voterId: userId
      }
    });
    // Create new downvote
    await prisma.downvote.create({
      data: {
        voterId: userId,
        issueId
      }
    });
  }

  // Return updated issue with vote counts
  return await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      upvotes: true,
      downvotes: true
    }
  });
}

module.exports = {
  createIssue,
  getIssues,
  deleteIssue,
  upvoteIssue,
  downvoteIssue
};
