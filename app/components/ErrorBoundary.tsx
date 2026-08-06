"use client";

import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback?.(this.state.error!) || (
          <div className="px-5 py-4">
            <div className="rounded border border-red-500/30 bg-red-500/10 p-4">
              <h2 className="mb-2 font-semibold text-red-600">Algo salió mal</h2>
              <p className="text-sm text-red-600">
                {this.state.error?.message || "Error desconocido"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
              >
                Recargar página
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
