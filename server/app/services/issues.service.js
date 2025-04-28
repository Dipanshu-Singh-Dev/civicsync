const issueRepository = require("../repositories/issue.repository");

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
  return await issueRepository.createIssue({
    title,
    description,
    category,
    location,
    imageUrls,
    creatorId
  });
}

/**
 * Fetch public issues and private issues for the user
 */
async function getIssues(userId) {
  try {
    // Get issues with vote status
    const issues = await issueRepository.getIssuesWithVotes(userId);

    // Get all unique creator IDs from the issues
    const creatorIds = [...new Set(issues.map((issue) => issue.creatorId))];

    // Fetch creators
    const creators = await issueRepository.getCreatorsByIds(creatorIds);

    // Create a lookup map for creators
    const creatorMap = {};
    creators.forEach((creator) => {
      creatorMap[creator.id] = creator;
    });

    // Map issues with creators when available
    return issues.map((issue) => ({
      ...issue,
      creator: creatorMap[issue.creatorId] || {
        email: "deleted-user@example.com",
        displayName: "Deleted User"
      },
      upvoted: issue.upvotes.length > 0,
      downvoted: issue.downvotes.length > 0,
      upvotes: undefined,
      downvotes: undefined
    }));
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
}

/**
 * Delete an issue if the user is the creator and status is PENDING
 */
async function deleteIssue(issueId, userId) {
  // First, check if the issue exists and the user is the creator
  const issue = await issueRepository.getIssueById(issueId);

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
  return await issueRepository.deleteIssue(issueId);
}

/**
 * Add an upvote to an issue
 * Ensures each user can only vote once per issue (either upvote or downvote)
 */
async function upvoteIssue(issueId, userId) {
  // Check if user already upvoted
  const existingUpvote = await issueRepository.findUpvote(issueId, userId);

  if (existingUpvote) {
    // Remove upvote
    await issueRepository.deleteUpvote(existingUpvote.id);
  } else {
    // Remove any existing downvote
    await issueRepository.deleteDownvotesByIssueAndVoter(issueId, userId);

    // Create new upvote
    await issueRepository.createUpvote(userId, issueId);
  }

  // Return updated issue with vote counts
  return await issueRepository.getIssueWithVotes(issueId);
}

/**
 * Add a downvote to an issue
 * Ensures each user can only vote once per issue (either upvote or downvote)
 */
async function downvoteIssue(issueId, userId) {
  // Check if user already downvoted
  const existingDownvote = await issueRepository.findDownvote(issueId, userId);

  if (existingDownvote) {
    // Remove downvote
    await issueRepository.deleteDownvote(existingDownvote.id);
  } else {
    // Remove any existing upvote
    await issueRepository.deleteUpvotesByIssueAndVoter(issueId, userId);

    // Create new downvote
    await issueRepository.createDownvote(userId, issueId);
  }

  // Return updated issue with vote counts
  return await issueRepository.getIssueWithVotes(issueId);
}

module.exports = {
  createIssue,
  getIssues,
  deleteIssue,
  upvoteIssue,
  downvoteIssue
};
