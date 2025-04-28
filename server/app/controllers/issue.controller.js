const {
  createIssue: createIssueService,
  getIssues: getIssuesService,
  deleteIssue: deleteIssueService,
  upvoteIssue: upvoteIssueService,
  downvoteIssue: downvoteIssueService
} = require("../services/issues.service");
const logger = require("../utils/logger");

/**
 * Issue validation utilities
 */
const validateIssue = (issueData) => {
  const errors = {};
  const { title, description, category, location } = issueData;

  if (!title) errors.title = "Title is required";
  if (!description) errors.description = "Description is required";
  if (!category) errors.category = "Category is required";
  if (!location) errors.location = "Location is required";

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Create a new issue
 */
const createIssue = async (req, res, next) => {
  try {
    const validationErrors = validateIssue(req.body);
    if (validationErrors) {
      logger.debug("Issue validation failed", validationErrors);
      return res.badRequest("Validation failed", validationErrors);
    }

    const issue = await createIssueService({
      ...req.body,
      creatorId: req.user.id
    });

    logger.info(`Issue created: ${issue.id} by user ${req.user.id}`);
    return res.created(issue);
  } catch (error) {
    logger.error("Create issue error", error);
    return res.serverError("Error creating issue", error);
  }
};

/**
 * Get all issues for the current user
 */
const getIssues = async (req, res, next) => {
  try {
    const issues = await getIssuesService(req.user.id);
    logger.debug(`Retrieved ${issues.length} issues for user ${req.user.id}`);
    return res.ok(issues);
  } catch (error) {
    logger.error("Get issues error", error);
    return res.serverError("Error fetching issues", error);
  }
};

/**
 * Delete an issue
 */
const deleteIssue = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    await deleteIssueService(issueId, userId);

    logger.info(`Issue deleted: ${issueId} by user ${userId}`);
    return res.ok(null, "Issue deleted successfully");
  } catch (error) {
    logger.error(`Delete issue error: ${req.params.id}`, error);

    if (error.message.includes("not found")) {
      return res.notFound(error.message);
    }

    if (error.message.includes("Unauthorized")) {
      return res.forbidden(error.message);
    }

    return res.serverError("Error deleting issue", error);
  }
};

/**
 * Upvote an issue
 */
const upvoteIssue = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    const updatedIssue = await upvoteIssueService(issueId, userId);

    logger.debug(`Issue upvoted: ${issueId} by user ${userId}`);
    return res.ok(updatedIssue, "Upvote processed successfully");
  } catch (error) {
    logger.error(`Upvote error: ${req.params.id}`, error);

    if (error.message.includes("not found")) {
      return res.notFound(error.message);
    }

    return res.serverError("Error processing upvote", error);
  }
};

/**
 * Downvote an issue
 */
const downvoteIssue = async (req, res, next) => {
  try {
    const issueId = req.params.id;
    const userId = req.user.id;

    const updatedIssue = await downvoteIssueService(issueId, userId);

    logger.debug(`Issue downvoted: ${issueId} by user ${userId}`);
    return res.ok(updatedIssue, "Downvote processed successfully");
  } catch (error) {
    logger.error(`Downvote error: ${req.params.id}`, error);

    if (error.message.includes("not found")) {
      return res.notFound(error.message);
    }

    return res.serverError("Error processing downvote", error);
  }
};

module.exports = {
  createIssue,
  getIssues,
  deleteIssue,
  upvoteIssue,
  downvoteIssue
};
