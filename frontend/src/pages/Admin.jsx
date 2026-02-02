import {
  Bell,
  Calendar,
  FileText,
  Image,
  Plus,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor";
import ConfirmationModal from "../components/ConfirmationModal";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import RenderImage from "../components/RenderImage";
import { useToast } from "../context/ToastContext";
import { newsAPI } from "../services/api";
import { FormatExcerpt } from "../Utils/Utils";

const Admin = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  // State management
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState({
    news: [],
    notifications: [],
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
    imagePreview: null,
    isNotification: false,
  });

  // Delete confirmation state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "", // 'news' or 'notification'
    id: null,
    title: "",
  });

  // Calculate quick stats from actual data
  const quickStats = useMemo(
    () => [
      {
        icon: <FileText className="w-6 h-6 text-blue-600" />,
        count: data.news.length,
        text: "News Posts",
      },
      {
        icon: <Bell className="w-6 h-6 text-red-600" />,
        count: data.notifications.length,
        text: "Notifications",
      },
      {
        icon: <Users className="w-6 h-6 text-green-600" />,
        count: data.news.length + data.notifications.length,
        text: "Total Posts",
      },
      {
        icon: <Settings className="w-6 h-6 text-purple-600" />,
        count: 4, // Hardcoded admin tools count
        text: "Admin Tools",
      },
    ],
    [data.news.length, data.notifications.length],
  );

  const quickActions = useMemo(
    () => [
      {
        icon: <Plus className="w-8 h-8 text-blue-600 mr-3" />,
        text: "Create Post",
        description: "Add new news or notification",
        onHover: "hover:border-blue-500",
        onClick: () => setActiveTab("add"),
      },
      {
        icon: <Calendar className="w-8 h-8 text-green-600 mr-3" />,
        text: "Manage Programs",
        description: "Manage programs and initiatives",
        onHover: "hover:border-green-500",
        onClick: () => navigate("/admin/programs"),
      },
      {
        icon: <Image className="w-8 h-8 text-[#FFC23C] mr-3" />,
        text: "Manage Gallery",
        description: "Upload and manage images",
        onHover: "hover:border-[#FFC23C]",
        onClick: () => navigate("/admin/gallery"),
      },

      {
        icon: <FileText className="w-8 h-8 text-purple-600 mr-3" />,
        text: "Manage Projects",
        description: "Add and manage empowerment projects",
        onHover: "hover:border-purple-500",
        onClick: () => navigate("/admin/projects"),
      },
    ],
    [navigate],
  );

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await newsAPI.getAll(1, 100);

      // Handle different API response structures
      let items = [];
      if (Array.isArray(response.data?.data)) {
        items = response.data.data;
      } else if (Array.isArray(response.data?.news)) {
        items = response.data.news;
      } else if (Array.isArray(response.data)) {
        items = response.data;
      }

      // Categorize items based on isNotification flag or category field
      const newsItems = items.filter(
        (item) => !item.isNotification && item.category !== "notification",
      );
      const notificationItems = items.filter(
        (item) => item.isNotification || item.category === "notification",
      );

      setData({
        news: newsItems,
        notifications: notificationItems,
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      showError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Form handlers
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      showError("Title is required");
      return false;
    }
    if (
      !formData.content ||
      formData.content.trim() === "<p><br></p>" ||
      formData.content.trim().length < 10
    ) {
      showError("Please add meaningful content (minimum 10 characters)");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("content", formData.content);
      formPayload.append("isNotification", String(formData.isNotification));

      if (formData.image && formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      const response = await newsAPI.create(formPayload);
      const newItem = response.data?.data || response.data;

      // Update state based on post type
      if (formData.isNotification) {
        setData((prev) => ({
          ...prev,
          notifications: [newItem, ...prev.notifications],
        }));
        success("Notification published successfully!");
      } else {
        setData((prev) => ({
          ...prev,
          news: [newItem, ...prev.news],
        }));
        success("News post published successfully!");
      }

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Error creating post:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to publish";
      showError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    // Clean up object URL if exists
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }

    setFormData({
      title: "",
      content: "",
      image: null,
      imagePreview: null,
      isNotification: false,
    });
  };

  // Delete handlers
  const handleDeleteClick = (type, id, title) => {
    if (!id) {
      showError("Cannot delete: Item ID is missing");
      return;
    }

    setDeleteModal({
      isOpen: true,
      type,
      id,
      title: title || "Untitled",
    });
  };

  const handleDeleteConfirm = async () => {
    const { type, id } = deleteModal;
    if (!id) return;

    try {
      await newsAPI.delete(id);

      if (type === "news") {
        setData((prev) => ({
          ...prev,
          news: prev.news.filter((item) => item._id !== id && item.id !== id),
        }));
        success("News post deleted successfully!");
      } else if (type === "notification") {
        setData((prev) => ({
          ...prev,
          notifications: prev.notifications.filter(
            (item) => item._id !== id && item.id !== id,
          ),
        }));
        success("Notification deleted successfully!");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      showError("Failed to delete item");
    }

    handleDeleteCancel();
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, type: "", id: null, title: "" });
  };

  // Loading state for initial data fetch
  if (loading && data.news.length === 0 && data.notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-4 max-w-2xl mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-3xl mx-auto"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Actions Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-24 ml-3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your Centre for Empowerment of Women content, news,
            notifications, programs, and gallery.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <QuickStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <QuickActionsCard key={index} {...action} />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <TabButton
            active={activeTab === "add"}
            onClick={() => setActiveTab("add")}
            icon={<Plus className="w-5 h-5 mr-2" />}
            text="Create Content"
          />
          <TabButton
            active={activeTab === "manage"}
            onClick={() => setActiveTab("manage")}
            icon={<FileText className="w-5 h-5 mr-2" />}
            text="Manage Content"
          />
        </div>

        {/* Main Content */}
        {activeTab === "add" ? (
          <AddContentForm
            formData={formData}
            handleFormChange={handleFormChange}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            submitting={submitting}
          />
        ) : (
          <ManageContentSection
            data={data}
            handleDeleteClick={handleDeleteClick}
          />
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${
            deleteModal.type === "news" ? "News Post" : "Notification"
          }`}
          message={`Are you sure you want to delete "${deleteModal.title}"?`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

// Reusable Components
const QuickStatsCard = ({ icon, count, text }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-1">{count}</h3>
    <p className="text-gray-600 text-sm">{text}</p>
  </div>
);

const QuickActionsCard = ({ icon, text, description, onClick, onHover }) => (
  <div
    className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent ${onHover} group`}
    onClick={onClick}
  >
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800 ml-3 group-hover:text-blue-600 transition-colors">
        {text}
      </h3>
    </div>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-lg flex items-center transition-colors ${
      active
        ? "border-b-2 border-blue-600 text-blue-600"
        : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-300"
    }`}
  >
    {icon}
    {text}
  </button>
);

const AddContentForm = ({
  formData,
  handleFormChange,
  handleImageUpload,
  handleSubmit,
  submitting,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="postTitle"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <InputBox
            id="postTitle"
            type="text"
            value={formData.title}
            required
            disabled={submitting}
            placeholder="Enter post title"
            onChange={(e) => handleFormChange("title", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleFormChange("content", value)}
            placeholder="Write your content here..."
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="featuredImage"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Featured Image (Optional)
          </label>
          <InputBox
            id="featuredImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={submitting}
            className={`block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2 transition-colors ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
          {formData.imagePreview && (
            <div className="mt-3">
              <p className="text-sm text-green-600 mb-2">Image Preview:</p>
              <div className="relative">
                <RenderImage
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(formData.imagePreview);
                    handleFormChange("image", null);
                    handleFormChange("imagePreview", null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  disabled={submitting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="newsType"
              type="radio"
              name="postType"
              checked={!formData.isNotification}
              onChange={() => handleFormChange("isNotification", false)}
              disabled={submitting}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="newsType" className="block text-sm text-gray-900">
              Regular News
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="notificationType"
              type="radio"
              name="postType"
              checked={formData.isNotification}
              onChange={() => handleFormChange("isNotification", true)}
              disabled={submitting}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="notificationType"
              className="block text-sm text-gray-900"
            >
              Important Notification
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : formData.isNotification
                ? "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Publishing...
            </>
          ) : (
            `Publish ${formData.isNotification ? "Notification" : "News"}`
          )}
        </Button>
      </form>
    </div>
  );
};

const ManageContentSection = ({ data, handleDeleteClick }) => {
  return (
    <div className="space-y-6">
      {/* Notifications Management */}
      <ContentSection
        title="Important Notifications"
        icon={<Bell className="w-6 h-6 text-red-600" />}
        count={data.notifications.length}
        items={data.notifications}
        type="notification"
        emptyMessage="No notifications yet."
        emptyIcon={<Bell className="w-12 h-12 text-gray-300" />}
        onDelete={handleDeleteClick}
      />

      {/* News Management */}
      <ContentSection
        title="News Posts"
        icon={<FileText className="w-6 h-6 text-blue-600" />}
        count={data.news.length}
        items={data.news}
        type="news"
        emptyMessage="No news posts yet."
        emptyIcon={<FileText className="w-12 h-12 text-gray-300" />}
        onDelete={handleDeleteClick}
        formatExcerpt={FormatExcerpt}
        showImages={true}
      />
    </div>
  );
};

const ContentSection = ({
  title,
  icon,
  count,
  items,
  type,
  emptyMessage,
  emptyIcon,
  onDelete,
  formatExcerpt,
  showImages = false,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
          <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
            {count}
          </span>
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          {emptyIcon}
          <p className="text-gray-500 mt-3">{emptyMessage}</p>
        </div>
      ) : (
        <div
          className={
            showImages ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"
          }
        >
          {items.map((item) => (
            <ContentItem
              key={item._id || item.id}
              item={item}
              type={type}
              onDelete={onDelete}
              formatExcerpt={formatExcerpt}
              showImage={showImages}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ContentItem = ({
  item,
  type,
  onDelete,
  formatExcerpt,
  showImage = false,
  formatDate,
}) => {
  const getContent = () => {
    if (formatExcerpt && item.content) {
      return formatExcerpt(item.content, 150);
    }
    return item.excerpt || item.content || "No content available";
  };

  const getImageUrl = () => {
    return item.image?.url || item.image || item.featuredImage;
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
        type === "notification"
          ? "border-red-200 bg-red-50 hover:bg-red-100"
          : "border-gray-200 hover:bg-gray-50"
      }`}
    >
      {showImage && getImageUrl() && (
        <div className="mb-3">
          <RenderImage
            src={getImageUrl()}
            alt={item.title}
            className="w-full h-40 object-cover rounded"
          />
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span
              className={`text-xs font-semibold px-2 py-1 rounded mr-2 ${
                type === "notification"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {type === "notification" ? "IMPORTANT" : "NEWS"}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(item.date || item.createdAt)}
            </span>
          </div>
          <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2">
            {item.title || "Untitled Post"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{getContent()}</p>
        </div>

        <Button
          onClick={() => onDelete(type, item._id || item.id, item.title)}
          className="ml-4 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
          title={`Delete ${type === "news" ? "News" : "Notification"}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Admin;
