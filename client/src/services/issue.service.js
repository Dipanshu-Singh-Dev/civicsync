import axiosInstance from "@/services/api";
export const createIssue = async (issueData) => {
  const response = await axiosInstance.post("/issues", issueData);

  if (!response.ok) {
    throw new Error("Failed to create issue");
  }

  return response.data;
};
