import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      toast.error("Access denied. Admin only.");
      return;
    }

    const fetchData = async () => {
      try {
        const apiUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "mernstackbackend-production-86ac.up.railway.app";

        const [usersResponse, productsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/users`),
          axios.get(`${apiUrl}/api/admin/products`),
        ]);

        setUsers(usersResponse.data.users);
        setProducts(productsResponse.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading dashboard data");
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222d52]">
        <div className="text-2xl font-bold text-[#d2b68a]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222d52] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#fdffff] mb-8">Admin Dashboard</h1>

        {/* Users Section */}
        <div className="bg-[#1a1f3d] rounded-lg shadow-md p-6 mb-8 border border-[#d2b68a]">
          <h2 className="text-2xl font-semibold text-[#fdffff] mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#222d52]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1a1f3d] divide-y divide-[#d2b68a]">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-[#1a1f3d] rounded-lg shadow-md p-6 border border-[#d2b68a]">
          <h2 className="text-2xl font-semibold text-[#fdffff] mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#222d52]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#eee5d9] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[#1a1f3d] divide-y divide-[#d2b68a]">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#eee5d9]">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-[#d2b68a] hover:text-[#eee5d9] mr-2">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 