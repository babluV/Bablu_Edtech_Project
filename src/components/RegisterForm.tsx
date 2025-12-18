"use client";

import { useState } from "react";

interface RegisterFormProps {
  onRegister: (token: string, user: any) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "instructor" | "student">("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Attempting registration for:", email);
      
      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log("Registration response status:", response.status);
      console.log("Registration response headers:", response.headers.get("content-type"));
      
      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response received:", text);
        setError(`Server error: ${text.substring(0, 200)}`);
        setLoading(false);
        return;
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        const text = await response.text().catch(() => "Unknown error");
        setError(`Server returned an invalid response: ${text.substring(0, 200)}`);
        setLoading(false);
        return;
      }

      console.log("Registration response data:", data);

      if (response.ok) {
        // Auto-login after registration
        console.log("Registration successful, attempting auto-login");
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        let loginData;
        try {
          loginData = await loginResponse.json();
        } catch (parseError) {
          console.error("Failed to parse login response:", parseError);
          setError("Registration successful, but login failed. Please login manually.");
          setLoading(false);
          return;
        }

        console.log("Auto-login response:", loginResponse.status, loginData);

        if (loginResponse.ok && loginData.token && loginData.user) {
          localStorage.setItem("token", loginData.token);
          console.log("Auto-login successful, calling onRegister callback");
          console.log("Token:", loginData.token.substring(0, 20) + "...");
          console.log("User:", loginData.user);
          try {
            onRegister(loginData.token, loginData.user);
            console.log("onRegister callback completed");
          } catch (callbackError) {
            console.error("Error in onRegister callback:", callbackError);
            setError("Registration successful but failed to update UI. Please refresh the page.");
          }
        } else {
          setError("Registration successful, but login failed. Please login manually.");
        }
      } else {
        const errorMsg = data.error || "Registration failed";
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      if (err.name === 'AbortError') {
        setError("Request timed out. Please check your database connection and try again.");
      } else {
        setError(err.message || "Network error. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Register
      </h2>
      <p className="text-gray-600 text-center mb-6 text-sm">
        Create a new account to get started
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
            placeholder="Enter your password"
          />
          <p className="mt-2 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "instructor" | "student")}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 transition-all"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

