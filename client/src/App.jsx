import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch messages on load
  useEffect(() => {
    axios.get(`${API_URL}/messages`)
      .then(res => setMessages(res.data))
      .catch(console.error);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/messages`, { text: input });
      setMessages(prev => [...prev, res.data.userMessage, res.data.aiMessage]);
      setInput('');
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-12">
  AI Chat App <span className="text-blue-600">(MERN)</span>
     </h1>
      <div style={{ border: '1px solid #ddd', padding: 10, height: 400, overflowY: 'auto', marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            textAlign: msg.sender === 'user' ? 'right' : 'left', 
            margin: '10px 0'
          }}>
            <div style={{ 
              display: 'inline-block', 
              background: msg.sender === 'user' ? '#007bff' : '#eee', 
              color: msg.sender === 'user' ? 'white' : 'black', 
              padding: '8px 12px', 
              borderRadius: 15, 
              maxWidth: '80%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <input
        className='border-2 mt-5 rounded-sm border-blue-300'
        type="text"
        value={input}
        placeholder="Type a message..."
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        disabled={loading}
        style={{ width: '80%', padding: 10, fontSize: 16 }}
      />
      <button className='bg-blue-500 text-white rounded-md m-3' onClick={sendMessage} disabled={loading} style={{ padding: '10px 20px', fontSize: 16 }}>
        Send
      </button>
    </div>
  );
} //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
