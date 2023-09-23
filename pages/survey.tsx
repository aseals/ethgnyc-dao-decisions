import { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';
import React from 'react';

const Survey: React.FC = () => {
  const [useSMS, setUseSMS] = useState(false);
  const [question, setQuestion] = useState<string>('');
  const [interactionLog, setInteractionLog] = useState<any[]>([]);
  const [apiQuestion, setApiQuestion] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([
    { role: "system", content: "You are an expert in identifying underlying motivations and designing questions to expose value and bias from users. When prompted with a question, you can create insightful, value-oriented, abstract questions for decision-making; particularly questions that can elicit yes-or-no responses while unveiling implicit or unrecognized values. Please create such questions for the first user's input and tag each question with the value it's meant to evaluate. Please ask the questions one at a time, and after each yes or no response, you can ask another question to learn more about the user. Just ask one question at a time please. Make sure the questions are not redundant and try to keep moving forward to uncover nuance and get better data about the users values. Each question should either elicit a yes or no answer. Return the question as structured json data, with the value as the key and the question as the value. For example: {\"value\": \"fairness\",\"question\": \"an example question?\" \}. " },
  ]);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newMessages = [...messages, { role: 'user', content: question }];
    console.log(`submitting with messages: ${newMessages.map((message) => message.role + " " + message.content)}`);
    const res = await axios.post('/api/gpt4', { messages: newMessages });
    const responseMessage = res.data.answer;
    console.log(`got reponse: ${responseMessage}`);
    setApiQuestion(responseMessage);
    if (useSMS) { const res2 = await axios.post('/api/sms', { question: responseMessage}) };
    setMessages([...newMessages, { role: 'assistant', content: responseMessage }]);
  };

  const handleResponse = async (response: string): Promise<void> => {
    const newMessages = [...messages, { role: "user", content: response }];
    const res = await axios.post('/api/gpt4', { messages: newMessages });
    const responseMessage = res.data.answer;
    setApiQuestion(responseMessage);
    setMessages([...newMessages, { role: "assistant", content: responseMessage }]);
    if (useSMS) { const res2 = await axios.post('/api/sms', { question: responseMessage}) };
    setInteractionLog([...interactionLog, { question: apiQuestion, answer: response, value: apiQuestion}]);

  };

 return (
  <div className="font-sans p-8">
    <h1 className="border-b pb-4 text-2xl">Survey</h1>
    <input
      className="p-2 text-lg w-full mb-8 border rounded"
      type="text"
      value={question}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
    />
    <button className="p-2 px-8 text-lg bg-blue-500 text-white rounded" onClick={handleSubmit}>
      Submit
    </button>

    <div className="my-8">
      <input type="checkbox" className="mr-4" onChange={() => setUseSMS(!useSMS)} />
      Use SMS
    </div>

    {apiQuestion && (
      <div className="mt-8">
        <h2 className="text-xl mb-4">{apiQuestion}</h2>
        <button className="p-2 px-8 mr-4 bg-green-500 text-white rounded" onClick={() => handleResponse('Yes')}>
          Yes
        </button>
        <button className="p-2 px-8 bg-red-500 text-white rounded" onClick={() => handleResponse('No')}>
          No
        </button>
      </div>
     )}
     <table className="min-w-full bg-white mt-8">
  <thead>
    <tr>
      <th className="py-2 px-4">Question</th>
      <th className="py-2 px-4">Answer</th>
      <th className="py-2 px-4">Value</th>
    </tr>
  </thead>
  <tbody>
    {interactionLog.map((interaction, idx) => (
      <tr key={idx}>
        <td className="py-2 px-4">{interaction.question}</td>
        <td className="py-2 px-4">{interaction.answer}</td>
        <td className="py-2 px-4">{interaction.value}</td>
      </tr>
    ))}
  </tbody>
</table>
   </div>

);
}
export default Survey;
