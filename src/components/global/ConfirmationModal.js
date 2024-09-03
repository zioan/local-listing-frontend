import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50" id="my-modal">
      <div className="relative p-5 mx-auto bg-white border rounded-md shadow-lg top-20 w-96">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          <div className="py-3 mt-2 px-7">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="w-full px-4 py-2 text-base font-medium text-white bg-red-500 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              onClick={onConfirm}
            >
              Delete
            </button>
            <button
              id="cancel-btn"
              className="w-full px-4 py-2 mt-3 text-base font-medium text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
