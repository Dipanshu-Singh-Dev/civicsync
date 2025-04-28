import axiosInstance from "@/services/api";
export const createIssue = async (issueData) => {
  const response = await axiosInstance.post("/issues", issueData);

  return response.data;
};
