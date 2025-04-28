const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new issue
 */
async function createIssue({
  title,
  description,
  category,
  location,
  imageUrls,
  creatorId
}) {
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
 * Get issues with votes for a specific user
 */
async function getIssuesWithVotes(userId) {
  return await prisma.issue.findMany({
    include: {
      upvotes: {
        where: {
          voterId: userId
        },
        select: {
          id: true
        }
      },
      downvotes: {
        where: {
          voterId: userId
        },
        select: {
          id: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

/**
 * Get creators by their IDs
 */
async function getCreatorsByIds(creatorIds) {
  return await prisma.user.findMany({
    where: {
      id: { in: creatorIds }
    },
    select: {
      id: true,
      email: true,
      displayName: true
    }
  });
}

/**
 * Get a single issue by ID
 */
async function getIssueById(issueId) {
  return await prisma.issue.findUnique({
    where: { id: issueId }
  });
}

/**
 * Delete an issue by ID
 */
async function deleteIssue(issueId) {
  return await prisma.issue.delete({
    where: { id: issueId }
  });
}

/**
 * Find an upvote by issue and voter
 */
async function findUpvote(issueId, voterId) {
  return await prisma.upvote.findFirst({
    where: {
      issueId,
      voterId
    }
  });
}

/**
 * Delete an upvote by ID
 */
async function deleteUpvote(upvoteId) {
  return await prisma.upvote.delete({
    where: { id: upvoteId }
  });
}

/**
 * Delete all downvotes for an issue by a specific voter
 */
async function deleteDownvotesByIssueAndVoter(issueId, voterId) {
  return await prisma.downvote.deleteMany({
    where: {
      issueId,
      voterId
    }
  });
}

/**
 * Create a new upvote
 */
async function createUpvote(voterId, issueId) {
  return await prisma.upvote.create({
    data: {
      voterId,
      issueId
    }
  });
}

/**
 * Find a downvote by issue and voter
 */
async function findDownvote(issueId, voterId) {
  return await prisma.downvote.findFirst({
    where: {
      issueId,
      voterId
    }
  });
}

/**
 * Delete a downvote by ID
 */
async function deleteDownvote(downvoteId) {
  return await prisma.downvote.delete({
    where: { id: downvoteId }
  });
}

/**
 * Delete all upvotes for an issue by a specific voter
 */
async function deleteUpvotesByIssueAndVoter(issueId, voterId) {
  return await prisma.upvote.deleteMany({
    where: {
      issueId,
      voterId
    }
  });
}

/**
 * Create a new downvote
 */
async function createDownvote(voterId, issueId) {
  return await prisma.downvote.create({
    data: {
      voterId,
      issueId
    }
  });
}

/**
 * Get an issue with its votes
 */
async function getIssueWithVotes(issueId) {
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
  getIssuesWithVotes,
  getCreatorsByIds,
  getIssueById,
  deleteIssue,
  findUpvote,
  deleteUpvote,
  deleteDownvotesByIssueAndVoter,
  createUpvote,
  findDownvote,
  deleteDownvote,
  deleteUpvotesByIssueAndVoter,
  createDownvote,
  getIssueWithVotes
};
