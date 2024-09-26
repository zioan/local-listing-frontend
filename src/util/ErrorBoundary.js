import React from "react";
import { Navigate } from "react-router-dom";
import { HttpError } from "../context/ErrorContext";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.state.error instanceof HttpError) {
        return <Navigate to={this.state.error.getRedirectPath()} state={{ error: this.state.error }} />;
      }
      return <Navigate to="/error" state={{ error: this.state.error }} />;
    }
    return this.props.children;
  }
}
