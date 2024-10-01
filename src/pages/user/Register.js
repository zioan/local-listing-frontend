import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../../components/shared/form/SubmitBtn";
import FormInput from "../../components/shared/form/FormInput";
import { toast } from "react-toastify";

/**
 * Register component that handles user registration.
 * It collects user details and communicates with the auth context to create a new account.
 */
function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
    street: "",
    zip: "",
    city: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update form data state and clear any existing error for the current field
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await register(formData);
      navigate("/profile");
      toast.success("Account created successfully!");
    } catch (err) {
      if (err && typeof err === "object") {
        setErrors(err); // Set the error state with the received error object
        Object.entries(err).forEach(([key, value]) => {
          // Check if the error value is an array (multiple messages)
          if (Array.isArray(value)) {
            value.forEach((message) => toast.error(message));
          } else {
            toast.error(value); // Single error message
          }
        });
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
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Create your account</h2>
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
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            label="Username"
            required
            error={errors.username}
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
          <FormInput
            id="password2"
            name="password2"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            label="Confirm Password"
            required
            error={errors.password2}
          />
          <FormInput id="street" name="street" type="text" value={formData.street} onChange={handleChange} label="Street" error={errors.street} />
          <FormInput id="zip" name="zip" type="text" value={formData.zip} onChange={handleChange} label="ZIP Code" error={errors.zip} />
          <FormInput id="city" name="city" type="text" value={formData.city} onChange={handleChange} label="City" error={errors.city} />
          <div>
            <SubmitBtn isSubmitting={isSubmitting}>Register</SubmitBtn>
          </div>
        </form>
        {errors.non_field_errors && <p className="mt-2 text-sm text-center text-red-600">{errors.non_field_errors}</p>}
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
