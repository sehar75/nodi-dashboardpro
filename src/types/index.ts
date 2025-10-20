export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  joinedDate: string;
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
