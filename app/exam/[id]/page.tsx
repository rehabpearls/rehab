"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"

type ExamQuestion = {
  id: string
  question_text?: string
  question?: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  correct_answer?: string
  answer?: string
  status?: string
  category?: string
}

export default function ExamPage() {
  const router = useRouter()
  const params = useParams()
  const examId = params["id"] as string

  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState("")
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    setLoading(true)

    let query = supabase
      .from("questions")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (examId && examId !== "all") {
      query = query.eq("category", examId)
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      setQuestions([])
    } else {
      setQuestions((data || []) as ExamQuestion[])
    }

    setLoading(false)
  }

  const currentQuestion = questions[currentIndex]

  const getOptions = (q: ExamQuestion) => {
    return [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean) as string[]
  }

  const handleAnswer = () => {
    if (!currentQuestion) return

    const isCorrect =
      selected === currentQuestion.correct_answer || selected === currentQuestion.answer

    const nextScore = isCorrect ? score + 1 : score

    if (currentIndex + 1 < questions.length) {
      setScore(nextScore)
      setCurrentIndex(currentIndex + 1)
      setSelected("")
    } else {
      alert(`Exam finished! Score: ${nextScore}/${questions.length}`)
      router.push("/dashboard")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!questions.length) {
    return (
      <div className="p-8 max-w-xl mx-auto">
        <h1 className="text-xl font-bold">No approved questions found</h1>
        <button onClick={() => router.push("/dashboard")} className="mt-4 border px-4 py-2 rounded">
          Back to dashboard
        </button>
      </div>
    )
  }
if (!currentQuestion) {
  return <div className="p-8">Question not found</div>
}
  const options = getOptions(currentQuestion)

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <div className="text-sm opacity-70">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <h2 className="text-xl font-bold">
        {currentQuestion.question_text || currentQuestion.question}
      </h2>

      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full p-3 border rounded text-left ${
              selected === opt ? "bg-blue-500 text-white" : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <button
        onClick={handleAnswer}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!selected}
      >
        Next
      </button>
    </div>
  )
}