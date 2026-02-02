import { ArrowLeft, Calendar, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { newsAPI } from "../services/api";
import { GetImageUrl } from "../Utils/Utils";

const NewsDetail = () => {
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      setError("Invalid news ID");
      setLoading(false);
      return;
    }

    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the specific post
        const postResponse = await newsAPI.getById(id);
        const postData = postResponse.data.data || postResponse.data;

        if (!postData) {
          setError("News not found");
          setLoading(false);
          return;
        }

        setPost(postData);

        // Fetch related posts
        const allResponse = await newsAPI.getAll(1, 10);
        const allPosts = allResponse.data.data || allResponse.data || [];
        // Exclude current post and get first 3
        const related = allPosts.filter((p) => p._id !== id).slice(0, 3);
        setRelatedPosts(related);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.replace(/<[^>]*>/g, "").substring(0, 100),
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const renderNewsImage = (
    postItem,
    className = "w-full h-full object-cover"
  ) => {
    if (postItem?.image) {
      const imgSrc = GetImageUrl(postItem.image);
      return <img src={imgSrc} alt={postItem.title} className={className} />;
    }
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
      >
        <div className="text-gray-400 text-6xl">📰</div>
      </div>
    );
  };

  const renderRelatedNewsImage = (relatedPost) => {
    if (relatedPost?.image) {
      const imgSrc = GetImageUrl(relatedPost.image);
      return (
        <img
          src={imgSrc}
          alt={relatedPost.title}
          className="w-full h-40 object-cover"
        />
      );
    }
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-4xl">📰</div>
      </div>
    );
  };

  const isNotification = (postItem) => {
    return postItem?.category === "notification";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error || "News not found"}</p>
          <Link
            to="/news"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <Link
              to="/news"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
            {renderNewsImage(post)}
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Badge and Date */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isNotification(post)
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {isNotification(post) ? "Important Notification" : "News"}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.publishedAt ? formatDate(post.publishedAt) : ""}
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Content Body */}
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  University News
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  Announcement
                </span>
                {isNotification(post) && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    Important
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  to={`/news/${relatedPost._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                >
                  {renderRelatedNewsImage(relatedPost)}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          isNotification(relatedPost)
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isNotification(relatedPost) ? "Notification" : "News"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedPost.publishedAt
                          ? formatDate(relatedPost.publishedAt)
                          : ""}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.content
                        ? relatedPost.content
                            .replace(/<[^>]*>/g, "")
                            .substring(0, 100)
                        : ""}
                      ...
                    </p>
                    <div className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Read More →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
