import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../../components/shared/SubmitBtn";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate("/profile");
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            {Object.entries({
              email: "Email address",
              username: "Username",
              password: "Password",
              password2: "Confirm Password",
              street: "Street",
              zip: "ZIP Code",
              city: "City",
            }).map(([name, label]) => (
              <div key={name}>
                <label htmlFor={name} className="sr-only">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={name.includes("password") ? "password" : "text"}
                  required={!["street", "zip", "city"].includes(name)}
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder={label}
                  value={formData[name]}
                  onChange={handleChange}
                />
                {errors[name] && <p className="mt-2 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div>
            <SubmitBtn isLoading={isLoading}>Register</SubmitBtn>
          </div>
        </form>
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
