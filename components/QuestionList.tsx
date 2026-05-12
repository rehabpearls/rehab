"use client";

import { useEffect, useState } from "react";

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export default function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  return (
    <ul>
      {questions.map(q => (
        <li key={q.id}>{q.question_text}</li>
      ))}
    </ul>
  );
}

