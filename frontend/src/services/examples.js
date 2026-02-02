// Example Usage in React Components

// ============================================
// Example 1: Using API in a Custom Hook
// ============================================
import { useState, useEffect } from "react";
import { newsAPI } from "../services/api";

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await newsAPI.getAll(page, limit);
      setNews(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData) => {
    try {
      const response = await newsAPI.create(newsData);
      setNews([response.data.data, ...news]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create news");
      throw err;
    }
  };

  const deleteNews = async (id) => {
    try {
      await newsAPI.delete(id);
      setNews(news.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete news");
      throw err;
    }
  };

  return { news, loading, error, fetchNews, createNews, deleteNews };
};

// ============================================
// Example 2: Using API in a React Component
// ============================================
export const NewsComponent = () => {
  const { news, loading, error, fetchNews } = useNews();

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {news.map((item) => (
        <div key={item._id}>{item.title}</div>
      ))}
    </div>
  );
};

// ============================================
// Example 3: Handling Authentication
// ============================================
import { authAPI } from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      setUser(user);

      return response.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem("token");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return { user, loading, login, logout };
};

// ============================================
// Example 4: File Upload (Gallery/Projects)
// ============================================
export const useGallery = () => {
  const uploadImage = async (file, title, description) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await galleryAPI.create(formData);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return { uploadImage };
};

// ============================================
// Example 5: Error Handling
// ============================================
export const useAPICall = () => {
  const makeRequest = async (apiCall) => {
    try {
      const response = await apiCall();
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || "An error occurred";
        const status = error.response.status;
        console.error(`Error ${status}: ${message}`);
      } else if (error.request) {
        // Request made but no response
        console.error("No response from server");
      } else {
        // Error in request setup
        console.error("Error:", error.message);
      }
      throw error;
    }
  };

  return { makeRequest };
};
