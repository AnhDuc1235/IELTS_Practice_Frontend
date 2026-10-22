"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface NotificationState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const DEFAULT_TOAST_DURATION = 8000;
const MAX_VISIBLE_TOASTS = 2;

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],

  addToast: (message: string, type: ToastType, duration = DEFAULT_TOAST_DURATION) => {
    const id = Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts.slice(-(MAX_VISIBLE_TOASTS - 1)), { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
