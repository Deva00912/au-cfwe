import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Loader,
  Calendar,
  MapPin,
} from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import { useToast } from "../context/ToastContext";
import { projectAPI } from "../services/api";

const ProjectAdmin = () => {
  const { success, error: showError } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  const statuses = ["ongoing", "completed", "upcoming"];

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    abstract: "",
    department: "",
    year: new Date().getFullYear(),
    status: "ongoing",
    image: null,
    imagePreview: null,
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectAPI.getAll(1, 100);
      const projectData = response.data?.data || response.data || [];
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      showError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingProject(null);
    resetForm();
    setShowForm(true);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title || "",
      description: project.description || "",
      abstract: project.abstract || "",
      department: project.department || "",
      year: project.year || new Date().getFullYear(),
      status: project.status || "ongoing",
      image: null,
      imagePreview: project.image || null,
    });
    setShowForm(true);
  };

  const validateForm = () => {
    const errors = [];

    if (!newProject.title?.trim()) {
      errors.push("Please enter project title");
    }
    if (!newProject.description?.trim()) {
      errors.push("Please enter project description");
    }
    if (!newProject.department?.trim()) {
      errors.push("Please enter department");
    }
    if (
      !newProject.year ||
      newProject.year < 2000 ||
      newProject.year > new Date().getFullYear() + 5
    ) {
      errors.push(
        "Please enter a valid year (2000 - " +
          (new Date().getFullYear() + 5) +
          ")",
      );
    }
    if (!editingProject && !newProject.image && !newProject.imagePreview) {
      errors.push("Please upload a project image for new projects");
    }

    if (errors.length > 0) {
      showError(errors[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("title", newProject.title.trim());
      formData.append("description", newProject.description.trim());
      formData.append("abstract", newProject.abstract?.trim() || "");
      formData.append("department", newProject.department.trim());
      formData.append("year", newProject.year.toString());
      formData.append("status", newProject.status);

      if (newProject.image instanceof File) {
        formData.append("image", newProject.image);
      }

      if (editingProject) {
        const projectId = editingProject._id || editingProject.id;
        await projectAPI.update(projectId, formData);
        success("Project updated successfully!");
      } else {
        await projectAPI.create(formData);
        success("Project added successfully!");
      }

      closeForm();
      await fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
      let errorMessage = "Failed to save project";
      if (err.response?.data?.error) {
        if (Array.isArray(err.response.data.error)) {
          errorMessage = err.response.data.error.join(", ");
        } else if (typeof err.response.data.error === "string") {
          errorMessage = err.response.data.error;
        }
      }
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (projectId, projectTitle) => {
    setDeleteModal({
      isOpen: true,
      projectId,
      projectTitle,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.projectId) return;

    try {
      await projectAPI.delete(deleteModal.projectId);
      setProjects((prev) =>
        prev.filter((p) => (p._id || p.id) !== deleteModal.projectId),
      );
      success("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      showError("Failed to delete project");
    } finally {
      handleDeleteCancel();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: "" });
  };

  const resetForm = () => {
    setNewProject({
      title: "",
      description: "",
      abstract: "",
      department: "",
      year: new Date().getFullYear(),
      status: "ongoing",
      image: null,
      imagePreview: null,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showError("Please upload an image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setNewProject((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) || "" : value,
    }));
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProject(null);
    resetForm();
  };

  const renderProjectImage = (imageUrl, title) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt={title || "Project"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/400x200?text=Image+Error";
          }}
        />
      );
    }
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-gray-400" />
      </div>
    );
  };

  const getProjectsStats = () => {
    const total = projects.length;
    const completed = projects.filter((p) => p.status === "completed").length;
    const ongoing = projects.filter((p) => p.status === "ongoing").length;
    const upcoming = projects.filter((p) => p.status === "upcoming").length;

    return { total, completed, ongoing, upcoming };
  };

  const stats = getProjectsStats();

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC23C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Project Management
          </h1>
          <p className="text-gray-600">
            Manage and organize all empowerment projects
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              All Projects ({projects.length})
            </h2>
            <button
              onClick={handleAddClick}
              className="bg-[#FFC23C] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-[#E6AE35] transition-colors flex items-center"
              disabled={submitting}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Project
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.ongoing}
              </div>
              <div className="text-sm text-gray-600">Ongoing</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.upcoming}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start by adding your first project.
              </p>
              <button
                onClick={handleAddClick}
                className="bg-[#FFC23C] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-[#E6AE35] transition-colors"
                disabled={submitting}
              >
                Add Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id || project.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                >
                  {/* Project Image */}
                  <div className="relative h-40 overflow-hidden">
                    {renderProjectImage(project.image, project.title)}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          project.status,
                        )}`}
                      >
                        {project.status || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                        {project.title || "Untitled Project"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {project.department || "No department specified"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {project.description || "No description available"}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{project.year || "Year not specified"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                        disabled={submitting}
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteClick(
                            project._id || project.id,
                            project.title || "Untitled Project",
                          )
                        }
                        className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        disabled={submitting}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <button
                  onClick={closeForm}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingProject ? "Edit Project" : "Add New Project"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {editingProject
                      ? "Update project details"
                      : "Fill in the project information"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={submitting}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newProject.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                      placeholder="Enter project title"
                      required
                      disabled={submitting}
                    />
                  </div>

                  {/* Department - NOW AN INPUT BOX (since backend is fixed) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={newProject.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                      placeholder="e.g., Computer Science, Women's Empowerment Cell, etc."
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                    placeholder="Describe the project in detail..."
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Abstract */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    value={newProject.abstract}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                    placeholder="Brief abstract of the project..."
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      name="year"
                      value={newProject.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                      required
                      disabled={submitting}
                    >
                      {Array.from(
                        { length: 20 },
                        (_, i) => new Date().getFullYear() + 5 - i,
                      ).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={newProject.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent transition-colors"
                      required
                      disabled={submitting}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingProject
                      ? "Project Image (Optional)"
                      : "Project Image *"}
                  </label>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Preview */}
                    {(newProject.imagePreview ||
                      (editingProject && editingProject.image)) && (
                      <div className="lg:w-1/3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={
                              newProject.imagePreview || editingProject.image
                            }
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    <div
                      className={
                        newProject.imagePreview ||
                        (editingProject && editingProject.image)
                          ? "lg:w-2/3"
                          : "w-full"
                      }
                    >
                      <div
                        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#FFC23C] transition-colors ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() =>
                          !submitting && fileInputRef.current?.click()
                        }
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 mb-1">
                          {newProject.image ||
                          (editingProject && editingProject.image)
                            ? "Click to change image"
                            : "Click to upload project image"}
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG up to 10MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={submitting}
                        />
                      </div>
                      {editingProject &&
                        !newProject.image &&
                        !newProject.imagePreview && (
                          <p className="mt-2 text-sm text-gray-500">
                            Current image will be kept if no new image is
                            selected
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={submitting}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#FFC23C] text-gray-800 px-4 py-3 rounded-lg font-semibold hover:bg-[#E6AE35] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        {editingProject ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {editingProject ? "Update Project" : "Create Project"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteModal.projectTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProjectAdmin;
