import React from "react";

/**
 * Reusable image gallery component that displays images in a responsive grid
 * @param {string[]} images Array of image URLs to display
 */
const ImageGallery = ({ images }) => {
  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500">No images to display</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {images.map((url, index) => (
        <div key={index} className="rounded-lg overflow-hidden">
          <img
            src={url}
            alt={`Image ${index + 1}`}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
