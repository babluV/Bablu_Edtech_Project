"use client";

import { Course } from "@/types/course";
import { useState } from "react";

interface CourseListProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

export default function CourseList({
  courses,
  onEdit,
  onDelete,
}: CourseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    if (!confirm("Are you sure you want to delete this course?")) return;

    setDeletingId(id);
    onDelete(id);
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No courses found.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create your first course to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Header Section with Border */}
          <div className="border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 px-6 py-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h3>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 min-h-[3.75rem]">
              {course.description}
            </p>
            
            {/* Details Section with Border */}
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Instructor:</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="text-sm text-gray-900 dark:text-white font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Price:</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${course.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(course)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-blue-600 hover:border-blue-700"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => handleDelete(course.id)}
                  disabled={deletingId === course.id}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-red-600 hover:border-red-700 disabled:border-gray-400"
                >
                  {deletingId === course.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

