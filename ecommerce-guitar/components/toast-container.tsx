"use client";

import { useNotificationStore } from "@/stores/notification-store";
import { X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useNotificationStore();

  const getColors = (type: string) => {
    const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
      success: { bg: "bg-green-50", text: "text-green-800", icon: "text-green-600" },
      error: { bg: "bg-red-50", text: "text-red-800", icon: "text-red-600" },
      info: { bg: "bg-blue-50", text: "text-blue-800", icon: "text-blue-600" },
      warning: { bg: "bg-yellow-50", text: "text-yellow-800", icon: "text-yellow-600" },
    };
    return colorMap[type] || colorMap.info;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => {
        const colors = getColors(toast.type);
        return (
          <div
            key={toast.id}
            className={`${colors.bg} ${colors.text} px-4 py-3 rounded-md shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300`}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
