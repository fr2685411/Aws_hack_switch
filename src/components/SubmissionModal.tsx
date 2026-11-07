import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Project, ChatPlatform, AgentHarness, TrackId } from '../types/hackathon';
import { X, Sparkles, Plus, Trash2, Check, AlertCircle, MessageSquare, Terminal, Shield, ShieldCheck, CheckCircle2, Bot, Play, ExternalLink, Copy, PartyPopper, BarChart3, TrendingUp, Eye, MousePointerClick, Award, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TRACKS } from '../data/hackathonData';

export const PLATFORM_ANALYTICS_DATA = [
  { name: 'Discord', views: 420, interactions: 104, rate: 24.8 },
  { name: 'Slack', views: 350, interactions: 77, rate: 22.0 },
  { name: 'MS Teams', views: 210, interactions: 32, rate: 15.2 },
  { name: 'GitHub Repo', views: 560, interactions: 89, rate: 15.9 },
  { name: 'WeMakeDevs Portal', views: 680, interactions: 152, rate: 22.4 },
];

export const DAILY_ANALYTICS_DATA = [
  { name: 'Mon', views: 180, interactions: 38, rate: 21.1 },
  { name: 'Tue', views: 290, interactions: 64, rate: 22.0 },
  { name: 'Wed', views: 410, interactions: 95, rate: 23.1 },
  { name: 'Thu', views: 520, interactions: 122, rate: 23.4 },
  { name: 'Fri', views: 680, interactions: 168, rate: 24.7 },
  { name: 'Sat', views: 820, interactions: 204, rate: 24.8 },
  { name: 'Sun', views: 950, interactions: 248, rate: 26.1 },
];

export const PART3_HOW_USED_TEXT = `We connected Claude Code and Google ADK autonomous coding agents directly into Switch AI via our Kotlin event daemon and Firebase Firestore real-time synchronization backend.

Our agent operates primarily on Discord and Slack (with cross-platform support for MS Teams and Telegram).

Real Work It Accomplishes:
1. Automated Incident Resolution & Code Fixes: When an issue or webhook triggers in Discord/Slack (#pr-reviews or #incident-war-room), Switch routes the event to our Kotlin backend. The agent spins up an isolated sandbox, reproduces test failures, runs git blame, and generates validated patch diffs.
2. Interactive Human-in-the-Loop Safeguards: Rather than blindly executing destructive commands in production or merging unreviewed code, our agent posts an interactive Block Kit message in Discord/Slack with live preview diffs and two interactive buttons: "Approve & Deploy" or "Reject & Rollback". Teammates can review, comment, or approve actions directly from their chat without opening a terminal.
3. Live Multi-Agent Collaboration: Teammates interact via @mentions in chat threads to assign tasks, request architectural sanity checks, or trigger automated rollback drills. All state and audit logs are synchronized in real time with Cloud Firestore.`;

