require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const OpenAI = require('openai');
const Message = require('./models/Message');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({ origin: 'https://ai-chat-ivory.vercel.app' }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// Initialize OpenAI client (v4 syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.send('Server is running');
  });
 
  app.get('/test', (req, res) => {
    res.send('Test route is working 🎉');
  });
    


// Get all messages from MongoDB
app.get('/messages', async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: 1 }); // oldest to newest
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  

app.post('/messages', async (req, res) => {
  const { text } = req.body;

  const userMessage = new Message({ sender: 'user', text });
  await userMessage.save();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: text },
    ],
  });

  const aiText = completion.choices[0].message.content;

  const aiMessage = new Message({ sender: 'ai', text: aiText });
  await aiMessage.save();

  res.json({ userMessage, aiMessage });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
