import React from "react";
import { Navigate } from "react-router-dom";
import { HttpError } from "../context/ErrorContext";

/**
 * ErrorBoundary component to catch errors in the React component tree.
 * Redirects users based on the type of error encountered.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Updates state when an error occurs
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    // If an error has occurred, determine how to respond
    if (this.state.hasError) {
      // Check if the error is an instance of HttpError
      if (this.state.error instanceof HttpError) {
        return <Navigate to={this.state.error.getRedirectPath()} state={{ error: this.state.error }} />;
      }
      // Redirect to a generic error page for other types of errors
      return <Navigate to="/error" state={{ error: this.state.error }} />;
    }

    // Render child components if no errors have occurred
    return this.props.children;
  }
}
