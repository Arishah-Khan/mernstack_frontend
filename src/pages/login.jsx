import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Joi from "joi";
import "react-toastify/dist/ReactToastify.css"; 

const apiUrl = "mernstackbackend-production-86ac.up.railway.app/api";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginSchema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org"] } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Enter a valid email",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,30}$"))
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.pattern.base": "Password must have at least one letter and one number",
      }),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Login Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = loginSchema.validate(formData, { abortEarly: false });

    if (error) {
      toast.error(error.details.map((err) => err.message).join("\n"), {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

  
    try {
      const { data } = await axios.post(`${apiUrl}/auth/login`, formData, {
        withCredentials: true,
      });

      Cookies.set("jwt", data.token, { expires: 7 });

      toast.success("You are now logged in!", {
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
        navigate("/");
        window.location.reload();

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
    <div className="flex items-center justify-center min-h-screen bg-[#222d52]">
      <div className="bg-[#1a1f3d] p-6 rounded-lg shadow-md w-96 border border-[#d2b68a]">
        <h2 className="text-2xl font-bold text-center text-[#fdffff] mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#eee5d9]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
            />
          </div>

          {/* 🔹 Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#eee5d9]">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
            />
          </div>

          {/* 🔹 Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#d2b68a] text-[#222d52] rounded-md hover:bg-[#eee5d9] transition-colors duration-300 font-semibold flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#222d52" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* 🔹 Signup Link */}
        <p className="mt-4 text-sm text-center text-[#eee5d9]">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#d2b68a] hover:text-[#eee5d9] transition-colors duration-300">
            Signup
          </Link>
        </p>
      </div>

      <ToastContainer /> 
    </div>
  );
};

export default Login;
