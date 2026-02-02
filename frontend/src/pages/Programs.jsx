import { Calendar, Clock, Filter, Search, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { GetImageUrl } from "../Utils/Utils";
import { programAPI } from "../services/api";

const Programs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await programAPI.getAll();
      let programData = [];

      // Handle different response structures
      if (Array.isArray(response.data?.data?.programs)) {
        programData = response.data.data.programs;
      } else if (Array.isArray(response.data?.programs)) {
        programData = response.data.programs;
      } else if (Array.isArray(response.data?.data)) {
        programData = response.data.data;
      } else if (Array.isArray(response.data)) {
        programData = response.data;
      }

      // Ensure all programs have required fields
      const validatedPrograms = programData.map((program) => ({
        ...program,
        id: program._id || program.id || Date.now().toString(),
        title: program.title || "Untitled Program",
        description: program.description || "",
        department: program.department || "General",
        year: program.year?.toString() || new Date().getFullYear().toString(),
        duration: program.duration || "Not specified",
        participants: program.participants || 0,
        date: program.date || program.year?.toString() || "Date not set",
        image: program.image || null,
      }));

      setPrograms(validatedPrograms);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError("Failed to load programs. Please try again later.");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  // Use useMemo for performance optimization
  const programsByYear = useMemo(() => {
    return programs.reduce((acc, program) => {
      const year =
        program.year?.toString() || new Date().getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(program);
      return acc;
    }, {});
  }, [programs]);

  const allYears = useMemo(() => {
    return Object.keys(programsByYear)
      .filter((year) => year && year !== "undefined")
      .sort((a, b) => b.localeCompare(a));
  }, [programsByYear]);

  const filteredProgramsByYear = useMemo(() => {
    if (!searchTerm && selectedYear === "all") {
      return programsByYear;
    }

    return Object.keys(programsByYear).reduce((acc, year) => {
      const yearPrograms = programsByYear[year].filter((program) => {
        // Search filter
        const searchMatch =
          !searchTerm ||
          program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          program.department?.toLowerCase().includes(searchTerm.toLowerCase());

        // Year filter
        const yearMatch = selectedYear === "all" || selectedYear === year;

        return searchMatch && yearMatch;
      });

      if (yearPrograms.length > 0) {
        acc[year] = yearPrograms;
      }
      return acc;
    }, {});
  }, [programsByYear, searchTerm, selectedYear]);

  const totalFilteredPrograms = useMemo(() => {
    return Object.values(filteredProgramsByYear).reduce(
      (total, yearPrograms) => total + yearPrograms.length,
      0,
    );
  }, [filteredProgramsByYear]);

  const formatExcerpt = (html, maxLength = 150) => {
    if (!html) return "No description available";
    const text = html.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const renderProgramImage = (program) => {
    const imageUrl = program.image?.url || program.image;

    if (imageUrl) {
      return (
        <img
          src={GetImageUrl(imageUrl)}
          alt={program.title}
          className="w-full h-48 object-cover rounded-t-lg"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='192'%3E%3Crect fill='%23e5e7eb' width='400' height='192'/%3E%3Ctext x='50%' y='50%' font-family='Arial' font-size='16' fill='%239ca3af' text-anchor='middle' dy='.3em'%3E📷%3C/text%3E%3C/svg%3E";
          }}
        />
      );
    }
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
        <div className="text-gray-400 text-4xl">📚</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Programs & Initiatives
            </h1>
          </div>

          {/* Loading Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <div className="space-y-8">
            {[1, 2, 3].map((year) => (
              <div
                key={year}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-6 py-4 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((program) => (
                      <div
                        key={program}
                        className="border border-gray-200 rounded-lg"
                      >
                        <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && programs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Programs & Initiatives
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error}
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't load the programs at this time.
            </p>
            <button
              onClick={fetchPrograms}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
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
            Programs & Initiatives
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive programs and initiatives designed to
            empower students through skill development, research opportunities,
            and career advancement.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs by title, description, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Year Filter */}
            <div className="flex gap-2 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Years</option>
                {allYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {programs.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{totalFilteredPrograms}</span> of{" "}
              <span className="font-semibold">{programs.length}</span> programs
              {searchTerm && (
                <span>
                  {" "}
                  for <span className="font-semibold">"{searchTerm}"</span>
                </span>
              )}
              {selectedYear !== "all" && (
                <span>
                  {" "}
                  in <span className="font-semibold">{selectedYear}</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Programs by Year */}
        {programs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Programs Available
            </h3>
            <p className="text-gray-500">
              No programs have been added yet. Please check back later.
            </p>
          </div>
        ) : totalFilteredPrograms === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No programs found
            </h3>
            <p className="text-gray-500 mb-4">
              No programs match your search
              {searchTerm && ` for "${searchTerm}"`}
              {selectedYear !== "all" && ` in ${selectedYear}`}.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedYear("all");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(filteredProgramsByYear).map((year) => (
              <div
                key={year}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Year Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">
                      {year} Programs
                    </h2>
                    <div className="flex items-center text-blue-100 bg-white/20 px-3 py-1 rounded-full">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="font-medium">
                        {filteredProgramsByYear[year].length} program
                        {filteredProgramsByYear[year].length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Programs Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProgramsByYear[year].map((program) => (
                      <Link
                        key={program._id || program.id}
                        to={`/programs/${program._id || program.id}`}
                        className="group border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300 block bg-white hover:border-blue-300"
                      >
                        {renderProgramImage(program)}
                        <div className="p-4">
                          {/* Program Meta */}
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded line-clamp-1">
                              {program.department}
                            </span>
                            <span className="text-xs text-gray-500">
                              {program.duration}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {program.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {formatExcerpt(program.description)}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {program.participants} participants
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                              <span>{program.date}</span>
                            </div>
                          </div>

                          {/* View Details */}
                          <div className="w-full flex items-center justify-center text-blue-600 group-hover:text-white group-hover:bg-blue-600 font-medium text-sm py-2 border border-blue-200 group-hover:border-blue-600 rounded transition-colors duration-300">
                            View Details
                            <svg
                              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;
