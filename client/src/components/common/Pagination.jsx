import React from "react";

/**
 * Reusable pagination component
 * @param {number} currentPage Current active page
 * @param {number} totalPages Total number of pages
 * @param {function} onPageChange Function to call when page changes
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to safely navigate to a page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of pages to show

    if (totalPages <= maxVisiblePages) {
      // If we have few pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // We have many pages, show some with ellipsis
      pages.push(1); // Always show first page

      // Determine the start and end of the visible range
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start or end
      if (currentPage <= 3) {
        rangeEnd = 4;
      } else if (currentPage >= totalPages - 2) {
        rangeStart = totalPages - 3;
      }

      // Add ellipsis before range if needed
      if (rangeStart > 2) {
        pages.push("...");
      }

      // Add the visible range
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      // Add ellipsis after range if needed
      if (rangeEnd < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages); // Always show last page
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex flex-wrap space-x-1 justify-center">
        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-1">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
