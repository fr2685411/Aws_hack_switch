import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Project, ChatPlatform, AgentHarness, TrackId } from '../types/hackathon';
import { X, Sparkles, Plus, Trash2, Check, AlertCircle, MessageSquare, Terminal, Shield, ShieldCheck, CheckCircle2, Bot, Play } from 'lucide-react';
import { TRACKS } from '../data/hackathonData';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newProject: Project) => void;
  initialDraft?: Partial<Project> | null;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
  initialDraft,
}) => {
  const [title, setTitle] = useState(initialDraft?.title || '');
  const [tagline, setTagline] = useState(initialDraft?.tagline || '');
  const [description, setDescription] = useState(initialDraft?.description || '');
  const [architecture, setArchitecture] = useState(initialDraft?.architecture || '');
  const [teamName, setTeamName] = useState(initialDraft?.teamName || '');
  const [members, setMembers] = useState<string[]>(initialDraft?.teamMembers && initialDraft.teamMembers.length > 0 ? initialDraft.teamMembers : ['']);
  const [repoUrl, setRepoUrl] = useState(initialDraft?.repoUrl || '');
  const [demoUrl, setDemoUrl] = useState(initialDraft?.demoUrl || '');
  const [agentHarness, setAgentHarness] = useState<AgentHarness>(initialDraft?.agentHarness || 'Claude Code');
  const [chatPlatform, setChatPlatform] = useState<ChatPlatform>(initialDraft?.chatPlatform || 'Slack');
  const [trackId, setTrackId] = useState<TrackId>(initialDraft?.trackId || 'incident-response');
  const [license, setLicense] = useState(initialDraft?.license || 'MIT');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Preview pane state
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialDraft) {
      if (initialDraft.title) setTitle(initialDraft.title);
      if (initialDraft.tagline) setTagline(initialDraft.tagline);
      if (initialDraft.description) setDescription(initialDraft.description);
      if (initialDraft.architecture) setArchitecture(initialDraft.architecture);
      if (initialDraft.teamName) setTeamName(initialDraft.teamName);
      if (initialDraft.teamMembers && initialDraft.teamMembers.length > 0) setMembers(initialDraft.teamMembers);
      if (initialDraft.repoUrl) setRepoUrl(initialDraft.repoUrl);
      if (initialDraft.demoUrl) setDemoUrl(initialDraft.demoUrl);
      if (initialDraft.agentHarness) setAgentHarness(initialDraft.agentHarness);
      if (initialDraft.chatPlatform) setChatPlatform(initialDraft.chatPlatform);
      if (initialDraft.trackId) setTrackId(initialDraft.trackId);
      if (initialDraft.license) setLicense(initialDraft.license);
    }
  }, [initialDraft, isOpen]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (members.length < 4) {
      setMembers([...members, '']);
    }
  };

  const handleMemberChange = (index: number, value: string) => {
    const updated = [...members];
    updated[index] = value;
    setMembers(updated);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!title.trim() || !tagline.trim() || !description.trim()) {
      setErrorMessage('Please fill in the project title, tagline, and description.');
      return;
    }

    if (!repoUrl.trim() || !repoUrl.startsWith('http')) {
      setErrorMessage('Please provide a valid open-source repository URL (https://github.com/...).');
      return;
    }

    if (!teamName.trim()) {
      setErrorMessage('Please specify your team or project name.');
      return;
    }

    const filteredMembers = members.filter((m) => m.trim().length > 0);
    if (filteredMembers.length === 0) {
      setErrorMessage('Please enter at least one team member name.');
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      architecture: architecture.trim() || `${chatPlatform} Event Webhook -> Switch AI -> ${agentHarness} CLI Worker -> Interactive Block Message`,
      teamName: teamName.trim(),
      teamMembers: filteredMembers,
      repoUrl: repoUrl.trim(),
      demoUrl: demoUrl.trim() || undefined,
      agentHarness,
      chatPlatform,
      trackId,
      license,
      upvotes: 1,
      submittedAt: 'Just now',
      featured: false,
    };

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }

    onSubmitSuccess(newProject);
    onClose();
  };

  // Channel presentation helpers based on selected platform
  const getChannelHeader = () => {
    switch (chatPlatform) {
      case 'Slack':
        return '#incident-war-room (Slack)';
      case 'Discord':
        return '#pr-reviews (Discord)';
      case 'Microsoft Teams':
        return 'DevOps Engineering (MS Teams)';
      case 'Telegram':
        return '@SwitchAgentBot (Telegram)';
      default:
        return '#general';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl lg:max-w-6xl w-full rounded-2xl bg-neutral-900 border border-neutral-700 p-6 md:p-8 space-y-6 my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">
              HACKATHON SUBMISSION & WORKFLOW VALIDATOR
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              Submit Open Source Project
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Provide project details and verify the live Switch AI chat interaction preview in real time.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800">
          <button
            type="button"
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              mobileTab === 'form'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Submission Details
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview'
                ? 'bg-neutral-800 text-emerald-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agent Preview</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Submission Readiness Meter */}
        {(() => {
          const hasTitle = Boolean(title.trim());
          const hasDesc = Boolean(description.trim().length > 10);
          const hasRepo = Boolean(repoUrl.trim().startsWith('http'));
          const hasDemo = Boolean(demoUrl.trim().startsWith('http'));
          const hasArch = Boolean(architecture.trim().length > 10);

          let pct = 0;
          if (hasTitle) pct += 15;
          if (hasDesc) pct += 15;
          if (hasRepo) pct += 25;
          if (hasDemo) pct += 25;
          if (hasArch) pct += 20;

          return (
            <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Submission Qualification Meter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${pct >= 85 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-neutral-400'}`}>
                    {pct}% READY
                  </span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-[10px] text-neutral-400 uppercase">
                    {pct === 100 ? 'Fully Qualified' : 'Action Required'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    pct >= 85 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-neutral-600'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Criteria Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] font-mono">
                <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  hasRepo ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                }`}>
                  {hasRepo ? <Check className="w-3 h-3" /> : '○'} GitHub Repo
                </span>
                <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  hasDemo ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                }`}>
                  {hasDemo ? <Check className="w-3 h-3" /> : '○'} Demo Video
                </span>
                <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  hasArch ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                }`}>
                  {hasArch ? <Check className="w-3 h-3" /> : '○'} Architecture
                </span>
                <span className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                  hasDesc ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
                }`}>
                  {hasDesc ? <Check className="w-3 h-3" /> : '○'} Description
                </span>
              </div>
            </div>
          );
        })()}

        {/* 2-Column Grid: Left Form, Right Live Agent Conversation Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Fields */}
          <div className={`lg:col-span-7 space-y-4 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <form id="submission-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Project Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. IncidentPulse Bot"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    One-Line Tagline *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Autonomous SRE incident commander in Slack"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Repo URL & Demo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Public GitHub / GitLab Repository *
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/your-org/your-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Live Demo / Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/... or https://demo.dev"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Platform, Agent Harness & Track */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Team Chat Platform
                  </label>
                  <select
                    value={chatPlatform}
                    onChange={(e) => setChatPlatform(e.target.value as ChatPlatform)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Slack">Slack</option>
                    <option value="Discord">Discord</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Agent Harness
                  </label>
                  <select
                    value={agentHarness}
                    onChange={(e) => setAgentHarness(e.target.value as AgentHarness)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Claude Code">Claude Code</option>
                    <option value="Cursor">Cursor</option>
                    <option value="OpenCode">OpenCode</option>
                    <option value="Codex">Codex</option>
                    <option value="Antigravity">Antigravity</option>
                    <option value="Kotlin / Firebase Agent">Kotlin / Firebase Agent</option>
                    <option value="Custom MCP">Custom MCP Agent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Track
                  </label>
                  <select
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value as TrackId)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                  >
                    {TRACKS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title.split('&')[0]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Team Name & License */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Team / Creator Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solo Developer"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-300">
                    Open Source License
                  </label>
                  <select
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="MIT">MIT License</option>
                    <option value="Apache-2.0">Apache 2.0</option>
                    <option value="BSD-3-Clause">BSD 3-Clause</option>
                    <option value="GPL-3.0">GNU GPL v3</option>
                  </select>
                </div>
              </div>

              {/* Team Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
                  <span>Team Members (Max 4) *</span>
                  {members.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((mem, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder={`Member ${idx + 1} Name or GitHub`}
                        value={mem}
                        onChange={(e) => handleMemberChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                        required={idx === 0}
                      />
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="p-2 text-neutral-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Project Description & Real-World Impact *
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain the problem you are solving and how team members interact with the agent in chat..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none resize-none"
                  required
                />
              </div>

              {/* Architecture Summary */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-300">
                  Technical Architecture & Switch AI Flow
                </label>
                <input
                  type="text"
                  placeholder="e.g. Webhook -> Switch AI Gateway -> Agent Harness -> Interactive Chat Message"
                  value={architecture}
                  onChange={(e) => setArchitecture(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </form>
          </div>

          {/* Right Column: Mock Agent Conversation Preview Pane */}
          <div className={`lg:col-span-5 space-y-3 ${mobileTab === 'form' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between text-xs font-medium text-neutral-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-semibold">Live Agent Preview</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-400">
                SWITCH WORKFLOW SIMULATOR
              </span>
            </div>

            {/* Simulated Chat Interface Container */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl flex flex-col justify-between min-h-[460px]">
              {/* Channel Top Header */}
              <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-neutral-300">
                    {getChannelHeader()}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  {agentHarness}
                </span>
              </div>

              {/* Conversation Feed */}
              <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
                {/* 1. Developer Trigger Message */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-neutral-300 shrink-0">
                    DEV
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-neutral-300">{teamName || 'Developer'}</span>
                      <span className="text-neutral-500">Just now</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                      @{agentHarness.split(' ')[0]} {tagline || 'Investigate recent error spike and propose a hotfix'}
                    </div>
                  </div>
                </div>

                {/* 2. Switch AI Gateway Routing Indicator */}
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Switch Gateway: Ingested event (34ms) → Spawned {agentHarness}
                  </span>
                </div>

                {/* 3. AI Agent Response Card with Human-in-the-Loop Controls */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs text-emerald-300 shrink-0">
                    ⚡
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-semibold text-emerald-400">
                        {title || 'Switch Agent'}
                      </span>
                      <span className="text-neutral-500 font-mono text-[10px]">Switch AI Bridge</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                      <div className="text-xs font-semibold text-white">
                        {tagline ? `Resolution for: ${tagline}` : 'Automated Diagnostic & Resolution'}
                      </div>

                      <p className="text-[11px] text-neutral-300 leading-relaxed">
                        {description
                          ? `Context analyzed: ${description.slice(0, 160)}${description.length > 160 ? '...' : ''}`
                          : 'I parsed repository context via Switch AI, verified unit tests, and isolated the optimal patch.'}
                      </p>

                      {/* Code Snippet Preview */}
                      <div className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[10px] text-emerald-300 whitespace-pre overflow-x-auto">
                        {agentHarness === 'Kotlin / Firebase Agent'
                          ? `// StateFlow Safe Handling\nval state: StateFlow<UiState> = repo.flow()\n    .stateIn(scope, SharingStarted.WhileSubscribed(5000), Loading)`
                          : `// Proposed Hotfix\n- const res = await fetch(url);\n+ const res = await safeRetry(() => fetch(url));`}
                      </div>

                      {/* Human in the loop action buttons */}
                      <div className="pt-2 border-t border-neutral-800/80 space-y-1.5">
                        <div className="text-[10px] text-neutral-400 font-medium">
                          Human-in-the-Loop Action:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSimulatedAction('Approve & Merge PR')}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-emerald-400 text-neutral-950 hover:bg-emerald-300 transition-colors font-semibold shadow-sm"
                          >
                            Approve & Merge PR
                          </button>
                          <button
                            type="button"
                            onClick={() => setSimulatedAction('Run Staging Tests')}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
                          >
                            Run Tests
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated confirmation after user clicks interactive button */}
                {simulatedAction && (
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Action confirmed: <strong>"{simulatedAction}"</strong></span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">STATUS: EXECUTED</span>
                  </div>
                )}
              </div>

              {/* Bottom Chat Prompt Footer */}
              <div className="px-3.5 py-2.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="font-mono">Listening on {chatPlatform} webhook...</span>
                <span className="text-emerald-400 font-mono">100% Responsive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Open Source License: <strong className="text-neutral-200">{license}</strong> · Platform: <strong className="text-emerald-400">{chatPlatform}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="submission-form"
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Project to Gallery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
