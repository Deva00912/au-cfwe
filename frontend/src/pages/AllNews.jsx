import { Calendar, Filter, Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { RightGreaterAngle } from "../assets/Assets";
import RenderImage from "../components/RenderImage";
import { FormatDate, FormatExcerpt, GetImageUrl } from "../Utils/Utils";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { newsAPI } from "../services/api";

const AllNews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsAPI.getAll(1, 100);

      // Handle different response structures
      let newsData = [];
      if (Array.isArray(response.data?.data)) {
        newsData = response.data.data;
      } else if (Array.isArray(response.data?.news)) {
        newsData = response.data.news;
      } else if (Array.isArray(response.data)) {
        newsData = response.data;
      }

      // Map posts with proper type
      const posts = newsData.map((item) => ({
        ...item,
        id: item._id || item.id || Date.now().toString(),
        title: item.title || "Untitled Post",
        content: item.content || item.description || "",
        date: item.date || item.createdAt || new Date().toISOString(),
        image: item.image || item.featuredImage || null,
        type: item.isNotification ? "notification" : "news",
      }));

      setAllPosts(posts);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Please try again later.");
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const FilterOptions = [
    { value: "all", label: "All Posts" },
    { value: "news", label: "News Only" },
    { value: "notifications", label: "Notifications Only" },
  ];

  // Use useMemo for filtered posts calculation
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(allPosts)) return [];

    return allPosts
      .filter((post) => {
        // Search filter
        const searchMatch =
          !searchTerm ||
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const typeMatch =
          filter === "all" ||
          (filter === "news" && post.type === "news") ||
          (filter === "notifications" && post.type === "notification");

        return searchMatch && typeMatch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
  }, [allPosts, searchTerm, filter]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-lg mb-4 max-w-2xl mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg max-w-3xl mx-auto"></div>
          </div>

          {/* Search & Filter Skeleton */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-full sm:w-48 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Results Count Skeleton */}
          <div className="mb-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-48"></div>
          </div>

          {/* News Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && allPosts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Centre for Empowerment of Women News & Announcements
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error}
            </h3>
            <p className="text-gray-500 mb-6">
              We couldn't load the news at this time.
            </p>
            <Button
              onClick={fetchNews}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              text="Try Again"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Centre for Empowerment of Women News & Announcements
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed about the latest developments, events, and important
            updates from Centre for Empowerment of Women.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <InputBox
                type="text"
                placeholder="Search news and announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2 justify-center">
              <Filter className="w-5 h-5 text-gray-400 mt-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-colors"
              >
                {FilterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {allPosts.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredPosts.length}</span> of{" "}
              <span className="font-semibold">{allPosts.length}</span> posts
              {searchTerm && (
                <span>
                  {" "}
                  for <span className="font-semibold">"{searchTerm}"</span>
                </span>
              )}
              {filter !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-semibold">
                    {filter === "news" ? "News" : "Notifications"}
                  </span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* News Grid */}
        {allPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No News Available
            </h3>
            <p className="text-gray-500">
              No news posts have been added yet. Please check back later.
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No posts found
            </h3>
            <p className="text-gray-500 mb-4">
              No posts match your search{searchTerm && ` for "${searchTerm}"`}
              {filter !== "all" &&
                ` in ${filter === "news" ? "News" : "Notifications"}`}
              .
            </p>
            {(searchTerm || filter !== "all") && (
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                text="Clear filters"
              />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/news/${post._id || post.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
              >
                {post.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <RenderImage
                      src={GetImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div
                      className={`text-4xl ${post.type === "notification" ? "text-red-300" : "text-blue-300"}`}
                    >
                      {post.type === "notification" ? "📢" : "📰"}
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3 min-h-[32px]">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded ${
                        post.type === "notification"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {post.type === "notification" ? "Notification" : "News"}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      {FormatDate(post.date)}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 flex-1 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {FormatExcerpt(post.content)}
                  </p>

                  <div className="inline-flex items-center text-blue-600 group-hover:text-blue-800 font-medium text-sm transition-colors mt-auto">
                    Read Full Story
                    <RightGreaterAngle className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNews;
