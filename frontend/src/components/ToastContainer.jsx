// components/ToastContainer.jsx
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
// import { useToast } from "../Hooks/useToast";
import { useEffect, useState } from "react";

const ToastContainer = () => {
  // const { toasts, removeToast } = useToast();
  const [visibleToasts, setVisibleToasts] = useState(new Set());

  // Sync visible toasts with actual toasts
  useEffect(() => {
    const newVisibleToasts = new Set(visibleToasts);

    // Add new toasts with entry animation
    toasts.forEach((toast) => {
      if (!visibleToasts.has(toast.id)) {
        newVisibleToasts.add(toast.id);
      }
    });

    // Remove toasts that are no longer in the list
    visibleToasts.forEach((toastId) => {
      if (!toasts.find((t) => t.id === toastId)) {
        newVisibleToasts.delete(toastId);
      }
    });

    setVisibleToasts(newVisibleToasts);
  }, [toasts]);

  const handleRemoveToast = (toastId) => {
    // Start exit animation
    setVisibleToasts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(toastId);
      return newSet;
    });

    // Remove from store after animation completes
    setTimeout(() => {
      removeToast(toastId);
    }, 300);
  };

  const getToastStyles = (toast) => {
    const baseStyles =
      "w-80 bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 transform transition-all duration-300 ease-in-out";

    const typeStyles = {
      success: "border-l-4 border-green-500",
      error: "border-l-4 border-red-500",
      warning: "border-l-4 border-yellow-500",
      info: "border-l-4 border-blue-500",
    };

    const isVisible = visibleToasts.has(toast.id);
    const animationClass = isVisible ? "toast-enter" : "toast-exit";

    return `${baseStyles} ${
      typeStyles[toast.type] || typeStyles.info
    } ${animationClass}`;
  };

  const getIcon = (type) => {
    const iconProps = { className: "w-5 h-5" };

    switch (type) {
      case "success":
        return (
          <CheckCircle
            {...iconProps}
            className={`${iconProps.className} text-green-500`}
          />
        );
      case "error":
        return (
          <XCircle
            {...iconProps}
            className={`${iconProps.className} text-red-500`}
          />
        );
      case "warning":
        return (
          <AlertCircle
            {...iconProps}
            className={`${iconProps.className} text-yellow-500`}
          />
        );
      case "info":
        return (
          <Info
            {...iconProps}
            className={`${iconProps.className} text-blue-500`}
          />
        );
      default:
        return (
          <Info
            {...iconProps}
            className={`${iconProps.className} text-blue-500`}
          />
        );
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <div key={toast.id} className={getToastStyles(toast)}>
          <div className="flex-1 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">{getIcon(toast.type)}</div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {toast.message}
                </p>
                {toast.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemoveToast(toast.id)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
