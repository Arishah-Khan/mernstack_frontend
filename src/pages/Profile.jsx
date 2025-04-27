import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PulseLoader } from "react-spinners";

const apiUrl = import.meta.env.VITE_API_BASE_URL;


const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    country: "",
    city: "",
  });

  const navigate = useNavigate();
  const token = Cookies.get("jwt");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          setError("No token found, please login.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${apiUrl}/auth/current-user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        const user = response.data.user;
        setUserData(user);
        setFormData({
          username: user.username || "",
          address: user.address || "",
          country: user.country || "",
          city: user.city || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("jwt");
    navigate("/login");
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const { username, address, country, city } = formData;
      const updatedData = { username, address, country, city };

      const response = await axios.put(
        `${apiUrl}/auth/update-profile`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setUserData(response.data.user);
      setIsEditing(false);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222d52]">
        <PulseLoader color="#d2b68a" size={15} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#222d52] py-12 px-4">
    <motion.div
      key={userData?.username}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl bg-[#1a1f3d] p-8 rounded-lg shadow-lg border border-[#d2b68a]"
    >
        {/* Header with centered title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#fdffff]">Profile</h1>
          <p className="text-xl text-[#eee5d9] mt-2">Welcome to your profile page</p>
        </div>

        {/* Profile image - centered */}
        {userData?.image && (
          <div className="flex justify-center mb-6">
            <img
              src={userData.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#d2b68a]"
            />
          </div>
        )}

        {/* User Information */}
        <div className="space-y-6 text-center">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#eee5d9] mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#eee5d9] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#eee5d9] mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#eee5d9] mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-[#d2b68a] rounded-md bg-[#222d52] text-[#fdffff] placeholder-[#eee5d9] focus:outline-none focus:border-[#d2b68a]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Username:</strong>
                <span className="ml-2">{userData?.username}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Email:</strong>
                <span className="ml-2">{userData?.email}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Role:</strong>
                <span className="ml-2">{userData?.role}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Address:</strong>
                <span className="ml-2">{userData?.address}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Country:</strong>
                <span className="ml-2">{userData?.country}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">City:</strong>
                <span className="ml-2">{userData?.city}</span>
              </div>
              <div className="text-lg text-[#eee5d9]">
                <strong className="font-semibold">Joined on:</strong>
                <span className="ml-2">
                  {new Date(userData?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="px-6 py-3 bg-[#d2b68a] text-[#222d52] rounded-lg hover:bg-[#eee5d9] transition duration-300 font-semibold"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-[#d2b68a] text-[#222d52] rounded-lg hover:bg-[#eee5d9] transition duration-300 font-semibold"
              >
                Edit Profile
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 text-[#fdffff] rounded-lg hover:bg-red-700 transition duration-300 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
