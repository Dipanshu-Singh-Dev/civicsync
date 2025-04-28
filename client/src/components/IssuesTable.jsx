import React, { useState } from "react";
// Remove unused import since we're using our own implementation
// import Table from "react-table-lite";
import { ThumbsUp, ThumbsDown, Trash2, Image as ImageIcon } from "lucide-react"; // Removed unused Loader2
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

// Location options - assuming these match your schema
const LOCATIONS = [
  "ALL",
  "MAYUR_VIHAR",
  "KANHAIYA_NAGAR",
  "MANSAROVAR_PARK",
  "GTB_NAGAR",
  "KIRTI_NAGAR",
  "SHAHDARA",
  "KASHMERE_GATE",
  "BURARI",
  "OTHER"
];

// Format location for display
const formatLocation = (location) => {
  if (location === "ALL") return "All Locations";
  return location
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Renders a table displaying issue data with pagination and action buttons.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.issues - An array of issue objects.
 * @param {Object} props.currentUser - The currently logged in user object.
 * @param {Function} props.onUpvote - Callback when upvote button is clicked.
 * @param {Function} props.onDownvote - Callback when downvote button is clicked.
 * @param {Function} props.onDelete - Callback when delete button is clicked.
 */
function IssuesTable({
  issues,
  onUpvote = () => {},
  onDownvote = () => {},
  onDelete = () => {}
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [selectedImages, setSelectedImages] = useState([]);
  const itemsPerPage = 5;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Apply location filter
  const filteredIssues =
    locationFilter === "ALL"
      ? issues
      : issues?.filter((issue) => issue.location === locationFilter);

  // Calculate pagination
  const totalPages = Math.ceil((filteredIssues?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIssues = filteredIssues?.slice(startIndex, endIndex) || [];

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Handle location filter change
  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Issues List</h2>

        {/* Location filter */}
        <div className="flex items-center w-full sm:w-auto">
          <label htmlFor="location-filter" className="mr-2 text-sm font-medium">
            Filter by location:
          </label>
          <select
            id="location-filter"
            value={locationFilter}
            onChange={handleLocationChange}
            className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5"
          >
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {formatLocation(location)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden md:block overflow-x-auto border rounded-lg mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Creator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Images
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentIssues.length < 1 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No issues found
                </td>
              </tr>
            ) : (
              currentIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{issue.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {issue.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatLocation(issue.location)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {issue.creator?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : issue.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {issue.imageUrls?.length > 0 ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-blue-600 hover:text-blue-900"
                            onClick={() => setSelectedImages(issue.imageUrls)}
                          >
                            <ImageIcon size={18} className="mr-1" />
                            <span>View ({issue.imageUrls.length})</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Issue Images</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedImages.map((url, index) => (
                              <div
                                key={index}
                                className="rounded-lg overflow-hidden"
                              >
                                <img
                                  src={url}
                                  alt={`Issue Image ${index + 1}`}
                                  className="w-full h-auto object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      "No images"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onUpvote(issue.id)}
                        className={`${
                          issue.upvoted
                            ? "text-blue-800 bg-blue-100 rounded-full p-2"
                            : "text-blue-600 hover:text-blue-900 p-2"
                        }`}
                        title="Upvote"
                      >
                        <ThumbsUp size={18} />
                      </button>
                      <button
                        onClick={() => onDownvote(issue.id)}
                        className={`${
                          issue.downvoted
                            ? "text-red-800 bg-red-100 rounded-full p-2"
                            : "text-red-600 hover:text-red-900 p-2"
                        }`}
                        title="Downvote"
                      >
                        <ThumbsDown size={18} />
                      </button>

                      {/* Only show delete button if user is creator and status is PENDING */}
                      {currentUser &&
                        issue.creatorId === currentUser.id &&
                        issue.status === "PENDING" && (
                          <button
                            onClick={() => onDelete(issue.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Visible only on small screens */}
      <div className="md:hidden space-y-4 mb-4 px-1">
        {currentIssues.length < 1 ? (
          <div className="text-center p-4 bg-white rounded-lg border">
            No issues found
          </div>
        ) : (
          currentIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium truncate max-w-[70%]">
                  {issue.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    issue.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : issue.status === "IN_PROGRESS"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {issue.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                <div className="overflow-hidden">
                  <span className="text-gray-500">Category:</span>{" "}
                  <span className="truncate">{issue.category}</span>
                </div>
                <div className="overflow-hidden">
                  <span className="text-gray-500">Location:</span>{" "}
                  <span className="truncate">
                    {formatLocation(issue.location)}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="text-gray-500">Created:</span>{" "}
                  <span className="truncate">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="text-gray-500">By:</span>{" "}
                  <span className="truncate">
                    {issue.creator?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Images */}
              {issue.imageUrls?.length > 0 ? (
                <div className="mb-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center w-full justify-center text-blue-600"
                        onClick={() => setSelectedImages(issue.imageUrls)}
                      >
                        <ImageIcon size={16} className="mr-1" />
                        <span>View Images ({issue.imageUrls.length})</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Issue Images</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedImages.map((url, index) => (
                          <div
                            key={index}
                            className="rounded-lg overflow-hidden"
                          >
                            <img
                              src={url}
                              alt={`Issue Image ${index + 1}`}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex justify-center space-x-3 pt-2 border-t">
                <button
                  onClick={() => onUpvote(issue.id)}
                  className={`flex items-center justify-center ${
                    issue.upvoted
                      ? "text-blue-800 bg-blue-100 rounded-full p-2"
                      : "text-blue-600 hover:text-blue-900 p-2"
                  }`}
                  title="Upvote"
                >
                  <ThumbsUp size={16} />
                  <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
                    Upvote
                  </span>
                </button>
                <button
                  onClick={() => onDownvote(issue.id)}
                  className={`flex items-center justify-center ${
                    issue.downvoted
                      ? "text-red-800 bg-red-100 rounded-full p-2"
                      : "text-red-600 hover:text-red-900 p-2"
                  }`}
                  title="Downvote"
                >
                  <ThumbsDown size={16} />
                  <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
                    Downvote
                  </span>
                </button>

                {/* Only show delete button if user is creator and status is PENDING */}
                {currentUser &&
                  issue.creatorId === currentUser.id &&
                  issue.status === "PENDING" && (
                    <button
                      onClick={() => onDelete(issue.id)}
                      className="flex items-center justify-center text-gray-600 hover:text-gray-900 p-2"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
                        Delete
                      </span>
                    </button>
                  )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex flex-wrap space-x-1 max-w-[60vw] justify-center">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => goToPage(num + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === num + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default IssuesTable;
