import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hi! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    try {
      const res = await axios.post('http://localhost:3000/api/get-review', {
        code: userMsg.text,
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessages((msgs) => [
        ...msgs,
        { from: 'ai', text: res.data.result || 'No response from AI.' }
      ]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { from: 'ai', text: 'Error connecting to AI backend.' }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center px-2 py-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col h-[80vh]">
        <header className="py-4 px-6 border-b flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-xl">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">AI Chat Assistant</h1>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] px-4 py-2 rounded-lg shadow
                ${msg.from === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'}
              `}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t flex gap-2 bg-white rounded-b-xl"
        >
          <textarea
            className="flex-1 resize-none border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={1}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
