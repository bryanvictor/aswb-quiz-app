// src/pages/api/feedback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end("Method Not Allowed");
  }

  const { term, selectedTheory, correctTheory } = req.body;

  const prompt = selectedTheory === correctTheory
    ? `Explain why the term "${term}" is associated with ${correctTheory}. Keep it short, friendly, and helpful.`
    : `The term "${term}" is NOT related to ${selectedTheory}, but it is associated with ${correctTheory}. Briefly explain why, in a supportive and encouraging tone.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const feedback = completion.choices[0].message.content;
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ feedback: "Sorry, there was a problem generating feedback." });
  }
}
