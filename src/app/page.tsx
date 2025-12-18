"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { User } from "@/types/user";
import CourseList from "@/components/CourseList";
import CourseForm from "@/components/CourseForm";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

type AuthView = "login" | "register";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for token - if exists, try to validate in background
    // But show login page immediately to prevent blocking
    const storedToken = localStorage.getItem("token");
    
    // Always show login page immediately, validate token in background
    setAuthLoading(false);
    
    // If token exists, validate it in background (non-blocking)
    if (storedToken && storedToken.trim() !== "") {
      validateToken(storedToken).catch(() => {
        // Silently fail - user can login again
      });
    }
  }, []);

  useEffect(() => {
    // Fetch courses when both token and user are available
    if (token && user) {
      console.log("Token and user available, fetching courses...");
      fetchCourses();
    } else if (!token && !user) {
      setLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const validateToken = async (tokenToValidate: string) => {
    try {
      // Very short timeout to prevent hanging (1 second)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${tokenToValidate}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(tokenToValidate);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("token");
      }
    } catch (error: any) {
      // Silently fail - user can login again
      localStorage.removeItem("token");
      console.warn("Token validation failed:", error.name);
    }
  };

  const handleLogin = (newToken: string, userData: User) => {
    console.log("handleLogin called with:", { newToken: newToken?.substring(0, 20) + "...", userData });
    // Ensure token is stored
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    // Set both token and user together - React will batch these updates
    // This will trigger re-render and the condition check will pass
    setAuthLoading(false);
    setToken(newToken);
    setUser(userData);
    console.log("State updated - token and user set, component should re-render");
  };

  const handleRegister = (newToken: string, userData: User) => {
    console.log("handleRegister called with:", { newToken: newToken?.substring(0, 20) + "...", userData });
    // Ensure token is stored
    if (newToken) {
      localStorage.setItem("token", newToken);
    }
    // Set both token and user together - React will batch these updates
    // This will trigger re-render and the condition check will pass
    setAuthLoading(false);
    setToken(newToken);
    setUser(userData);
    console.log("State updated - token and user set, component should re-render");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCourses([]);
  };

  const getAuthHeaders = (): Record<string, string> => {
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchCourses = async () => {
    if (!token) {
      console.log("No token available, skipping fetchCourses");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Fetching courses with token...");
      setLoading(true);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };
      const response = await fetch("/api/courses", {
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Courses fetched successfully:", data.length, "courses");
        setCourses(Array.isArray(data) ? data : []);
      } else if (response.status === 401) {
        console.error("Unauthorized - logging out");
        handleLogout();
        alert("Session expired. Please login again.");
      } else {
        console.error("Failed to fetch courses:", response.status);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (courseData: Omit<Course, "id" | "createdAt">) => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };
      const response = await fetch("/api/courses", {
        method: "POST",
        headers,
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        await fetchCourses();
        setShowForm(false);
        setEditingCourse(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create course");
      }
    } catch (error) {
      alert("Error creating course");
    }
  };

  const handleUpdate = async (courseData: Omit<Course, "id" | "createdAt">) => {
    if (!editingCourse) return;

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      };
      const response = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        await fetchCourses();
        setShowForm(false);
        setEditingCourse(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update course");
      }
    } catch (error) {
      alert("Error updating course");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const headers: Record<string, string> = {
        ...getAuthHeaders(),
      };
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        await fetchCourses();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete course");
      }
    } catch (error) {
      alert("Error deleting course");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  // Note: Removed blocking loading screen - auth check happens in background

  // Debug: Log current state
  console.log("Render check - token:", token ? "exists" : "null", "user:", user ? user.email : "null");

  // Show authentication forms if not logged in
  if (!token || !user) {
    console.log("Showing login/register form");
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            House of Edtech
          </h1>
          <p className="text-gray-600 text-lg">
            Welcome! Please login or register to continue
          </p>
        </div>
        {authView === "login" ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToRegister={() => setAuthView("register")}
          />
        ) : (
          <RegisterForm
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
      </main>
    );
  }

  // Allow all authenticated users to perform CRUD operations
  const canCreateCourses = true; // All authenticated users can create courses
  const canModifyCourses = true; // All authenticated users can edit courses
  const canDeleteCourses = true; // All authenticated users can delete courses

  console.log("Showing main course page for user:", user.email);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 border-b-2 border-gray-200 dark:border-gray-700 pb-6">
          <div className="flex justify-between items-start">
            <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                House of Edtech
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your courses with ease
              </p>
            </div>
            <div className="text-right bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 shadow-md">
              <div className="mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Logged in as:{" "}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </span>
              </div>
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {!showForm ? (
          <>
            <div className="mb-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white border-l-4 border-blue-600 dark:border-blue-400 pl-3">
                Courses ({courses.length})
              </h2>
              {canCreateCourses && (
                <button
                  onClick={() => {
                    setEditingCourse(null);
                    setShowForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border-2 border-blue-600 hover:border-blue-700"
                >
                  + Create New Course
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
              </div>
            ) : (
              <CourseList
                courses={courses}
                onEdit={canModifyCourses ? handleEdit : undefined}
                onDelete={canDeleteCourses ? handleDelete : undefined}
              />
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <CourseForm
              course={editingCourse}
              onSubmit={editingCourse ? handleUpdate : handleCreate}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </main>
  );
}

