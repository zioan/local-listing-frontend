import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ImageGallery = ({ images, onClose, startIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (event.key === "Escape") {
        onClose();
      }
    },
    [images, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleBackgroundClick = (event) => {
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
