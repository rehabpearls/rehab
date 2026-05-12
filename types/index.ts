export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
  category: string;
}

export interface UserProgress {
  userId: string;
  questionId: string;
  correct: boolean;
}

