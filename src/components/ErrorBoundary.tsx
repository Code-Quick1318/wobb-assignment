import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level error boundary.
 * Catches uncaught render errors and shows a readable crash screen
 * instead of a blank page. Keeps main.tsx minimal.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed:", error, info);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div
          role="alert"
          style={{ padding: 32, fontFamily: "monospace", color: "red" }}
        >
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#666" }}>
            {error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
