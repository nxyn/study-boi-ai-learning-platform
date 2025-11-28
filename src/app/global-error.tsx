"use client";

import ErrorReporter from "@/components/ErrorReporter";

/**
 * This is the global error boundary for the application.
 * It uses the `ErrorReporter` component to display a user-friendly error message
 * and report the error to the parent window.
 */
export default ErrorReporter;
