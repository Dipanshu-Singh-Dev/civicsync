import { create } from "zustand";

export const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")),
  handleLogout: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
  handleLogin: (userDetails) => {
    localStorage.setItem("user", JSON.stringify(userDetails));
    set({ user: userDetails });
  }
}));
