import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../../components/shared/form/SubmitBtn";
import FormInput from "../../components/shared/form/FormInput";
import { toast } from "react-toastify";

/**
 * Login component for user authentication.
 * Allows users to input their credentials to log in.
 */
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  /**
   * Handles input changes by updating form data and clearing corresponding errors.
   * @param {Object} e - The event object.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /**
   * Validates form data to ensure required fields are filled out.
   * @returns {boolean} - True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Check if there are no errors
  };

  /**
   * Handles form submission to log the user in.
   * @param {Object} e - The event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Validate before submitting

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData.email, formData.password); // Attempt to log in
      const oldPath = location.state?.from?.pathname; // Get the path user came from
      navigate(oldPath || "/"); // Navigate to the previous path or home
      toast.success("Logged in successfully!"); // Show success message
    } catch (err) {
      // Handle login errors
      if (typeof err === "object" && err !== null) {
        setErrors(err);
        if (err.non_field_errors) {
          toast.error(err.non_field_errors[0]);
        } else {
          toast.error("Login failed. Please check your credentials and try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            label="Email address"
            required
            error={errors.email}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            required
            error={errors.password}
          />
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <SubmitBtn isSubmitting={isSubmitting}>Sign in</SubmitBtn>
          </div>
        </form>
        {errors.non_field_errors && <p className="mt-2 text-sm text-center text-red-600">{errors.non_field_errors}</p>}
        <div className="text-sm text-center">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
