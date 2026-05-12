export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

// Повністю типізована база даних для Supabase
export interface Database {
  public: {
    Tables: {
      questions: {
        Row: {
          id: number;
          question_text: string;
          category: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
        };
        Insert: {
          question_text: string;
          category: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_answer: string;
        };
        Update: {
          question_text?: string;
          category?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_answer?: string;
        };
      };
      results: {
        Row: {
          id: number;
          user_id: string;
          exam_id: string;
          score: number;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          exam_id: string;
          score: number;
          completed_at: string;
        };
        Update: {
          user_id?: string;
          exam_id?: string;
          score?: number;
          completed_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
  };
}

