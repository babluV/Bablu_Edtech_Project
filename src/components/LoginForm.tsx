"use client";

import { useState } from "react";

interface LoginFormProps {
  onLogin: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    

    try {
      console.log("Attempting login for:", email);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Login response status:", response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Server returned an invalid response. Please try again.");
        setLoading(false);
        return;
      }

      console.log("Login response data:", data);

      if (response.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        console.log("Login successful, calling onLogin callback");
        console.log("Token:", data.token.substring(0, 20) + "...");
        console.log("User:", data.user);
        try {
          onLogin(data.token, data.user);
          console.log("onLogin callback completed");
        } catch (callbackError) {
          console.error("Error in onLogin callback:", callbackError);
          setError("Login successful but failed to update UI. Please refresh the page.");
        }
      } else {
        // Provide more helpful error messages
        const errorMsg = data.error || "Login failed";
        if (response.status === 401) {
          setError("Invalid email or password. Please check your credentials or register a new account.");
        } else if (response.status === 500) {
          setError(errorMsg || "Server error. Please try again later.");
        } else {
          setError(errorMsg);
        }
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Login
      </h2>
      <p className="text-gray-600 text-center mb-6 text-sm">
        Enter your credentials to access your account
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 transition-all"
            placeholder="Enter your password"
          />
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
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

