const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000";

export const FormatExcerpt = (html, maxLength = 150) => {
  const text = html.replace(/<[^>]*>/g, "");
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const FormatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const GetImageUrl = (image) => {
  if (!image) return null;

  // If image is a string, check if it's a relative path
  if (typeof image === "string") {
    return image.startsWith("http") ? image : `${API_URL}${image}`;
  }

  // If image is an object with url property
  if (image.url) {
    return image.url.startsWith("http") ? image.url : `${API_URL}${image.url}`;
  }

  return null;
};
