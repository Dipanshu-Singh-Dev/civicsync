import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateIssue, Home, Login, Issue, Signup, Visualise } from "@/pages";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import { useStore } from "@/store";
const AppRouter = () => {
  const { user } = useStore();
  return (
    <Router>
      <Navbar />
      <Toaster position="top-right" />
      <div id="body-container">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/issue" element={user ? <Issue /> : <Login />} />
          <Route
            path="/create-issue"
            element={user ? <CreateIssue /> : <Login />}
          />
          <Route path="/visualise" element={user ? <Visualise /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
