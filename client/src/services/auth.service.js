import axiosInstance from "@/services/api";

export const signup = async (email, password) => {
  const response = await axiosInstance.post("/auth/signup", {
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", {
    email,
    password
  });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};
