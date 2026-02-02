import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { useToast } from "../context/ToastContext";

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-l-4 border-green-500",
          text: "text-green-800",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-l-4 border-red-500",
          text: "text-red-800",
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-l-4 border-yellow-500",
          text: "text-yellow-800",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-l-4 border-blue-500",
          text: "text-blue-800",
          icon: <Info className="w-5 h-5 text-blue-500" />,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const styles = getToastStyles(toast.type);

        return (
          <div
            key={toast.id}
            className={`${styles.bg} ${styles.border} rounded-lg shadow-lg p-4 max-w-sm flex items-start gap-3 animate-slide-in pointer-events-auto`}
          >
            <div className="flex-shrink-0">{styles.icon}</div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${styles.text}`}>
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
