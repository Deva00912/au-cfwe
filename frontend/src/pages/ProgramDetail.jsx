import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Users, Clock, MapPin, Edit3 } from "lucide-react";
import { GetImageUrl } from "../Utils/Utils";
import { programAPI } from "../services/api";

const ProgramDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProgramData();
  }, [id]);

  const fetchProgramData = async () => {
    if (!id) {
      setError("Invalid program ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await programAPI.getById(id);
      setProgram(response.data.data || response.data);
    } catch (err) {
      console.error("Error fetching program:", err);
      setError("Failed to load program");
    } finally {
      setLoading(false);
    }
  };

  // Dummy programs data (fallback)
  const fallbackPrograms = [
    {
      id: 1,
      title: "Computer Science Bootcamp",
      description:
        "<p>Intensive 12-week program focusing on full-stack web development with modern technologies like React, Node.js, and MongoDB.</p>",
      department: "Computer Science",
      duration: "12 weeks",
      participants: 45,
      date: "Spring 2024",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      updatedAt: "2024-03-15",
    },
    {
      id: 2,
      title: "Business Analytics Workshop",
      description:
        "<p>Hands-on workshop teaching data analysis techniques and business intelligence tools for decision making.</p>",
      department: "Business",
      duration: "8 weeks",
      participants: 32,
      date: "Summer 2024",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      updatedAt: "2024-06-20",
    },
    {
      id: 3,
      title: "AI & Machine Learning Seminar",
      description:
        "<p>Advanced seminar covering the latest developments in artificial intelligence and machine learning algorithms.</p>",
      department: "Computer Science",
      duration: "6 weeks",
      participants: 28,
      date: "Fall 2024",
      year: "2024",
      updatedAt: "2024-09-10",
    },
    {
      id: 4,
      title: "Entrepreneurship Program",
      description:
        "<p>Comprehensive program guiding students through the process of starting and scaling their own businesses.</p>",
      department: "Business",
      duration: "16 weeks",
      participants: 50,
      date: "Spring 2023",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      updatedAt: "2023-05-30",
    },
    {
      id: 5,
      title: "Digital Marketing Certification",
      description:
        "<p>Certification program covering SEO, social media marketing, content strategy, and analytics.</p>",
      department: "Marketing",
      duration: "10 weeks",
      participants: 40,
      date: "Winter 2023",
      year: "2023",
      updatedAt: "2023-12-15",
    },
    {
      id: 6,
      title: "Cybersecurity Fundamentals",
      description:
        "<p>Introduction to cybersecurity principles, threat detection, and network security protocols. Learn about common vulnerabilities and how to protect systems from attacks.</p><p>The course includes hands-on labs where students practice ethical hacking techniques in a controlled environment.</p>",
      department: "Computer Science",
      duration: "14 weeks",
      participants: 35,
      date: "Fall 2023",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      updatedAt: "2023-11-05",
    },
    {
      id: 7,
      title: "Sustainable Development Project",
      description:
        "<p>Interdisciplinary project focusing on sustainable solutions for environmental challenges. Students from different majors collaborate to address real-world sustainability issues.</p><p>Projects may include renewable energy solutions, waste management systems, or sustainable urban planning concepts.</p>",
      department: "Environmental Science",
      duration: "20 weeks",
      participants: 25,
      date: "Spring 2022",
      year: "2022",
      updatedAt: "2022-06-01",
    },
    {
      id: 8,
      title: "Public Speaking Masterclass",
      description:
        "<p>Masterclass designed to improve presentation skills, communication, and public speaking confidence. Learn techniques for engaging audiences and delivering compelling presentations.</p><p>Includes video recording sessions with personalized feedback from communication experts.</p>",
      department: "Communication",
      duration: "5 weeks",
      participants: 60,
      date: "Summer 2022",
      year: "2022",
      image:
        "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      updatedAt: "2022-08-20",
    },
  ];

  const renderProgramImage = (
    program,
    className = "w-full lg:w-64 h-48 object-cover rounded-lg shadow-lg"
  ) => {
    if (program.image) {
      return (
        <img
          src={GetImageUrl(program.image)}
          alt={program.title}
          className={className}
        />
      );
    }
    return (
      <div
        className={`bg-gray-200 rounded-lg shadow-lg flex items-center justify-center ${className}`}
      >
        <div className="text-gray-400 text-6xl">📁</div>
      </div>
    );
  };

  const renderRelatedProgramImage = (relatedProgram) => {
    if (relatedProgram.image) {
      return (
        <img
          src={GetImageUrl(relatedProgram.image)}
          alt={relatedProgram.title}
          className="w-full h-40 object-cover"
        />
      );
    }
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-4xl">📁</div>
      </div>
    );
  };

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              to="/programs"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Programs
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {program.department}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {program.title}
                </h1>
                <p className="text-blue-100 text-lg max-w-3xl">
                  {program.description
                    .replace(/<[^>]*>/g, "")
                    .substring(0, 200)}
                  ...
                </p>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8">
                {renderProgramImage(program)}
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Program Date</p>
                  <p className="font-semibold text-gray-800">{program.date}</p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <Clock className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-800">
                    {program.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Participants</p>
                  <p className="font-semibold text-gray-800">
                    {program.participants || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <MapPin className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-semibold text-gray-800">{program.year}</p>
                </div>
              </div>
            </div>

            {/* Program Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                About the Program
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
            </div>

            {/* Program Highlights */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Program Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Organized by {program.department}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Conducted in {program.year}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">
                    Duration: {program.duration}
                  </span>
                </div>
                {program.participants && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">
                      {program.participants} participants
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Additional Information
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>
                  <strong>Department:</strong> {program.department}
                </p>
                <p>
                  <strong>Program Year:</strong> {program.year}
                </p>
                <p>
                  <strong>Duration:</strong> {program.duration}
                </p>
                <p>
                  <strong>Date:</strong> {program.date}
                </p>
                {program.participants && (
                  <p>
                    <strong>Participants:</strong> {program.participants}{" "}
                    students
                  </p>
                )}
                <p>
                  <strong>Last Updated:</strong>{" "}
                  {program.updatedAt
                    ? new Date(program.updatedAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Programs */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Other Programs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackPrograms
              .filter((p) => p.id !== program.id)
              .slice(0, 3)
              .map((relatedProgram) => (
                <Link
                  key={relatedProgram._id || relatedProgram.id}
                  to={`/programs/${relatedProgram._id || relatedProgram.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  {renderRelatedProgramImage(relatedProgram)}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {relatedProgram.department}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedProgram.year}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                      {relatedProgram.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedProgram.description
                        .replace(/<[^>]*>/g, "")
                        .substring(0, 100)}
                      ...
                    </p>
                    <div className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetail;
