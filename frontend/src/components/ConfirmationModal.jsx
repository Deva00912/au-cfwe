import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // 'warning', 'danger', 'info'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    const iconProps = { className: "w-6 h-6" };
    switch (type) {
      case "danger":
        return <AlertTriangle {...iconProps} className="text-red-600" />;
      case "warning":
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
      case "info":
        return <AlertTriangle {...iconProps} className="text-blue-600" />;
      default:
        return <AlertTriangle {...iconProps} className="text-yellow-600" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-500";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";
      default:
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            <Button
              text={<X className="w-5 h-5" />}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
            />
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-gray-600">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <Button
              text={cancelText}
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            />
            <Button
              text={confirmText}
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getButtonStyles()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
