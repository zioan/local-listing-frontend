import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import { toast } from "react-toastify";
import Modal from "../shared/Modal";

/**
 * DeleteAccount component allows users to delete their account.
 * It shows a confirmation modal before proceeding with the deletion.
 *
 * @returns {JSX.Element} The DeleteAccount component.
 */
const DeleteAccount = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the account deletion process.
   *
   * - Opens the delete confirmation modal.
   * - Calls the API to delete the user's account.
   * - Logs the user out and redirects to the homepage upon successful deletion.
   * - Shows a toast message based on the result of the deletion request.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the deletion process is complete.
   */
  const handleDeleteAccount = async () => {
    setIsDeleteModalOpen(true);
    setIsDeleting(true);
    try {
      await api.delete("users/delete-account/");
      toast.success("Your account has been deleted successfully.");
      logout();
      navigate("/");
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-xl font-semibold">Delete Account</h2>
      <p className="mb-4">Warning: This action is irreversible and will permanently delete your account and all associated data.</p>
      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Delete Account
      </button>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Account Deletion" size="sm">
        <p className="mb-4">Last chance to change your mind. We are sorry that you are leaving the community.</p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </Modal>
    </div>
  );
};

export default DeleteAccount;
