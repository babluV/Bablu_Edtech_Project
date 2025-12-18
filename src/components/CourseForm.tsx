"use client";

import { Course } from "@/types/course";
import { useState, FormEvent } from "react";

interface CourseFormProps {
  course?: Course | null;
  onSubmit: (course: Omit<Course, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export default function CourseForm({
  course,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    instructor: course?.instructor || "",
    duration: course?.duration || "",
    price: course?.price || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        description: "",
        instructor: "",
        duration: "",
        price: 0,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-gray-200 dark:border-gray-700"
    >
      <div className="border-b-2 border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-blue-600 dark:border-blue-400 pl-3">
          {course ? "Edit Course" : "Create New Course"}
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Enter course title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Enter course description"
          />
        </div>

        <div>
          <label
            htmlFor="instructor"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Instructor *
          </label>
          <input
            type="text"
            id="instructor"
            required
            value={formData.instructor}
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
            className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Enter instructor name"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Duration *
            </label>
            <input
              type="text"
              id="duration"
              required
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="e.g., 8 weeks"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="w-full px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6 flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-blue-600 hover:border-blue-700 disabled:border-gray-400"
        >
          {isSubmitting
            ? "Saving..."
            : course
            ? "Update Course"
            : "Create Course"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

