import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const messages = req.body.messages;

  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  const answer = chatCompletion?.choices?.[0]?.message?.content ?? "";
  res.status(200).json({ answer });
}


/*
import OpenAI from "openai";
export default async function handler(req: { body: { question: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { answer: string | null; }): void; new(): any; }; }; }) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const decision_question = req.body.question;
    const chatCompletion = await openai.chat.completions.create({
        messages: [{role: "system", content: `You are an expert in identifying underlying motivations and designing questions to expose value and bias from users. When prompted with a question, you can create insightful, value-oriented, abstract questions for decision-making; particularly questions that can elicit yes-or-no responses while unveiling implicit or unrecognized values. Please create such questions for the following decision: ${decision_question}, and tag each question with the value it's meant to evaluate. Please ask the questions one at a time, and capture the user's response to each question.`}],
        model: "gpt-3.5-turbo",
    });

    const answer = chatCompletion?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ answer });
}

*/