export const PART3_WHAT_LIKED_TEXT = `What worked great:
- Zero-friction chat-to-agent bridging: Taking coding agents out of solitary terminal windows and bringing them directly into existing team communication channels (Discord and Slack) where human collaboration already happens was a game-changer.
- Asynchronous webhook routing: The event model and webhook delivery latency were rock solid, allowing our Kotlin daemon to instantly process incoming alerts and dispatch agent tasks.
- Multi-platform flexibility: The ability to interface across Discord, Slack, and Teams without having to rewrite custom bot adapter harnesses from scratch.

What got in the way / would improve:
- Built-in session state & retry primitives: During long-running multi-turn agent tasks (e.g., executing full test suites), we had to implement custom Firebase heartbeat leases to prevent timeout drops. Having native long-poll or persistent task resumption in Switch would simplify backend daemon architectures.
- Richer interactive payload primitives: Expanding native button and modal schema support across all chat providers so we don't have to maintain platform-specific card formatting variations.
- Workspace-level agent access controls: Native RBAC rules defining which team members have authority to click "Approve Deploy" directly in the Switch webhook payload.`;

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
  
  // Modal tab and analytics state
  const [activeTab, setActiveTab] = useState<'form' | 'preview' | 'analytics'>('form');
  const [analyticsMetric, setAnalyticsMetric] = useState<'platform' | 'daily'>('platform');
  const [simulatedAction, setSimulatedAction] = useState<string | null>(null);
  const [hasCopiedAll, setHasCopiedAll] = useState(false);
  const [copiedPart3Q1, setCopiedPart3Q1] = useState(false);
  const [copiedPart3Q2, setCopiedPart3Q2] = useState(false);

  // Confetti Particle Effect Trigger
  const hasTriggeredConfettiRef = React.useRef(false);

  // Readiness Calculations
  const hasTitle = Boolean(title.trim());
  const hasDesc = Boolean(description.trim().length > 10);
  const hasRepo = Boolean(repoUrl.trim().startsWith('http'));
  const hasDemo = Boolean(demoUrl.trim().startsWith('http'));
  const hasArch = Boolean(architecture.trim().length > 10);

  let readinessPct = 0;
  if (hasTitle) readinessPct += 15;
  if (hasDesc) readinessPct += 15;
  if (hasRepo) readinessPct += 25;
  if (hasDemo) readinessPct += 25;
  if (hasArch) readinessPct += 20;

  const triggerReadinessConfetti = () => {
    try {
      // Left cannon burst
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'],
      });
      // Right cannon burst
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899'],
      });
      // Center shower fireworks
      setTimeout(() => {
        confetti({
          particleCount: 85,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#10b981', '#34d399', '#6ee7b7', '#fcd34d', '#38bdf8', '#a78bfa'],
        });
      }, 220);
    } catch {
      // Fallback
    }
  };

  React.useEffect(() => {
    if (readinessPct === 100 && !hasTriggeredConfettiRef.current && isOpen) {
      hasTriggeredConfettiRef.current = true;
      triggerReadinessConfetti();
    } else if (readinessPct < 100) {
      hasTriggeredConfettiRef.current = false;
    }
  }, [readinessPct, isOpen]);

  const handleCopySubmissionForPortal = () => {
    const formatted = `
=== WEMAKEDEVS FLIP THE SWITCH HACKATHON SUBMISSION ===
Official Portal: https://www.wemakedevs.org/hackathons/switch/submit

1. PROJECT NAME:
${title || 'FireSwitch: Kotlin & Firebase Collaborative Agent'}

2. TAGLINE / SHORT PITCH:
${tagline || 'Autonomous Kotlin daemon listening to Switch alerts with real-time Firestore sync and human approval cards.'}

3. TRACK:
${trackId}

4. CHAT PLATFORM:
${chatPlatform}

5. AGENT HARNESS:
${agentHarness}

6. PUBLIC GITHUB REPO URL:
${repoUrl || 'https://github.com/wemakedevs/switch-kotlin-firebase-starter'}

7. DEMO VIDEO URL (90-120s):
${demoUrl || 'https://loom.com/share/switch-hackathon-demo-sample'}

8. TEAM NAME & MEMBERS:
Team: ${teamName || 'FireSwitch Solo Team'}
Members: ${members.filter((m) => m.trim()).join(', ') || 'Developer (Solo)'}

9. OPEN SOURCE LICENSE:
${license} (OSI Compliant)

10. ARCHITECTURE & EVENT FLOW:
${architecture || `${chatPlatform} Event Webhook -> Switch AI Gateway -> ${agentHarness} -> Cloud Firestore -> ${chatPlatform} Card with Human Approval`}

11. DETAILED DESCRIPTION:
${description || 'Autonomous engineering agent taking coding agents out of the terminal into team chat with human-in-the-loop safety rails.'}

12. PART 3: HOW DID YOU USE SWITCH IN YOUR PROJECT?
${PART3_HOW_USED_TEXT}

13. PART 3: WHAT DID YOU LIKE ABOUT SWITCH, AND WHAT WOULD YOU IMPROVE?
${PART3_WHAT_LIKED_TEXT}
`.trim();

    navigator.clipboard.writeText(formatted);
    setHasCopiedAll(true);
    setTimeout(() => setHasCopiedAll(false), 2500);
  };

  const handleCopyPart3Q1 = () => {
    navigator.clipboard.writeText(PART3_HOW_USED_TEXT);
    setCopiedPart3Q1(true);
    setTimeout(() => setCopiedPart3Q1(false), 2200);
  };

  const handleCopyPart3Q2 = () => {
    navigator.clipboard.writeText(PART3_WHAT_LIKED_TEXT);
    setCopiedPart3Q2(true);
    setTimeout(() => setCopiedPart3Q2(false), 2200);
  };

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

        {/* Tab Switcher: Submission Details, Agent Preview, Analytics & Feedback */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-950 border border-neutral-800">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'form'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Submission Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-neutral-800 text-emerald-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agent Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800 shadow-sm'
                : 'text-neutral-400 hover:text-emerald-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Analytics & Feedback</span>
            <span className="px-1.5 py-0.2 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-300">NEW</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Submission Readiness Meter & Celebration Banner */}
        <div className={`p-4 rounded-xl border transition-all duration-300 space-y-3 ${
          readinessPct === 100
            ? 'bg-gradient-to-r from-emerald-950/70 via-neutral-950 to-teal-950/70 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
            : 'bg-neutral-950/80 border-neutral-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className={`w-4 h-4 ${readinessPct === 100 ? 'text-emerald-400 animate-pulse' : 'text-neutral-400'}`} />
              <span>Submission Qualification Meter</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${readinessPct >= 85 ? 'text-emerald-400' : readinessPct >= 50 ? 'text-amber-400' : 'text-neutral-400'}`}>
                {readinessPct}% READY
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] text-neutral-400 uppercase">
                {readinessPct === 100 ? 'Fully Qualified' : 'Action Required'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-500 ${
                readinessPct === 100
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400'
                  : readinessPct >= 50
                  ? 'bg-amber-400'
                  : 'bg-neutral-600'
              }`}
              style={{ width: `${readinessPct}%` }}
            />
          </div>

          {/* Criteria Pills and Celebration Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[10px] font-mono">
            <div className="flex flex-wrap items-center gap-2">
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

            {readinessPct === 100 && (
              <button
                type="button"
                onClick={triggerReadinessConfetti}
                className="px-2.5 py-1 text-[11px] font-semibold text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-600/70 rounded-md flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Celebrate 100% Submission Readiness with Confetti"
              >
                <PartyPopper className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>Celebrate 100% Ready 🎉</span>
              </button>
            )}
          </div>
        </div>

        {/* If activeTab === 'analytics', render Creator Analytics Dashboard; otherwise 2-Column Form & Preview */}
        {activeTab === 'analytics' ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Stat Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Total Views</span>
                  <Eye className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  2,220
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">↑ 28.4% this week</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Interactions</span>
                  <MousePointerClick className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                  454
                </div>
                <span className="text-[10px] text-indigo-300 font-mono">Bot triggers & runs</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Interaction Rate</span>
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono">
                  20.5%
                </div>
                <span className="text-[10px] text-cyan-300 font-mono">Top 10% Submissions</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between text-neutral-400 text-xs">
                  <span>Readiness Score</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">
                  {readinessPct}%
                </div>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {readinessPct === 100 ? 'Fully Qualified' : 'Action Required'}
                </span>
              </div>
            </div>

            {/* Recharts Bar Chart Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span>Project View Counts & Interaction Rates</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Comparative metrics showing creator submission engagement, total impressions, and direct bot execution frequency.
                  </p>
                </div>

                <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setAnalyticsMetric('platform')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      analyticsMetric === 'platform'
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    By Platform
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalyticsMetric('daily')}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      analyticsMetric === 'daily'
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    7-Day Trend
                  </button>
                </div>
              </div>

              {/* Recharts Simple Bar Chart */}
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsMetric === 'platform' ? PLATFORM_ANALYTICS_DATA : DAILY_ANALYTICS_DATA}
                    margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#737373"
                      tick={{ fill: '#a3a3a3', fontSize: 11 }}
                      axisLine={{ stroke: '#404040' }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#10b981"
                      tick={{ fill: '#a3a3a3', fontSize: 11 }}
                      axisLine={{ stroke: '#404040' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#06b6d4"
                      tick={{ fill: '#a3a3a3', fontSize: 11 }}
                      unit="%"
                      domain={[0, 35]}
                      axisLine={{ stroke: '#404040' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171717',
                        borderColor: '#404040',
                        borderRadius: '10px',
                        fontSize: '12px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
                      }}
                      itemStyle={{ fontSize: '11px' }}
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="views"
                      name="View Counts"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="interactions"
                      name="Interactions"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="rate"
                      name="Interaction Rate (%)"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actionable Creator Feedback Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Highest Converting Channels</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Interactive approval cards in Discord generate a <strong>24.8% interaction rate</strong>, followed closely by the WeMakeDevs Portal at <strong>22.4%</strong>. Keep your interactive card buttons prominent in PR descriptions.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Video Retention Impact</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Submissions with a valid 90-120s demo video URL receive <strong>+35% higher reviewer completion</strong>. Make sure your video shows the agent trigger in chat and the resulting GitHub pull request.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>Prize Qualification Status</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Your project currently meets <strong>{readinessPct}%</strong> of all mandatory criteria. All 5 components (Title, Tagline, GitHub Repo, Demo Video, and Architecture) qualify you for hackathon prize evaluations.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* 2-Column Grid: Left Form, Right Live Agent Conversation Preview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Fields */}
            <div className={`lg:col-span-7 space-y-4 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
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

              {/* Part 3 of 3 Official Hackathon Form Answers Helper */}
              <div className="p-3.5 rounded-xl bg-neutral-950/90 border border-neutral-800 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>Part 3 of 3: How you used Switch (Official Form Helper)</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">2 of 2 Answered</span>
                </div>

                {/* Question 1 Helper */}
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-neutral-200">
                      1. How did you use Switch in your project? *
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPart3Q1}
                      className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded flex items-center gap-1 transition-colors shrink-0"
                    >
                      {copiedPart3Q1 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-3 font-sans">
                    {PART3_HOW_USED_TEXT}
                  </p>
                </div>

                {/* Question 2 Helper */}
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-medium text-neutral-200">
                      2. What did you like about Switch, and what would you improve? *
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPart3Q2}
                      className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded flex items-center gap-1 transition-colors shrink-0"
                    >
                      {copiedPart3Q2 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-3 font-sans">
                    {PART3_WHAT_LIKED_TEXT}
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Mock Agent Conversation Preview Pane */}
          <div className={`lg:col-span-5 space-y-3 ${activeTab === 'form' ? 'hidden lg:block' : 'block'}`}>
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
      )}

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Open Source License: <strong className="text-neutral-200">{license}</strong> · Platform: <strong className="text-emerald-400">{chatPlatform}</strong>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCopySubmissionForPortal}
              className="px-3.5 py-2 text-xs font-mono rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 flex items-center gap-1.5 transition-colors"
              title="Copy formatted answers ready to paste into WeMakeDevs"
            >
              {hasCopiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied All Fields!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy for WeMakeDevs Portal</span>
                </>
              )}
            </button>

            <a
              href="https://www.wemakedevs.org/hackathons/switch/submit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>WeMakeDevs Submit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              form="submission-form"
              className="px-5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit to Gallery</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
