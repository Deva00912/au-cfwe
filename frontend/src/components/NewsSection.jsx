import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { RightArrowIcon, RightGreaterAngle } from "../assets/Assets";
import RenderImage from "./RenderImage";
import { FormatExcerpt, GetImageUrl } from "../Utils/Utils";
import { newsAPI } from "../services/api";

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
      const response = await newsAPI.getAll(1, 10);
      const newsData = response.data.data || response.data || [];

      // Separate news and notifications
      const separatedNews = newsData.filter((n) => !n.isNotification);
      const separatedNotifications = newsData.filter((n) => n.isNotification);

      setNews(separatedNews);
      setNotifications(separatedNotifications);

      // Combine for display
      const combined = [
        ...separatedNotifications.map((n) => ({ ...n, isNotification: true })),
        ...separatedNews.map((n) => ({ ...n, isNotification: false })),
      ];
      setAllPosts(combined.slice(0, 5)); // Show latest 5
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news");
      setAllPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback dummy data
  const fallbackNews = [
    {
      id: 1,
      title: "International Women's Day Celebration 2024",
      content:
        "<p>The Centre for Empowerment of Women is proud to announce our annual International Women's Day celebration on March 8, 2024.</p>",
      date: "2024-02-15",
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500",
    },
    {
      id: 2,
      title: "New Entrepreneurship Program Launch",
      content:
        "<p>We are excited to launch our new Women Entrepreneurship Program starting next month.</p>",
      date: "2024-02-10",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
    },
    {
      id: 3,
      title: "Annual Research Symposium",
      content:
        "<p>The Centre will be hosting its 5th Annual Research Symposium on Gender Studies.</p>",
      date: "2024-02-05",
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=500",
    },
  ];

  const fallbackNotifications = [
    {
      id: 4,
      title: "Important: Scholarship Application Deadline",
      content:
        "<p>Reminder: The deadline for submitting applications for the Women Empowerment Scholarship is February 28, 2024.</p>",
      date: "2024-02-12",
      image: null,
      isNotification: true,
    },
    {
      id: 5,
      title: "Office Closure Notice",
      content:
        "<p>The Centre for Empowerment of Women office will be closed on March 1, 2024 for annual maintenance.</p>",
      date: "2024-02-08",
      image: null,
      isNotification: true,
    },
  ];

  const displayPostsList = (
    allPosts.length > 0
      ? allPosts
      : [
          ...fallbackNotifications,
          ...fallbackNews.map((n) => ({ ...n, isNotification: false })),
        ]
  )
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.date) - new Date(a.date);
    })
    .slice(0, 6);

  return (
    <section className="py-12 bg-gray-50">
      {/* Header section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Latest News & Announcements
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Stay updated with the latest news, events, and important announcements
          from Centre for Empowerment of Women.
        </p>

        {/* Card section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayPostsList?.map((item) => (
            <Link
              key={item?._id}
              to={`/news/${item?._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow fade-in block"
            >
              {item?.image ? (
                <RenderImage
                  {...{ src: GetImageUrl(item?.image), title: item?.title }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400 text-4xl">📰</div>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item?.isNotification
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item?.isNotification ? "Important Notification" : "News"}
                  </span>
                  <span className="text-sm text-gray-500">{item?.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {item?.title}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {FormatExcerpt(item?.content)}
                </p>
                <div className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                  Read Full Story
                  <RightGreaterAngle />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No news fallback - This won't show since we have dummy data */}
        {displayPostsList.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No News Yet
            </h3>
            <p className="text-gray-500">
              Check back later for updates and announcements.
            </p>
          </div>
        )}

        {displayPostsList?.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/news"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All News
              <RightArrowIcon />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
