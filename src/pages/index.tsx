import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  term: string;
  theory: string;
  options: string[];
}

const theories: Record<string, string[]> = {
  "Cognitive Behavioral Therapy (CBT)": ["cognitive distortions", "schemas", "Aaron Beck"],
  "Attachment Theory": ["secure base", "John Bowlby", "Strange Situation"],
  "Family Systems Theory": ["triangulation", "Murray Bowen", "genograms"],
  "Psychoanalytic Theory": ["Oedipus complex", "Freud", "defense mechanisms"],
};

const allTerms = Object.entries(theories).flatMap(([theory, terms]) =>
  terms.map((term) => ({ term, theory }))
);

const getRandomQuestion = (): Question => {
  const item = allTerms[Math.floor(Math.random() * allTerms.length)];
  const shuffled = Object.keys(theories).sort(() => 0.5 - Math.random()).slice(0, 3);
  if (!shuffled.includes(item.theory)) shuffled[Math.floor(Math.random() * 3)] = item.theory;
  return { ...item, options: shuffled.sort(() => 0.5 - Math.random()) };
};

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    setQuestion(getRandomQuestion());
  }, []);

  const checkAnswer = async (choice: string) => {
    if (!question) return;
    setSelected(choice);
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        term: question.term,
        selectedTheory: choice,
        correctTheory: question.theory,
      }),
    });
    const data = await res.json();
    setFeedback(data.feedback);
  };

  if (!question) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Which theory is associated with:</h2>
          <div className="text-2xl font-bold mb-6">"{question.term}"</div>
          <div className="space-y-2">
            {question.options.map((opt) => (
              <Button
                key={opt}
                onClick={() => checkAnswer(opt)}
                disabled={!!selected}
                variant={selected === opt ? "default" : "outline"}
              >
                {opt}
              </Button>
            ))}
          </div>
          {feedback && <p className="mt-6 text-base bg-gray-100 p-4 rounded-xl">{feedback}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
