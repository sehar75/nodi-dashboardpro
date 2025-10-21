import axios from "axios";
import { User, Question } from "@/types";

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5003/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Utility to extract array from various response structures
const extractArray = <T>(data: any, keys: string[] = ['data', 'users', 'questions']): T[] => {
  if (Array.isArray(data)) return data;
  if (data?.success && Array.isArray(data.data)) return data.data;
  for (const key of keys) {
    if (data?.[key] && Array.isArray(data[key])) return data[key];
  }
  return [];
};

// Utility to extract single item from response
const extractItem = <T>(data: any): T => {
  if (data?.success && data.data) return data.data;
  if (data && typeof data === 'object' && 'id' in data) return data as T;
  return data;
};

export const backendUsersApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await backendApi.get("/admin/users");
    return extractArray<User>(response.data);
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await backendApi.get(`/admin/users/${id}`);
    return extractItem<User>(response.data);
  },

  createUser: async (user: Omit<User, "id">): Promise<User> => {
    const response = await backendApi.post("/admin/users", user);
    return extractItem<User>(response.data);
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await backendApi.put(`/admin/users/${id}`, user);
    return extractItem<User>(response.data);
  },

  deleteUser: async (id: string): Promise<void> => {
    await backendApi.delete(`/admin/users/${id}`);
  },

  deleteUsers: async (ids: string[]): Promise<void> => {
    await backendApi.delete("/admin/users/batch", { data: { ids } });
  },

  toggleUserStatus: async (id: string, isActive: boolean): Promise<any> => {
    const response = await backendApi.put(`/admin/users/${id}/activate`, { isActive });
    return response.data;
  },
};

export const backendQuestionsApi = {
  getAllQuestions: async (): Promise<Question[]> => {
    const response = await backendApi.get("/admin/questions");
    return extractArray<Question>(response.data);
  },

  getQuestionById: async (id: string): Promise<Question> => {
    const response = await backendApi.get(`/admin/questions/${id}`);
    return extractItem<Question>(response.data);
  },

  createQuestion: async (question: {
    question_text: string;
    question_description: string;
    question_placeholder: string;
  }): Promise<Question> => {
    const response = await backendApi.post("/admin/questions", question);
    return extractItem<Question>(response.data);
  },

  updateQuestion: async (id: string, question: Partial<Question>): Promise<Question> => {
    const { id: _, createdAt, updatedAt, ...allowedFields } = question;
    const response = await backendApi.put(`/admin/questions/${id}`, allowedFields);
    return extractItem<Question>(response.data);
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await backendApi.delete(`/admin/questions/${id}`);
  },
};

export const backendAuthApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await backendApi.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await backendApi.post("/auth/register", userData);
    return response.data;
  },

  logout: async () => {
    await backendApi.post("/auth/logout");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const response = await backendApi.get("/auth/me");
    return response.data;
  },

  refreshToken: async () => {
    const response = await backendApi.post("/auth/refresh");
    return response.data;
  },
};

export default backendApi;
