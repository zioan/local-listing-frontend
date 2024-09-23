import React from "react";
import { toast } from "react-toastify";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    toast.error("An unexpected error occurred. Please try again later.");
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page or try again later.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
