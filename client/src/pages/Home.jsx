import React, { useState, useEffect } from "react";

import {
  getIssues,
  upvoteIssue,
  downvoteIssue,
  deleteIssue
} from "@/services/issue.service";
import { toast } from "sonner";
import IssuesTable from "@/components/IssuesTable";

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchIssues = async () => {
    try {
      setIsLoading(true);
      const response = await getIssues();
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast.error("Failed to load issues");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const onUpvote = async (issueId) => {
    try {
      await upvoteIssue(issueId);
      toast.success("Upvote recorded successfully");
      fetchIssues(); // Refresh issues list
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error(error.response?.data?.message || "Failed to upvote");
    }
  };
  const onDownvote = async (issueId) => {
    try {
      await downvoteIssue(issueId);
      toast.success("Downvote recorded successfully");
      fetchIssues(); // Refresh issues list
    } catch (error) {
      console.error("Error downvoting:", error);
      toast.error(error.response?.data?.message || "Failed to downvote");
    }
  };
  const onDelete = async (issueId) => {
    try {
      await deleteIssue(issueId);
      toast.success("Issue deleted successfully");
      fetchIssues(); // Refresh issues list
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(error.response?.data?.message || "Failed to delete issue");
    }
  };
  return (
    <div>
      <IssuesTable
        issues={issues}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        onDelete={onDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Home;
