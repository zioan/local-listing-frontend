import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/api";
import FormInput from "../../components/shared/form/FormInput";
import SubmitBtn from "../../components/shared/form/SubmitBtn";
import { toast } from "react-toastify";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("users/password-reset-confirm/", { token, new_password: password });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      console.error("Password reset failed:", error);
      toast.error(error.response?.data?.error || "Failed to reset password. Please try again.");
      setError(error.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Reset Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <div>
            <SubmitBtn isSubmitting={isSubmitting}>Reset Password</SubmitBtn>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
