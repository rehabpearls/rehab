"use client";

import { useState } from "react";

export default function AdminAddQuestion() {
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    category: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_answer: "",
  });

  const handleSubmit = async () => {
    await fetch("/api/questions/create", {
      method: "POST",
      body: JSON.stringify(newQuestion),
    });
    
    alert("Question added successfully!");
  };

  return (
    <div>
      <input
        placeholder="Question"
        value={newQuestion.question_text}
        onChange={e =>
          setNewQuestion({ ...newQuestion, question_text: e.target.value })
        }
      />

      <input
        placeholder="Category"
        value={newQuestion.category}
        onChange={e =>
          setNewQuestion({ ...newQuestion, category: e.target.value })
        }
      />

      <input
        placeholder="Option A"
        value={newQuestion.option_a}
        onChange={e =>
          setNewQuestion({ ...newQuestion, option_a: e.target.value })
        }
      />

      <input
        placeholder="Option B"
        value={newQuestion.option_b}
        onChange={e =>
          setNewQuestion({ ...newQuestion, option_b: e.target.value })
        }
      />

      <input
        placeholder="Option C"
        value={newQuestion.option_c}
        onChange={e =>
          setNewQuestion({ ...newQuestion, option_c: e.target.value })
        }
      />

      <input
        placeholder="Option D"
        value={newQuestion.option_d}
        onChange={e =>
          setNewQuestion({ ...newQuestion, option_d: e.target.value })
        }
      />

      <input
        placeholder="Correct Answer"
        value={newQuestion.correct_answer}
        onChange={e =>
          setNewQuestion({ ...newQuestion, correct_answer: e.target.value })
        }
      />

      <button onClick={handleSubmit}>Add Question</button>
    </div>
  );
}

