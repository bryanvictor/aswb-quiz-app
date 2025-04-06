import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Question {
  term: string;
  theory: string;
  options: string[];
}

const theories: Record<string, string[]> = {
  "Cognitive Behavioral Therapy (CBT)": [
    "cognitive distortions", "schemas", "automatic thoughts", "Aaron Beck", "thought records",
    "behavioral activation", "Socratic questioning", "core beliefs", "cognitive restructuring"
  ],
  "Attachment Theory": [
    "secure base", "John Bowlby", "Mary Ainsworth", "Strange Situation", "attachment styles",
    "secure attachment", "anxious attachment", "avoidant attachment", "disorganized attachment"
  ],
  "Family Systems Theory": [
    "triangulation", "Murray Bowen", "genograms", "differentiation of self", "emotional cutoff",
    "multigenerational transmission", "family projection process", "sibling position"
  ],
  "Psychoanalytic Theory": [
    "Oedipus complex", "Freud", "defense mechanisms", "id, ego, superego", "free association",
    "transference", "dream analysis", "unconscious mind"
  ],
  "Behaviorism": [
    "classical conditioning", "operant conditioning", "reinforcement", "punishment", "B.F. Skinner",
    "John Watson", "stimulus-response", "extinction", "shaping"
  ],
  "Humanistic Therapy": [
    "Carl Rogers", "unconditional positive regard", "empathy", "congruence", "self-actualization",
    "person-centered therapy", "authenticity"
  ],
  "Existential Therapy": [
    "Viktor Frankl", "meaning-making", "freedom", "responsibility", "death anxiety",
    "authentic existence", "existential vacuum"
  ],
  "Gestalt Therapy": [
    "Fritz Perls", "here and now", "empty chair technique", "unfinished business",
    "experiential exercises", "awareness continuum"
  ],
  "Narrative Therapy": [
    "externalizing the problem", "re-authoring", "Michael White", "David Epston",
    "storytelling", "dominant narratives"
  ],
  "Solution-Focused Brief Therapy (SFBT)": [
    "scaling questions", "miracle question", "exceptions", "brief interventions",
    "Steve de Shazer", "Insoo Kim Berg"
  ],
  "Dialectical Behavior Therapy (DBT)": [
    "emotion regulation", "distress tolerance", "mindfulness", "interpersonal effectiveness",
    "Marsha Linehan", "validation"
  ],
  "Motivational Interviewing": [
    "stages of change", "ambivalence", "rolling with resistance", "change talk",
    "OARS technique", "expressing empathy"
  ],
  "Rational Emotive Behavior Therapy (REBT)": [
    "ABC model", "irrational beliefs", "Albert Ellis", "disputing techniques", "cognitive restructuring"
  ],
  "Ecological Systems Theory": [
    "microsystem", "mesosystem", "exosystem", "macrosystem", "chronosystem", "Bronfenbrenner"
  ],
  "Task-Centered Practice": [
    "problem-solving", "short-term goals", "client collaboration", "time-limited interventions"
  ],
  "Crisis Intervention Model": [
    "immediate support", "brief intervention", "safety planning", "stabilization",
    "assessment of lethality"
  ],
  "Trauma-Informed Care": [
    "safety", "trustworthiness", "peer support", "empowerment", "cultural sensitivity",
    "trauma awareness"
  ],
  "Strengths-Based Perspective": [
    "resilience", "empowerment", "client assets", "resourcefulness", "hope-oriented practice"
  ],
  "Cognitive Processing Therapy (CPT)": [
    "stuck points", "challenging beliefs", "trauma narratives", "cognitive restructuring",
    "PTSD treatment"
  ],
  "Structural Family Therapy": [
    "family hierarchy", "subsystems", "boundaries", "enmeshment", "Salvador Minuchin"
  ]
};

const allTerms: { term: string; theory: string }[] = Object.entries(theories).flatMap(
  ([theory, terms]) => terms.map((term) => ({ term, theory }))
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
    try {
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
    } catch (error) {
      console.error("Client fetch error:", error);
      setFeedback("Something went wrong — please try again.");
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setFeedback("");
    setQuestion(getRandomQuestion());
  };

  if (!question) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            Which theory or therapeutic approach is associated with:
          </h2>
          <div className="text-2xl font-bold mb-6">{question.term}</div>
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
          {feedback && (
            <>
              <p className="mt-6 text-base bg-gray-100 p-4 rounded-xl">{feedback}</p>
              <Button className="mt-4" onClick={nextQuestion}>
                Next Question
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
