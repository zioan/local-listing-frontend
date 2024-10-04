import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Modal component displays a modal dialog that can be opened or closed.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Flag indicating whether the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} props.title - The title of the modal.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 * @param {string} [props.size="md"] - Size of the modal (sm, md, lg, xl, full).
 * @param {boolean} [props.showCloseButton=true] - Flag to show/hide the close button.
 * @returns {JSX.Element|null} The modal or null if not open.
 */
const Modal = ({ isOpen, onClose, title, children, size = "md", showCloseButton = true }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleEscape = (event) => {
      // Close the modal when the Escape key is pressed
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event) => {
      // Close the modal when clicking outside of it
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listeners when the modal is open
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listeners on unmount or when modal state changes
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Return null if the modal is not open
  if (!isOpen) return null;

  // Define size classes for the modal based on the provided size prop
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Modal background overlay */}
      <div className="fixed inset-0 bg-black opacity-50"></div>
      {/* Modal container */}
      <div className={`relative w-auto mx-auto my-6 ${sizeClasses[size]}`} ref={modalRef}>
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {title && (
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
              <h3 className="text-2xl font-semibold">{title}</h3>
              {showCloseButton && (
                <button
                  className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                  onClick={onClose}
                  aria-label="Close Modal"
                >
                  <XMarkIcon className="w-6 h-6 text-black" />
                </button>
              )}
            </div>
          )}
          <div className="relative flex-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
