import axiosInstance from "@/services/api";

export const createIssue = async (issueData) => {
  const response = await axiosInstance.post("/issues", issueData);
  return response.data;
};

export const getIssues = async () => {
  const response = await axiosInstance.get("/issues");
  return response.data;
};

export const upvoteIssue = async (issueId) => {
  const response = await axiosInstance.post(`/issues/${issueId}/upvote`);
  return response.data;
};

export const downvoteIssue = async (issueId) => {
  const response = await axiosInstance.post(`/issues/${issueId}/downvote`);
  return response.data;
};

export const deleteIssue = async (issueId) => {
  const response = await axiosInstance.delete(`/issues/${issueId}`);
  return response.data;
};
