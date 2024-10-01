import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * ImageGallery component displays a gallery of images with navigation controls.
 *
 * @param {Object} props - The component props.
 * @param {string[]} props.images - An array of image URLs to display.
 * @param {Function} props.onClose - Function to call when the gallery is closed.
 * @param {number} [props.startIndex=0] - The index of the image to display first.
 */
const ImageGallery = ({ images, onClose, startIndex = 0 }) => {
  // State to track the currently displayed image index.
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  /**
   * Handles keyboard navigation (left/right arrows to navigate images and Escape to close).
   *
   * @param {KeyboardEvent} event - The keyboard event.
   */
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        // Move to the previous image, wrap around if at the beginning.
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (event.key === "ArrowRight") {
        // Move to the next image, wrap around if at the end.
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (event.key === "Escape") {
        // Close the gallery on Escape key press.
        onClose();
      }
    },
    [images, onClose]
  );

  // Add and clean up the event listener for keydown events.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Handles clicks on the background to close the gallery.
   *
   * @param {MouseEvent} event - The click event.
   */
  const handleBackgroundClick = (event) => {
    // Close the gallery only if the background (not the image or buttons) is clicked.
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={handleBackgroundClick}>
      <button onClick={onClose} className="absolute text-white top-4 right-4 hover:text-gray-300">
        <XMarkIcon className="w-8 h-8" />
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
        className="absolute text-white left-4 hover:text-gray-300"
      >
        <ChevronLeftIcon className="w-12 h-12" />
      </button>
      <img src={images[currentIndex]} alt={`Listing ${currentIndex + 1}`} className="object-contain max-w-full max-h-full" />
      <button
        onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
        className="absolute text-white right-4 hover:text-gray-300"
      >
        <ChevronRightIcon className="w-12 h-12" />
      </button>
      <div className="absolute left-0 right-0 text-center text-white bottom-4">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageGallery;
