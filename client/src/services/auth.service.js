import axiosInstance from "@/services/api";

export const signup = async (username, password) => {
  const response = await axiosInstance.post("/auth/signup", {
    username,
    password
  });
  return response.data;
};

export const login = async (username, password) => {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
