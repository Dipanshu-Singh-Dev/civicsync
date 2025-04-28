const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get all votes grouped by date for the last 7 days
 * Returns data in a format directly usable by the Visualise component
 * @returns {Promise<Object>} Object with formatted vote data for charts
 */
exports.getVotesByDate = async (req, res) => {
  try {
    // Calculate date range (last 7 days)
    const today = new Date();
    const last7Days = Array(7)
      .fill()
      .map((_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      })
      .reverse(); // Order from oldest to newest

    // Get all upvotes with their dates
    const upvotes = await prisma.upvote.findMany({
      select: {
        createdAt: true
      }
    });

    // Get all downvotes with their dates
    const downvotes = await prisma.downvote.findMany({
      select: {
        createdAt: true
      }
    });

    // Count votes by day
    const upvotesByDay = last7Days.map(
      (date) =>
        upvotes.filter(
          (vote) =>
            new Date(vote.createdAt).toISOString().split("T")[0] === date
        ).length
    );

    const downvotesByDay = last7Days.map(
      (date) =>
        downvotes.filter(
          (vote) =>
            new Date(vote.createdAt).toISOString().split("T")[0] === date
        ).length
    );

    // Format data for the Visualise component
    const votesData = {
      labels: last7Days.map((date) =>
        new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
      ),
      datasets: [
        {
          label: "Upvotes",
          data: upvotesByDay,
          backgroundColor: "#36A2EB"
        },
        {
          label: "Downvotes",
          data: downvotesByDay,
          backgroundColor: "#FF6384"
        }
      ]
    };

    return res.status(200).json({
      success: true,
      data: votesData
    });
  } catch (error) {
    console.error("Error fetching votes by date:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching vote data",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};
