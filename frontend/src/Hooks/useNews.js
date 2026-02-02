// // Hooks/useNews.js
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchNewsStart,
//   addNewsStart,
//   deleteNewsStart,
//   updateNewsStart,
// } from "../store/slices/newsSlice";

// export const useNews = () => {
//   const dispatch = useDispatch();
//   const { items: news, loading, error } = useSelector((state) => state.news);

//   return {
//     news,
//     loading,
//     error,
//     fetchNews: () => dispatch(fetchNewsStart()),
//     addNews: (newsItem) => dispatch(addNewsStart(newsItem)),
//     deleteNews: (id) => dispatch(deleteNewsStart(id)),
//     updateNews: (id, updatedNews) =>
//       dispatch(updateNewsStart({ id, ...updatedNews })),
//   };
// };
