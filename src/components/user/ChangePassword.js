import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import FormInput from "../shared/form/FormInput";
import SubmitBtn from "../shared/form/SubmitBtn";
import { toast } from "react-toastify";

/**
 * ChangePassword component allows users to change their password.
 *
 * It includes input fields for the current password, new password, and confirmation of the new password.
 * Handles validation and submission of the form to the API.
 *
 * @returns {JSX.Element} The ChangePassword form.
 */
const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchUser } = useAuth();

  /**
   * Handles form submission.
   * Validates input, sends request to change the password, and handles responses.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate that new password and confirmation match
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // Send POST request to change the password
      const response = await api.post("users/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(response.data.message);
      // Clear the form fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Fetch the updated user information
      await fetchUser();
    } catch (error) {
      // Display error message if the request fails
      toast.error(error.response?.data?.error || "An error occurred while changing the password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {/* Input for current password */}
      <FormInput
        id="current-password"
        name="current-password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        label="Current Password"
        required
        autoComplete="new-password"
      />
      {/* Input for new password */}
      <FormInput
        id="new-password"
        name="new-password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        label="New Password"
        required
        autoComplete="new-password"
      />
      {/* Input for confirming the new password */}
      <FormInput
        id="confirm-password"
        name="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        label="Confirm New Password"
        required
        autoComplete="new-password"
      />
      {/* Submit button */}
      <SubmitBtn isSubmitting={isLoading}>Change Password</SubmitBtn>
    </form>
  );
};

export default ChangePassword;
