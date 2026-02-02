import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  ArrowLeft,
  Clock,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";
import { projectAPI } from "../services/api";

const ProjectDetails = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getAll(1, 50);
      // Check the response structure
      console.log("API Response:", response.data);
      const projectsData = response.data.data || response.data || [];
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample projects data with both id and _id
  const fallbackProjects = [
    {
      id: 1,
      _id: "1",
      title: "Digital Literacy for Rural Women",
      description:
        "Empowering rural women with basic digital skills and internet literacy to bridge the digital divide and enhance their access to information and opportunities.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500",
      category: "Education",
      status: "Completed",
      department: "Rural Tamil Nadu",
      startDate: "2023-01-15",
      endDate: "2023-06-30",
      participants: 250,
      impact: "95% participants gained digital literacy skills",
      objectives: [
        "Teach basic computer skills to 250 rural women",
        "Improve internet literacy and online safety awareness",
        "Provide access to digital government services",
      ],
      outcomes: [
        "250 women completed digital literacy training",
        "95% passed the basic computer skills assessment",
        "Increased confidence in using digital tools",
      ],
    },
    {
      id: 2,
      _id: "2",
      title: "Women Entrepreneurship Development",
      description:
        "Comprehensive training program focusing on business development, financial management, and market access for aspiring women entrepreneurs.",
      image: "https://images.unsplash.com/photo-1551833996-2c5c12eed91a?w=500",
      category: "Entrepreneurship",
      status: "Ongoing",
      department: "Urban Centers",
      startDate: "2024-01-10",
      endDate: "2024-12-15",
      participants: 150,
      impact: "45 new businesses launched",
      objectives: [
        "Train 150 women in business development",
        "Provide financial management education",
        "Facilitate market access for products",
      ],
      outcomes: [
        "45 new businesses successfully launched",
        "120 women completed financial literacy training",
        "Increased revenue for participating entrepreneurs",
      ],
    },
  ];

  // Combine API projects with fallback if needed
  const sampleProjects = projects.length > 0 ? projects : fallbackProjects;

  // Find the project by id - check both id and _id properties
  const project = sampleProjects.find((p) => {
    // Check if id matches either p.id or p._id
    const stringId = id?.toString();
    return (
      p?.id?.toString() === stringId ||
      p?._id?.toString() === stringId ||
      (p?.id && parseInt(p.id) === parseInt(id)) ||
      (p?._id && parseInt(p._id) === parseInt(id))
    );
  });

  // Debug logging
  console.log("Looking for project with id:", id);
  console.log(
    "Available projects:",
    sampleProjects.map((p) => ({
      id: p.id,
      _id: p._id,
      title: p.title,
    })),
  );
  console.log("Found project:", project);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC23C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The project you're looking for doesn't exist.
          </p>
          <Link
            to="/projects"
            className="bg-[#FFC23C] text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-[#E6AE35] transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
      case "active":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate duration safely
  const calculateDuration = () => {
    if (!project.startDate || !project.endDate) return "Not specified";
    try {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch (error) {
      return "Invalid dates";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  project?.status,
                )} mb-3`}
              >
                {project?.status || "Unknown Status"}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                {project?.title || "Untitled Project"}
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {project?.abstract || "No abstract description available."}
              </p>
            </div>
            <span className="mt-4 lg:mt-0 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold w-fit">
              {project?.department || "Not specified"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <img
                src={
                  project?.image ||
                  "https://via.placeholder.com/800x400?text=No+Image"
                }
                alt={project?.title || "Project Image"}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Project Overview
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="whitespace-pre-line">
                  {project?.description || "No detailed description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Project Details
              </h3>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">
                      {project?.department || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium">Year</p>
                    <p className="text-sm">{project?.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Projects */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Related Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProjects
              .filter((p) => {
                const currentProjectId = project?.id || project?._id;
                const otherProjectId = p?.id || p?._id;
                return (
                  currentProjectId !== otherProjectId &&
                  p.category === project.category
                );
              })
              .slice(0, 3)
              .map((relatedProject) => (
                <Link
                  key={relatedProject.id || relatedProject._id}
                  to={`/projects/${relatedProject.id || relatedProject._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  <img
                    src={
                      relatedProject.image ||
                      "https://via.placeholder.com/400x250?text=No+Image"
                    }
                    alt={relatedProject.title || "Related Project"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {relatedProject.title || "Untitled Project"}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedProject.description || "No description available"}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
