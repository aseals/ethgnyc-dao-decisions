import OpenAI from "openai";

export default async function handler(req: { body: { messages: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { answer: string; }): void; new(): any; }; }; }) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const messages = req.body.messages;

  const chatCompletion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

    const answer = chatCompletion?.choices?.[0]?.message?.content ?? "";
    console.log(answer);
  res.status(200).json({ answer });
}
