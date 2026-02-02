// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchNotificationsStart,
//   addNotificationStart,
//   deleteNotificationStart,
// } from "../store/slices/notificationsSlice";

// export const useNotifications = () => {
//   const dispatch = useDispatch();
//   const {
//     items: notifications,
//     loading,
//     error,
//   } = useSelector((state) => state.notifications);

//   return {
//     notifications,
//     loading,
//     error,
//     fetchNotifications: () => dispatch(fetchNotificationsStart()),
//     addNotification: (notification) =>
//       dispatch(addNotificationStart(notification)),
//     deleteNotification: (id) => dispatch(deleteNotificationStart(id)),
//   };
// };
