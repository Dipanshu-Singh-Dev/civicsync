import React from "react";

/**
 * Displays a status badge with appropriate styling based on the issue status.
 * @param {string} status The issue status ("PENDING", "IN_PROGRESS", "RESOLVED", etc.)
 */
const IssueStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

export default IssueStatusBadge;
