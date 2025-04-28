import axiosInstance from "@/services/api";

export const getVotesByDate = async () => {
  const response = await axiosInstance.get("/votes/by-date");
  return response.data;
};
