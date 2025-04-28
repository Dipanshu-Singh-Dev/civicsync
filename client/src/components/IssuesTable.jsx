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
import LocationFilter from "./issues/LocationFilter";
import Pagination from "./common/Pagination";
import IssueStatusBadge from "./issues/IssueStatusBadge";
import ImageGallery from "./common/ImageGallery";
import IssueCardView from "./issues/IssueCardView";

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
 * Main Issues Table component
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

  // Handle location filter change
  const handleLocationChange = (value) => {
    setLocationFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Issues List</h2>
        <LocationFilter
          value={locationFilter}
          onChange={handleLocationChange}
        />
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
                    {formatDate(issue.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <IssueStatusBadge status={issue.status} />
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
                          <ImageGallery images={selectedImages} />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant={issue.upvoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => onUpvote(issue.id)}
                      >
                        <ThumbsUp size={16} />
                      </Button>
                      <Button
                        variant={issue.downvoted ? "default" : "outline"}
                        size="sm"
                        onClick={() => onDownvote(issue.id)}
                      >
                        <ThumbsDown size={16} />
                      </Button>
                      {/* Only show delete button for creator */}
                      {currentUser && issue.creatorId === currentUser.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(issue.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
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
      <div className="md:hidden space-y-4">
        {currentIssues.length < 1 ? (
          <div className="text-center p-4 border rounded-lg">
            No issues found
          </div>
        ) : (
          currentIssues.map((issue) => (
            <IssueCardView
              key={issue.id}
              issue={issue}
              onUpvote={onUpvote}
              onDownvote={onDownvote}
              onDelete={onDelete}
              currentUser={currentUser}
              onViewImages={setSelectedImages}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Description Dialog */}
      <Dialog>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle id="description-dialog-title"></DialogTitle>
          </DialogHeader>
          <div id="description-dialog-content"></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IssuesTable;
