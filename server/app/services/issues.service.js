const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new issue and add the creator as a participant
 */
async function createIssue({
  title,
  description,
  type,
  startTime,
  endTime,
  maxParticipants,
  tag,
  userId
}) {
  return await prisma.issue.create({
    data: {
      title,
      description,
      type,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      maxParticipants: maxParticipants ? Number(maxParticipants) : undefined,
      tag,
      creator: { connect: { id: userId } },
      participants: { create: { user: { connect: { id: userId } } } }
    }
  });
}

/**
 * Fetch public issues and private issues for the user
 */
async function getIssues(userId) {
  const publicIssues = await prisma.issue.findMany({
    where: { type: "PUBLIC" },
    orderBy: { startTime: "asc" }
  });

  const privateIssues = await prisma.issue.findMany({
    where: {
      type: "PRIVATE",
      OR: [{ userId }, { participants: { some: { userId: userId } } }]
    },
    orderBy: { startTime: "asc" }
  });

  return { publicIssues, privateIssues };
}

module.exports = { createIssue, getIssues };
