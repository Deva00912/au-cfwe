import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Mail,
  User,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Edit2,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { authAPI } from "../services/api";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import ConfirmationModal from "../components/ConfirmationModal";

const StaffManagement = () => {
  const { success, error: showError } = useToast();
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    setLoading(true);
    try {
      // Fetch all users - in a real app, you'd have a staff endpoint
      // For now, we'll show a message that this would fetch from /api/admin/staff
      setStaffMembers([
        {
          _id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          createdAt: "2024-01-15",
        },
      ]);
    } catch (err) {
      console.error("Error fetching staff:", err);
      showError("Failed to load staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.password) {
        showError("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        showError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Call API to create new staff member
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.user) {
        setStaffMembers((prev) => [
          ...prev,
          {
            ...response.data.user,
            role: formData.role,
          },
        ]);

        success("Staff member added successfully!");

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "admin",
        });
        setActiveTab("list");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to add staff member";
      showError(errorMessage);
      console.error("Error adding staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirmation({
      isOpen: true,
      id,
      name,
    });
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteConfirmation;

    try {
      // Call API to delete staff member
      // await staffAPI.delete(id);

      setStaffMembers((prev) => prev.filter((member) => member._id !== id));

      success("Staff member removed successfully!");
      setDeleteConfirmation({ isOpen: false, id: null, name: "" });
    } catch (err) {
      showError("Failed to remove staff member");
      console.error("Error deleting staff:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600">
            Manage admin accounts and staff members
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "list"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Staff Members
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === "add"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            <Plus className="w-4 h-4" />
            Add Staff Member
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "list" ? (
          // Staff List Tab
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Added Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.length > 0 ? (
                    staffMembers.map((member) => (
                      <tr
                        key={member._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">
                                {member.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {member.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                            {member.role || "admin"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteClick(member._id, member.name)
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <p className="text-gray-500">No staff members found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Add Staff Tab
          <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add New Staff Member
            </h2>

            <form onSubmit={handleAddStaff} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <InputBox
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <InputBox
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="staff@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <InputBox
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Staff Member..." : "Add Staff Member"}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${deleteConfirmation.name}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteConfirmation({ isOpen: false, id: null, name: "" })
        }
        isDangerous={true}
      />
    </div>
  );
};

export default StaffManagement;
