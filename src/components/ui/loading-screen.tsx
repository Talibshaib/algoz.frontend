"use client";

/**
 * Loading screen to display while checking authentication
 * or performing route transitions
 */
export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="mt-4 text-gray-600">Loading...</span>
      </div>
    </div>
  );
} 