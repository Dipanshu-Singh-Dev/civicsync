import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateIssue, Home, Login, Issue, Signup } from "@/pages";
import Navbar from "@/components/Navbar";
import { useStore } from "@/store";
const AppRouter = () => {
  const { user } = useStore();
  return (
    <Router>
      <Navbar />

      <div id="body-container" className="pt-20">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/issue" element={<Issue />} />
          <Route path="/create-issue" element={<CreateIssue />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
