import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Cpu, 
  Zap, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Copy, 
  Check 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
}

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<'general' | 'architect' | 'kotlin_firebase'>('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I am your **Switch AI Hackathon Copilot**, powered by Google Gemini. 
I can help you architect agent workflows, connect Claude Code or Kotlin to Slack/Discord via Switch AI, review your submission readiness, and debug issues. 
How can I assist your hackathon project today?`,
      timestamp: 'Ready',
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for API
      const history = newMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: history.slice(0, -1), // prior history excluding current message
          model: selectedModel,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.text || 'No response text returned.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed || selectedModel,
        };
        setMessages((prev) => [...prev, modelMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'model',
          text: `⚠️ **Error**: ${data.error || 'Failed to reach Gemini API. Please check your network or server configuration.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Connection Error**: ${err?.message || 'Server request failed.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: 'Chat history cleared. How can I help you build your Switch hackathon project?',
        timestamp: 'Reset',
        modelUsed: selectedModel,
      },
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    'How do I pipe Claude Code STDIN/STDOUT to Slack via Switch?',
    'Review my open-source project architecture for the $10,000 prize',
    'Write a minimal Kotlin + Firebase event sync loop for Discord',
    'What are the mandatory judging requirements for submission?',
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-semibold text-xs shadow-xl shadow-emerald-500/25 active:scale-95 transition-all group"
            title="Open Gemini Hackathon Copilot"
          >
            <Bot className="w-4 h-4 fill-current group-hover:rotate-12 transition-transform" />
            <span>AI Copilot</span>
            <span className="w-2 h-2 rounded-full bg-neutral-950 animate-pulse" />
          </button>
        )}
      </div>

      {/* Floating / Expanded Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[480px] h-[620px] max-h-[85vh] rounded-2xl'
          }`}
        >
          {/* Top Bar Header */}
          <div className="p-4 border-b border-neutral-800 bg-neutral-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                  <span>Gemini Hackathon Copilot</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
                  <span className="text-emerald-400">{selectedModel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedRole.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear conversation history"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model & Role Configuration Toolbar */}
          <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Model Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value as any)}
                className="px-2 py-1 text-[11px] font-mono rounded bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-emerald-500"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (General Tasks)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Responses)</option>
                <option value="gemini-4-argon">gemini-4-argon (Complex Reasoning)</option>
              </select>
            </div>

            {/* Role System Instruction Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400">Persona:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="px-2 py-1 text-[11px] font-mono rounded bg-neutral-950 border border-neutral-800 text-neutral-200 outline-none focus:border-emerald-500"
              >
                <option value="general">Hackathon Copilot</option>
                <option value="architect">Principal Architect</option>
                <option value="kotlin_firebase">Kotlin & Firebase Teammate</option>
              </select>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold ${
                      isUser
                        ? 'bg-neutral-800 border border-neutral-700 text-white'
                        : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                    }`}
                  >
                    {isUser ? 'U' : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-1.5 leading-relaxed relative group ${
                      isUser
                        ? 'bg-emerald-500 text-neutral-950 rounded-tr-none font-medium'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] text-neutral-400">
                      <span className={isUser ? 'text-neutral-900/70 font-semibold' : 'text-neutral-400'}>
                        {isUser ? 'You' : msg.modelUsed || 'Gemini'}
                      </span>
                      <span className={isUser ? 'text-neutral-900/60' : 'text-neutral-500 font-mono'}>
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="whitespace-pre-wrap text-xs font-sans break-words">
                      {msg.text}
                    </div>

                    {/* Copy action for model messages */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="absolute bottom-2 right-2 p-1 rounded bg-neutral-950/80 hover:bg-neutral-950 text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 rounded-tl-none flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{selectedModel} is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          {messages.length <= 3 && !loading && (
            <div className="px-4 py-2 bg-neutral-900/30 border-t border-neutral-800/60 overflow-x-auto flex items-center gap-1.5">
              <span className="text-[10px] text-neutral-500 whitespace-nowrap">Suggested:</span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 text-[11px] font-sans rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white whitespace-nowrap shrink-0 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Box */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/90">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Ask ${selectedModel}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-white placeholder-neutral-500 outline-none disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="p-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-neutral-950 font-semibold transition-all active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
