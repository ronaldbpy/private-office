"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: "bg-green-500/20 text-green-600 border-green-500/30",
    error: "bg-red-500/20 text-red-600 border-red-500/30",
    info: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 rounded border px-4 py-3 text-sm ${bgColor} z-50`}
    >
      {message}
    </div>
  );
}
