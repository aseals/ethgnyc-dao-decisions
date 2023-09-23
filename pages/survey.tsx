import { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';

const Survey: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [apiQuestion, setApiQuestion] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ role: string, content: string }>>([{
    role: 'system',
    content: 'You are an expert in identifying underlying motivations and designing questions to expose value and bias from users...'
  }]);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setMessages([...messages, { role: 'user', content: question }]);
    const res = await axios.post('/api/gpt4', { messages });
    const newMessage = res.data.answer.content;
    setApiQuestion(newMessage);
    setMessages([...messages, { role: 'assistant', content: newMessage }]);
  };

  const handleResponse = (response: string): void => {
    setMessages([...messages, { role: 'user', content: response }]);
    // Make a new API call here to continue the conversation
  };

 return (
  <div>
    <h1>Survey</h1>
    <input
      type="text"
      value={question}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
    />
    <button onClick={handleSubmit}>Submit</button>

    {apiQuestion && (
      <div>
        <h2>{apiQuestion}</h2>
        <button onClick={() => handleResponse('Yes')}>Yes</button>
        <button onClick={() => handleResponse('No')}>No</button>
      </div>
    )}
  </div>
);
};
export default Survey;

/*
import { useState, ChangeEvent, MouseEvent } from 'react';
import axios from 'axios';

const Survey: React.FC = () => {
  const [question, setQuestion] = useState<string>(''); // Your decision question
  const [apiQuestion, setApiQuestion] = useState<string | null>(null); // Question from OpenAI

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
      // Call your OpenAI API
    console.log(`Submitting question: ${question}`);
    const res = await axios.post('/api/gpt4', { question });
    setApiQuestion(res.data.answer);
  };

  const handleResponse = (response: string): void => {
    // Handle 'Yes'/'No' button clicks
    console.log(`User responded with ${response}`);
    // Here you can send the response back to your server or whatever you want to do next
  };

  return (
    <div>
      <h1>Survey</h1>
      <input
        type="text"
        value={question}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {apiQuestion && (
        <div>
          <h2>{apiQuestion}</h2>
          <button onClick={() => handleResponse('Yes')}>Yes</button>
          <button onClick={() => handleResponse('No')}>No</button>
        </div>
      )}
    </div>
  );
};

export default Survey;
*/
