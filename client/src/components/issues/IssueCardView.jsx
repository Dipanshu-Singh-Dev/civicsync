import React from "react";
import { ThumbsUp, ThumbsDown, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import IssueStatusBadge from "./IssueStatusBadge";
import ImageGallery from "../common/ImageGallery";
import { formatLocation } from "./LocationFilter";

/**
 * Mobile-optimized card view for an issue
 * @param {Object} issue The issue data to display
 * @param {Function} onUpvote Function to call when upvote is clicked
 * @param {Function} onDownvote Function to call when downvote is clicked
 * @param {Function} onDelete Function to call when delete is clicked
 * @param {Object} currentUser The current user object
 * @param {Function} onViewImages Function to call when viewing images
 */
const IssueCardView = ({
  issue,
  onUpvote,
  onDownvote,
  onDelete,
  currentUser,
  onViewImages
}) => {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium truncate max-w-[70%]">
          {issue.title}
        </h3>
        <IssueStatusBadge status={issue.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
        <div className="overflow-hidden">
          <span className="text-gray-500">Category:</span>{" "}
          <span className="truncate">{issue.category}</span>
        </div>
        <div className="overflow-hidden">
          <span className="text-gray-500">Location:</span>{" "}
          <span className="truncate">{formatLocation(issue.location)}</span>
        </div>
        <div className="overflow-hidden">
          <span className="text-gray-500">Created:</span>{" "}
          <span className="truncate">{formatDate(issue.createdAt)}</span>
        </div>
        <div className="overflow-hidden">
          <span className="text-gray-500">By:</span>{" "}
          <span className="truncate">{issue.creator?.email || "N/A"}</span>
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
                onClick={() => onViewImages(issue.imageUrls)}
              >
                <ImageIcon size={16} className="mr-1" />
                <span>View Images ({issue.imageUrls.length})</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Issue Images</DialogTitle>
              </DialogHeader>
              <ImageGallery images={issue.imageUrls} />
            </DialogContent>
          </Dialog>
        </div>
      ) : null}

      {/* Actions */}
      <div className="flex justify-center space-x-3 pt-2 border-t">
        <Button
          variant={issue.upvoted ? "default" : "outline"}
          size="sm"
          onClick={() => onUpvote(issue.id)}
          className="flex items-center"
        >
          <ThumbsUp size={16} />
          <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
            Upvote
          </span>
        </Button>
        <Button
          variant={issue.downvoted ? "default" : "outline"}
          size="sm"
          onClick={() => onDownvote(issue.id)}
          className="flex items-center"
        >
          <ThumbsDown size={16} />
          <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
            Downvote
          </span>
        </Button>

        {/* Only show delete button if user is creator */}
        {currentUser && issue.creatorId === currentUser.id && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(issue.id)}
            className="flex items-center"
          >
            <Trash2 size={16} />
            <span className="sr-only sm:not-sr-only sm:ml-1 text-xs sm:text-sm">
              Delete
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default IssueCardView;
