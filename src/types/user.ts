export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "instructor" | "student";
  createdAt: string;
}

export interface UserWithPassword extends User {
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "instructor" | "student";
}

export interface LoginData {
  email: string;
  password: string;
}

