// hoc/withErrorBoundary.tsx

import React, { Component, type ComponentType, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
}

/**
 * HOC que envuelve componentes con un Error Boundary
 * Demuestra: HOC pattern, Error Boundaries, Class Components
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  return class ErrorBoundary extends Component<P & ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: P & ErrorBoundaryProps) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: null,
      };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
      console.error('Error caught by boundary:', error, errorInfo);
      this.setState({
        error,
        errorInfo,
      });

      // Aquí podrías enviar el error a un servicio de logging (Sentry, LogRocket, etc.)
      this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error: Error, errorInfo: React.ErrorInfo): void => {
      // Simular envío a servicio de logging
      console.log('Logging to error service:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    };

    handleReset = (): void => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    };

    render(): ReactNode {
      if (this.state.hasError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-red-900 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-full">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ¡Oops! Algo salió mal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ocurrió un error inesperado en la aplicación
                  </p>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
                <h2 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">
                  Detalles del error:
                </h2>
                <p className="text-sm text-red-700 dark:text-red-300 font-mono break-words">
                  {this.state.error?.message}
                </p>
              </div>

              {this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                    Stack Trace (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-slate-900 p-4 rounded overflow-x-auto">
                    {this.state.error?.stack}
                  </pre>
                  <pre className="mt-2 text-xs bg-gray-100 dark:bg-slate-900 p-4 rounded overflow-x-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              <div className="flex gap-4">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Intentar de nuevo
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}