import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import FormInput from "../../components/shared/form/FormInput";
import SubmitBtn from "../../components/shared/form/SubmitBtn";
import { toast } from "react-toastify";

/**
 * ForgotPassword component for handling password reset requests.
 * Allows users to submit their email address to receive a password reset link.
 */
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  /**
   * Handles the form submission to request a password reset.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("users/password-reset-request/", { email });
      setIsEmailSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render a confirmation message if the email has been sent
  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Check Your Email</h2>
            <p className="mt-2 text-center text-gray-600">
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the password reset form
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Forgot Password</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            required
            autoComplete="email"
          />

          <div>
            <SubmitBtn isSubmitting={isSubmitting}>Send Reset Link</SubmitBtn>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
