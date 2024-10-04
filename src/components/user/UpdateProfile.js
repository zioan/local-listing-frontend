import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useError } from "../../context/ErrorContext";
import authService from "../../lib/authService";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import { toast } from "react-toastify";

/**
 * UpdateProfile component allows users to update their profile information.
 *
 * @returns {JSX.Element} The UpdateProfile component.
 */
const UpdateProfile = () => {
  const { user, fetchUser } = useAuth();
  const { handleApiError } = useError();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    street: "",
    zip: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data when the component mounts or when user changes
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          setFormData({
            username: user.username || "",
            email: user.email || "",
            street: user.street || "",
            zip: user.zip || "",
            city: user.city || "",
          });
        }
      } catch (error) {
        handleApiError(error, "Failed to load user data");
      }
    };

    loadUserData();
  }, [user, handleApiError]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.updateProfile(formData);
      await fetchUser();
      toast.success("Profile updated successfully!");
    } catch (err) {
      handleApiError(err, "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10">
      <h2 className="mb-6 text-2xl font-bold">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form inputs for profile details */}
        <FormInput id="username" name="username" value={formData.username} onChange={handleChange} label="Username" required />
        <FormInput id="email" name="email" value={formData.email} onChange={handleChange} label="Email" type="email" required />
        <FormInput id="street" name="street" value={formData.street} onChange={handleChange} label="Street" />
        <FormInput id="zip" name="zip" value={formData.zip} onChange={handleChange} label="ZIP Code" />
        <FormInput id="city" name="city" value={formData.city} onChange={handleChange} label="City" />
        <div>
          <SubmitBtn isSubmitting={isSubmitting}>Update Profile</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
