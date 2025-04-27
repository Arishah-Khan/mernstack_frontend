import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Joi from "joi";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    country: "",
    city: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const signupSchema = Joi.object({
    username: Joi.string()
      .pattern(/^[A-Za-z ]+$/)
      .min(3)
      .max(30)
      .required()
      .messages({
        "string.pattern.base": "Username can only contain letters and spaces",
      }),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email address",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must be 6-30 characters long and include at least one letter and one number.",
        "string.empty": "Password is required",
      }),
    address: Joi.string().min(5).max(100).required().messages({
      "string.empty": "Address is required",
      "string.min": "Address must be at least 5 characters long",
      "string.max": "Address must be less than 100 characters",
    }),
    country: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Country is required",
      "string.min": "Country name must be at least 2 characters long",
      "string.max": "Country name must be less than 50 characters",
    }),
    city: Joi.string().min(2).max(50).required().messages({
      "string.empty": "City is required",
      "string.min": "City name must be at least 2 characters long",
      "string.max": "City name must be less than 50 characters",
    }),
    image: Joi.any(),
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = signupSchema.validate(formData, { abortEarly: false });

    if (error) {
      toast.error(error.details.map((err) => err.message).join("\n"), {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      await axios.post(`${apiUrl}/auth/signup`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Your account has been created! Please login.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        style: {
          color: "#222d52",
          background: "#eee5d9",
          borderRadius: "8px",
          padding: "10px 20px",
          border: "2px solid #d2b68a"
        },
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#222d52]">
      <div className="max-w-md w-full space-y-8 bg-[#1a1f3d] p-8 rounded-lg shadow-lg border border-[#d2b68a]">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#fdffff]">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          {["username", "email", "password", "address", "country", "city"].map((field) => (
            <div className="mb-4" key={field}>
              <label className="block text-sm font-medium text-[#eee5d9]">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
              />
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#eee5d9]">Profile Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 w-24 h-24 object-cover rounded-full border border-[#d2b68a]"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#d2b68a] text-[#222d52] rounded-md hover:bg-[#eee5d9] transition-colors duration-300 font-semibold flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#222d52" size={20} />
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-[#eee5d9]">
              Already have an account?{" "}
              <a href="/login" className="text-[#d2b68a] hover:text-[#eee5d9] transition-colors duration-300">
                Login here
              </a>
            </p>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignupPage;
