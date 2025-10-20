import axios from "axios";
import { User, Question } from "@/types";

// Create axios instance with backend configuration
const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5003/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth tokens
backendApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Backend API Error:", error);
    return Promise.reject(error);
  }
);

// Backend Users API endpoints
export const backendUsersApi = {
  // Get all users from backend
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await backendApi.get("/admin/users");
      console.log("Backend API Response:", response.data);

      // Handle different response structures
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else if (
        response.data &&
        response.data.users &&
        Array.isArray(response.data.users)
      ) {
        return response.data.users;
      } else {
        console.error("Unexpected API response structure:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching users from backend:", error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await backendApi.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  // Create new user
  createUser: async (user: Omit<User, "id">): Promise<User> => {
    try {
      const response = await backendApi.post("/admin/users", user);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    try {
      const response = await backendApi.put(`/admin/users/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await backendApi.delete(`/admin/users/${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  // Delete multiple users
  deleteUsers: async (ids: string[]): Promise<void> => {
    try {
      await backendApi.delete("/admin/users/batch", { data: { ids } });
    } catch (error) {
      console.error("Error deleting users:", error);
      throw error;
    }
  },

  // Toggle user active status
  toggleUserStatus: async (id: string, isActive: boolean): Promise<User> => {
    try {
      const response = await backendApi.patch(`/admin/users/${id}/status`, {
        isActive,
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },
};

// Backend Questions API endpoints
export const backendQuestionsApi = {
  // Get all questions from backend
  getAllQuestions: async (): Promise<Question[]> => {
    try {
      const response = await backendApi.get("/admin/questions");
      console.log("Backend Questions API Response:", response.data);

      // Handle the specific response structure from your API
      if (
        response.data &&
        response.data.success &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else if (
        response.data &&
        response.data.questions &&
        Array.isArray(response.data.questions)
      ) {
        return response.data.questions;
      } else {
        console.error("Unexpected API response structure:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching questions from backend:", error);
      throw error;
    }
  },

  // Get question by ID
  getQuestionById: async (id: string): Promise<Question> => {
    try {
      const response = await backendApi.get(`/admin/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      throw error;
    }
  },

  // Create new question
  createQuestion: async (question: Omit<Question, "id">): Promise<Question> => {
    try {
      const response = await backendApi.post("/admin/questions", question);
      return response.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  },

  // Update question
  updateQuestion: async (
    id: string,
    question: Partial<Question>
  ): Promise<Question> => {
    try {
      const response = await backendApi.put(`/admin/questions/${id}`, question);
      return response.data;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  // Delete question
  deleteQuestion: async (id: string): Promise<void> => {
    try {
      await backendApi.delete(`/admin/questions/${id}`);
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },
};

// Backend Auth API endpoints
export const backendAuthApi = {
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await backendApi.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      const response = await backendApi.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      await backendApi.post("/auth/logout");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await backendApi.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await backendApi.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
};

export default backendApi;
