"use client";

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Toaster } from "@/components/ui/sonner";

/**
 * The root layout for the application.
 * It includes the `ErrorReporter`, `Toaster`, and `VisualEditsMessenger` components.
 * @param {Readonly<{ children: React.ReactNode }>} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to display in the layout.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <ErrorReporter />
        {children}
        <Toaster />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}