import { Calendar, Clock, Edit3, Trash2, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import ConfirmationModal from "../components/ConfirmationModal";
import RichTextEditor from "../components/RichTextEditor";
import { useToast } from "../context/ToastContext";
import { programAPI } from "../services/api";

const ProgramAdmin = () => {
  const { success, error: showError } = useToast();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [activeTab, setActiveTab] = useState("add");
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    programToDelete: null,
    title: "",
    message: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear(),
    department: "",
    description: "",
    duration: "",
    participants: "",
    date: new Date().toISOString().split("T")[0],
    image: null,
    imagePreview: null,
  });

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programAPI.getAll();
      console.log("API Response:", response.data);

      let programData = [];
      if (response.data?.data?.programs) {
        programData = response.data.data.programs;
      } else if (response.data?.programs) {
        programData = response.data.programs;
      } else if (Array.isArray(response.data)) {
        programData = response.data;
      } else if (Array.isArray(response.data?.data)) {
        programData = response.data.data;
      }

      console.log("Setting programs to:", programData);
      setPrograms(programData);
    } catch (err) {
      console.error("Error fetching programs:", err);
      showError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  // Group programs by year using useMemo for optimization
  const programsByYear = useMemo(() => {
    const years = {};

    console.log("Grouping programs by year. Total programs:", programs.length);

    programs.forEach((program) => {
      if (!program?.year) {
        console.log("Program missing year:", program);
        return;
      }

      if (!years[program.year]) {
        years[program.year] = [];
      }
      years[program.year].push(program);
    });

    console.log("Years object:", years);

    // Sort years in descending order and programs by date
    const sortedYears = Object.keys(years)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .reduce((sorted, year) => {
        sorted[year] = years[year].sort(
          (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
        );
        return sorted;
      }, {});

    console.log("Sorted years:", sortedYears);
    return sortedYears;
  }, [programs]);

  // Open confirmation modal for delete
  const handleDeleteClick = (program) => {
    setConfirmationModal({
      isOpen: true,
      programToDelete: program,
      title: "Delete Program",
      message: `Are you sure you want to delete "${program.title}"? This action cannot be undone.`,
      type: "danger",
    });
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!confirmationModal.programToDelete) return;

    const programId =
      confirmationModal.programToDelete._id ||
      confirmationModal.programToDelete.id;
    if (!programId) {
      showError("Cannot delete: Program ID is missing");
      return;
    }

    try {
      await programAPI.delete(programId);
      setPrograms((prev) => prev.filter((p) => (p._id || p.id) !== programId));
      success(
        `"${confirmationModal.programToDelete.title}" has been deleted successfully.`,
      );
    } catch (err) {
      console.error("Error deleting program:", err);
      showError("Failed to delete program");
    } finally {
      handleCloseModal();
    }
  };

  // Close confirmation modal
  const handleCloseModal = () => {
    setConfirmationModal({
      isOpen: false,
      programToDelete: null,
      title: "",
      message: "",
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: previewUrl,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      year: new Date().getFullYear(),
      department: "",
      description: "",
      duration: "",
      participants: "",
      date: new Date().toISOString().split("T")[0],
      image: null,
      imagePreview: null,
    });
    setEditingProgram(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.title.trim()) {
      showError("Please enter a program title");
      return;
    }
    if (!formData.department.trim()) {
      showError("Please enter a department/organization");
      return;
    }
    if (!formData.description.trim()) {
      showError("Please enter a program description");
      return;
    }
    if (!formData.duration.trim()) {
      showError("Please enter program duration");
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title.trim());
      formPayload.append("year", formData.year);
      formPayload.append("department", formData.department.trim());
      formPayload.append("description", formData.description.trim());
      formPayload.append("duration", formData.duration.trim());
      formPayload.append("participants", formData.participants || "0");
      formPayload.append("date", formData.date);

      if (formData.image && formData.image instanceof File) {
        formPayload.append("image", formData.image);
      }

      console.log("Submitting form:", {
        title: formData.title,
        year: formData.year,
        department: formData.department,
        duration: formData.duration,
        participants: formData.participants,
        date: formData.date,
        editingProgram: editingProgram,
      });

      if (editingProgram) {
        const programId = editingProgram._id || editingProgram.id;
        if (!programId) {
          showError("Cannot update: Program ID is missing");
          return;
        }

        await programAPI.update(programId, formPayload);
        success("Program updated successfully!");
      } else {
        await programAPI.create(formPayload);
        success("Program created successfully!");
      }

      resetForm();
      await fetchPrograms();
    } catch (err) {
      console.error("Error submitting program:", err);
      showError(err.response?.data?.message || "Failed to save program");
    }
  };

  const handleEdit = (program) => {
    console.log("Editing program:", program);
    setEditingProgram(program);
    setFormData({
      title: program.title || "",
      year: program.year || new Date().getFullYear(),
      department: program.department || "",
      description: program.description || "",
      duration: program.duration || "",
      participants: program.participants?.toString() || "",
      date: program.date || new Date().toISOString().split("T")[0],
      image: null,
      imagePreview: program.image || null,
    });
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  // Helper functions
  const formatExcerpt = (html, maxLength = 100) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const renderProgramImage = (imageUrl) => {
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Program"
          className="w-20 h-20 object-cover rounded-lg"
        />
      );
    }
    return (
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-2xl">📁</div>
      </div>
    );
  };

  // Debug log to check what's being rendered
  console.log("Current state:", {
    programs,
    programsByYear,
    loading,
    activeTab,
  });

  // Loading state
  if (loading && programs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading programs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Program Management
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors ${
              activeTab === "add"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => {
              setActiveTab("add");
              if (editingProgram) handleCancelEdit();
            }}
          >
            {editingProgram ? "Edit Program" : "Add New Program"}
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg transition-colors ${
              activeTab === "manage"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Programs ({programs.length})
          </button>
        </div>

        {activeTab === "add" ? (
          /* Add/Edit Program Form */
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {editingProgram ? "Edit Program" : "Create New Program"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Program Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    placeholder="Enter program title"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    {Array.from(
                      { length: 10 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department - CHANGED TO INPUT BOX */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department/Organization *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    placeholder="e.g., Computer Science Department, Women's Empowerment Cell, etc."
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    placeholder="e.g., 6 months, 1 year, 2 weeks, etc."
                  />
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Estimated number of participants"
                    min="0"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Program Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Description *
                </label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  placeholder="Describe the program objectives, activities, outcomes..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Image (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                  {formData.imagePreview && (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold transition-colors"
                >
                  {editingProgram ? "Update Program" : "Add Program"}
                </button>

                {editingProgram && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-500 text-white py-3 px-8 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-semibold transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 py-3 px-8 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-semibold transition-colors"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Manage Programs Section */
          <div className="space-y-8">
            {Object.keys(programsByYear).length > 0 ? (
              Object.keys(programsByYear).map((year) => (
                <div
                  key={year}
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white">
                        {year} Programs
                      </h2>
                      <div className="text-green-100">
                        {programsByYear[year].length} program(s)
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-4">
                      {programsByYear[year].map((program) => (
                        <div
                          key={program._id || program.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-start gap-4">
                            {/* Program Image */}
                            {renderProgramImage(program.image)}

                            {/* Program Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                  {program.title}
                                </h3>
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded whitespace-nowrap">
                                  {program.department}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span>{program.date || "Date not set"}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                                  <span>
                                    {program.duration ||
                                      "Duration not specified"}
                                  </span>
                                </div>
                                {program.participants && (
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                                    <span>
                                      {program.participants} participants
                                    </span>
                                  </div>
                                )}
                              </div>

                              <p className="text-gray-600 text-sm line-clamp-2">
                                {formatExcerpt(program.description)}
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(program)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Edit Program"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(program)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Delete Program"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Programs Yet
                </h3>
                <p className="text-gray-500">
                  Start by adding your first program using the "Add New Program"
                  tab.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ProgramAdmin;
