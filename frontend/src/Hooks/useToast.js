// // Hooks/useToast.js
// import { useDispatch, useSelector } from "react-redux";
// import { addToast, removeToast } from "../store/slices/toastSlice";

// export const useToast = () => {
//   const dispatch = useDispatch();
//   const toasts = useSelector((state) => state.toast.toasts);

//   const showToast = (message, type = "info", duration = 5000) => {
//     dispatch(addToast({ message, type, duration }));
//   };

//   const success = (message, duration = 5000) => {
//     showToast(message, "success", duration);
//   };

//   const error = (message, duration = 5000) => {
//     showToast(message, "error", duration);
//   };

//   const warning = (message, duration = 5000) => {
//     showToast(message, "warning", duration);
//   };

//   const info = (message, duration = 5000) => {
//     showToast(message, "info", duration);
//   };

//   const hideToast = (id) => {
//     dispatch(removeToast(id));
//   };

//   return {
//     toasts,
//     success,
//     error,
//     warning,
//     info,
//     showToast,
//     removeToast: hideToast,
//   };
// };
