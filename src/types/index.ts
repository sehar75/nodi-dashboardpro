export interface User {
  id: string;
  email: string;
  display_name: string;
  firstName: string | null;
  lastName: string | null;
  profileImage: string | null;
  active: boolean;
  role: string;
  isOnboardingAnswered: boolean;
  isOnboarded: boolean;
  career: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  createdAt: string;
  updatedAt: string;
  step_order: number;
  question_text: string;
  question_description: string;
  question_placeholder: string;
}
