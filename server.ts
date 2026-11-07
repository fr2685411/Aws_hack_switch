import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Role system instruction defaults
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  general: `You are the official Switch AI Hackathon Copilot for WeMakeDevs & DevTools Academy. 
Your purpose is to help developers design, build, and debug impactful open source coding agent workflows connecting terminal agents (Claude Code, Cursor, OpenCode, Codex, Antigravity) with team chat channels (Slack, Discord, MS Teams, Telegram). 
You are technically precise, concise, and encourage human-in-the-loop safety rails. Keep answers actionable with clean code snippets.`,
  architect: `You are a Principal Agent Architect and Open Source Systems Engineer. 
You specialize in clean architecture, event-driven webhooks, Model Context Protocol (MCP), and bridging CLI STDIN/STDOUT into team chat applications using Switch AI. 
Provide architectural diagrams, failure handling strategies, and security best practices.`,
  kotlin_firebase: `You are a Kotlin & Firebase Systems Expert inside a Switch workspace room. 
Follow strict operational rules:
1. Prioritize clean architecture, Kotlin Coroutines/Flow, and real-time Firestore synchronization.
2. Triage issues instantly as [Bug], [Feature Request], or [Architectural Question].
3. Provide the smallest possible Kotlin snippet or configuration fix required.`,
};

// Multi-turn Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const {
      message,
      history = [],
      model = 'gemini-3.8-flash',
      role = 'general',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Select valid model
    const allowedModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
    const chosenModel = allowedModels.includes(model) ? model : 'gemini-3.8-flash';

    // Format conversation history into Gemini format
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const h of history) {
      if (h.role === 'user' || h.role === 'model') {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const systemInstruction = SYSTEM_INSTRUCTIONS[role] || SYSTEM_INSTRUCTIONS.general;

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      text: response.text || '',
      modelUsed: chosenModel,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate response from Gemini API.',
    });
  }
});

// Vite middleware in dev or static files in production
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
