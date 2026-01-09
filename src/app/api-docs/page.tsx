"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error("Failed to load API docs:", err));
  }, []);

  if (!spec) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-gray-600 mb-8">
          Interactive API documentation with Swagger UI. Use the "Authorize" button to
          test authenticated endpoints.
        </p>
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}

