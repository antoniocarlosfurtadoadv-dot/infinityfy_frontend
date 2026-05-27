"use client";

import type { ReactNode } from "react";
import { Component } from "react";
import { TriangleAlertIcon } from "lucide-react";

interface IErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface IErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): IErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="relative flex flex-col items-center">
              <div className="flex flex-col items-center gap-6 text-center mt-5">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl ">
                  <TriangleAlertIcon className="h-9 w-9 text-feedback-error-main animate-ping" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <h1 className="text-2xl font-semibold text-neutral-900">
                    Algo deu errado
                  </h1>
                  <p className="text-neutral-700 text-base leading-6">
                    Ocorreu um erro inesperado, tente novamente
                  </p>
                </div>
              </div>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="rounded-lg bg-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-700">
                  Detalhes:
                </p>
                <pre className="mt-2 overflow-auto text-xs text-red-600">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div>
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="w-full rounded-full bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 mb-3 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={this.reset}
                className="w-full rounded-full bg-primary-main px-5 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
