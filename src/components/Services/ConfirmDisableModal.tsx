import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  targetState?: "inactive" | "active";
}

const ConfirmDisableModal: React.FC<Props> = ({ open, onClose, onConfirm, serviceName, targetState = "inactive" }) => {
  if (!open) return null;

  const title = targetState === "inactive" ? "Deactivate Service" : "Activate Service";
  const message =
    targetState === "inactive"
      ? `Are you sure you want to make "${serviceName}" inactive? This will hide it from customers.`
      : `Are you sure you want to make "${serviceName}" active?`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md ring-1 ring-purple-50">
        <header className="flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
          <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg">
            <FaExclamationTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm opacity-90 mt-0.5">Manage visibility for this service</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-white/90 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="px-6 py-5">
          <p className="text-gray-700 mb-4">{message}</p>

          <div className="rounded-md bg-purple-50 border border-purple-100 p-3 mb-4">
            <p className="text-sm text-purple-700">
              {targetState === "inactive"
                ? "Deactivated services will not appear in customer searches but will remain in your dashboard."
                : "Activated services will be visible to customers again."}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => { onConfirm(); }}
              className={`px-4 py-2 rounded-lg text-white transition-colors shadow-sm ${
                targetState === "inactive"
                  ? "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  : "bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              }`}
            >
              {targetState === "inactive" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDisableModal;
