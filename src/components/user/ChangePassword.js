import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import FormInput from "../shared/form/FormInput";
import SubmitBtn from "../shared/form/SubmitBtn";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("users/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(response.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      await fetchUser();
    } catch (error) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data?.error || "An error occurred while changing the password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
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
      <SubmitBtn isSubmitting={isLoading}>Change Password</SubmitBtn>
    </form>
  );
};

export default ChangePassword;
