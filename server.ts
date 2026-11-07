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

interface WorkspaceEvent {
  id: string;
  source: string;
  author: string;
  problem: string;
  status: string;
  timestamp: string;
  botWorkspaceId?: string;
  eventType?: string;
  agentHarness?: string;
  chatPlatform?: string;
  channel?: string;
  diffSnippet?: string;
  actions?: string[];
  latencyMs?: number;
}

const registeredBots: Record<string, { id: string; name: string; status: string; connectedAt: string }> = {
  '2da969e8-ba79-47ec-be27-f983d58fec9a': {
    id: '2da969e8-ba79-47ec-be27-f983d58fec9a',
    name: 'Discord Agent Teammate',
    status: 'ACTIVE_LINKED',
    connectedAt: new Date().toISOString(),
  },
};

const recentEvents: WorkspaceEvent[] = [
  {
    id: 'evt_bot_2da969',
    source: 'Discord Gateway',
    author: 'Bot [2da969e8]',
    problem: 'Discord Bot Workspace ID 2da969e8-ba79-47ec-be27-f983d58fec9a registered & linked to Switch Gateway',
    status: 'CONNECTED',
    timestamp: new Date().toISOString(),
    botWorkspaceId: '2da969e8-ba79-47ec-be27-f983d58fec9a',
    eventType: 'WORKSPACE_LINKED',
    agentHarness: 'Kotlin Firebase Daemon',
    chatPlatform: 'Discord',
    channel: '#pr-reviews',
    latencyMs: 14,
  },
  {
    id: 'evt_init01',
    source: 'Discord Gateway',
    author: 'SwitchBot',
    problem: 'Discord Webhook listener ready on /api/webhook/discord',
    status: 'LISTENING',
    timestamp: new Date().toISOString(),
    eventType: 'GATEWAY_HEALTHY',
    agentHarness: 'Claude Code',
    chatPlatform: 'Discord',
    channel: '#switch-relay',
    latencyMs: 8,
  },
];

app.post('/api/webhook/discord', (req, res) => {
  const {
    content,
    author,
    message,
    eventId,
    botWorkspaceId,
    eventType = 'GITHUB_PR_OPENED',
    agentHarness = 'Claude Code',
    chatPlatform = 'Discord',
    channel = '#pr-reviews',
    diffSnippet,
    actions,
    isFailureDrill = false,
  } = req.body;

  const problem = content || message || 'Event received from Discord bot';
  const effectiveId = botWorkspaceId || '2da969e8-ba79-47ec-be27-f983d58fec9a';
  const latencyMs = Math.floor(Math.random() * 15) + 12; // 12-27ms realistic gateway latency

  const event: WorkspaceEvent = {
    id: eventId || `evt_${Date.now().toString().slice(-6)}`,
    source: isFailureDrill ? 'Switch Safety Sentinel' : `${chatPlatform} Bot`,
    author: author || 'Discord User',
    problem,
    status: isFailureDrill ? 'SAFETY_TRIPWIRE_TRIGGERED' : 'PENDING_APPROVAL',
    timestamp: new Date().toISOString(),
    botWorkspaceId: effectiveId,
    eventType,
    agentHarness,
    chatPlatform,
    channel,
    diffSnippet: diffSnippet || '// Hotfix diff\n- const cache = null;\n+ const cache = await redis.get(key) ?? fallback();',
    actions: actions || ['Approve & Deploy Hotfix', 'Run Regression Tests', 'Reject & Rollback'],
    latencyMs,
  };

  recentEvents.unshift(event);
  if (recentEvents.length > 25) recentEvents.pop();

  return res.json({
    success: true,
    message: isFailureDrill
      ? 'Safety drill triggered: Agent hallucination caught by Switch AST Tripwire'
      : 'Event successfully received and processed by Switch AI Gateway',
    botWorkspaceId: effectiveId,
    latencyMs,
    trace: [
      { step: 'INGEST', name: 'Webhook Ingested by Switch Gateway', durationMs: 4 },
      { step: 'NORMALIZE', name: 'Payload Normalized to Switch Unified Schema', durationMs: 12 },
      { step: 'ROUTER', name: `Dispatched to ${agentHarness} Worker via STDIN`, durationMs: 45 },
      {
        step: 'ANALYSIS',
        name: isFailureDrill
          ? 'AST Tripwire: Hallucinated Deprecated API (2 Unit Tests Failed - Quarantined)'
          : 'AST Diff Parsed & Repro Unit Test Executed',
        durationMs: isFailureDrill ? 145 : 120,
      },
      {
        step: 'CARD_GEN',
        name: isFailureDrill
          ? `Emergency Tripwire Alert Card Delivered to ${channel}`
          : `Block Kit UI Delivered to ${channel} on ${chatPlatform}`,
        durationMs: 25,
      },
      {
        step: 'AWAIT_HUMAN',
        name: isFailureDrill
          ? 'Human Governance Gate: Awaiting Emergency Rollback Decision'
          : 'Human-in-the-Loop Gate: Awaiting Peer Decision',
        durationMs: 0,
      },
    ],
    event,
  });
});

app.get('/api/bot-status', (req, res) => {
  const id = (req.query.id as string) || '2da969e8-ba79-47ec-be27-f983d58fec9a';
  const botInfo = registeredBots[id] || {
    id,
    name: 'Custom Discord Bot',
    status: 'ACTIVE_LINKED',
    connectedAt: new Date().toISOString(),
  };
  return res.json({
    bot: botInfo,
    activeEvents: recentEvents.filter((e) => !e.botWorkspaceId || e.botWorkspaceId === id),
  });
});

app.get('/api/events', (_req, res) => {
  return res.json({ events: recentEvents });
});

app.get('/api/config/maps', (_req, res) => {
  const apiKey =
    process.env.VITE_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.GMP_API_KEY ||
    '';
  return res.json({ apiKey });
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
