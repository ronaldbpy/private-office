"use client";

import { ReactNode, useEffect, useState } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className="animate-fade-in"
      style={{
        animation: isVisible ? "fadeIn 0.3s ease-in" : "none",
      }}
    >
      {children}
    </div>
  );
}
