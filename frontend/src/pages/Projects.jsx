import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { GetImageUrl } from "../Utils/Utils";
import { projectAPI } from "../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    console.log("Projects data updated:", projects);
  }, [projects]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectAPI.getAll(1, 50);
      // Store the raw API data
      setProjects(response.data.data || response.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo to calculate derived values only when projects change
  const sampleProjects = useMemo(() => {
    return projects.length > 0 ? projects : [];
  }, [projects]);

  const categories = useMemo(() => {
    const uniqueCategories = ["All"];
    sampleProjects.forEach((project) => {
      if (
        project.department &&
        !uniqueCategories.includes(project.department?.toLowerCase())
      ) {
        uniqueCategories.push(project.department?.toLowerCase());
      }
    });
    return uniqueCategories;
  }, [sampleProjects]);

  const filteredProjects = useMemo(() => {
    return sampleProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.department === selectedCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.description &&
          project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [sampleProjects, selectedCategory, searchTerm]);

  const stats = useMemo(() => {
    const totalProjects = sampleProjects.length;
    const completed = sampleProjects.filter(
      (p) => p.status?.toLowerCase() === "completed",
    ).length;
    const ongoing = sampleProjects.filter(
      (p) => p.status?.toLowerCase() === "ongoing",
    ).length;
    const upcoming = sampleProjects.filter(
      (p) => p.status?.toLowerCase() === "upcoming",
    ).length;

    return { totalProjects, completed, ongoing, upcoming };
  }, [sampleProjects]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFC23C] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Error Loading Projects
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="bg-[#FFC23C] text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-[#E6AE35] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the impactful initiatives and programs we're running to
            empower women and transform communities across the region.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#FFC23C] mb-2">
                {stats.totalProjects}
              </div>
              <div className="text-gray-600">Total Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.completed}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.ongoing}
              </div>
              <div className="text-gray-600">Ongoing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {stats.upcoming}
              </div>
              <div className="text-gray-600">Upcoming Projects</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC23C] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-[#FFC23C] text-gray-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project?.id || project?._id}
                to={`/projects/${project?.id || project?._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={GetImageUrl(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
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
                <div className="p-6 flex flex-col flex-1">
                  {/* Top Section - Category and Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {project.category || "Uncategorized"}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(project.startDate)}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                      {project.title || "Untitled Project"}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {project.description || "No description available"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {project.department || "Location not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
