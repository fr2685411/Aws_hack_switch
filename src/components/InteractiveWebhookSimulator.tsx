import React, { useState } from 'react';
import { Send, Zap, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw, Terminal, Check, Copy, ArrowRight, Play, Eye, Code2, Sparkles, MessageSquare, Flame, Layers, RotateCcw, ShieldAlert, Bug, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatPlatform, AgentHarness } from '../types/hackathon';
import { TraceVisualizer, TraceSpan } from './TraceVisualizer';

interface WebhookPreset {
  id: string;
  name: string;
  icon: string;
  source: string;
  eventType: string;
  author: string;
  channel: string;
  defaultPlatform: ChatPlatform;
  defaultHarness: AgentHarness;
  summary: string;
  problem: string;
  diffSnippet: string;
  actions: string[];
}

const PRESET_WEBHOOKS: WebhookPreset[] = [
  {
    id: 'gh-pr-opened',
    name: 'GitHub PR #314 Opened',
    icon: '🐙',
    source: 'GitHub Webhook (pull_request.opened)',
    eventType: 'GITHUB_PR_OPENED',
    author: 'newbie_contributor',
    channel: '#pr-reviews',
    defaultPlatform: 'Discord',
    defaultHarness: 'Cursor',
    summary: 'Pull Request #314: Fix memory leak in SocketManager reconnection loop (+184 / -12 lines)',
    problem: 'Contributor submitted PR #314 fixing socket leaks, but missed listener cleanup in onDisconnect() handler.',
    diffSnippet: `// src/SocketManager.ts
  cleanupListeners() {
+   this.socket.off("ping", this.handlePing);
+   this.socket.off("reconnect", this.handleReconnect);
    this.socket.disconnect();
  }`,
    actions: ['Approve & Trigger CI', 'Suggest Diff in Thread', 'Reject PR'],
  },
  {
    id: 'datadog-504',
    name: 'Datadog 504 Outage Spike',
    icon: '🚨',
    source: 'Datadog Webhooks (alert.triggered)',
    eventType: 'DATADOG_OUTAGE_SPIKE',
    author: 'datadog-alert-bot',
    channel: '#war-room-incident-408',
    defaultPlatform: 'Slack',
    defaultHarness: 'Claude Code',
    summary: 'Critical P1 Alert: 504 Gateway Timeout spike on /api/v2/checkout (14.8% error rate)',
    problem: 'Commit 8f2a1b assumed customer.stripe_session is never null on retry, throwing unhandled rejection.',
    diffSnippet: `// src/checkout.ts - Hotfix
- const token = customer.stripe_session.token;
+ const token = customer.stripe_session?.token ?? await refreshStripeSession(customer.id);`,
    actions: ['Approve & Deploy Hotfix', 'Run Regression Suite', 'Rollback Commit 8f2a1b'],
  },
  {
    id: 'sentry-null-pointer',
    name: 'Sentry NullPointer in PaymentWorker',
    icon: '⚡',
    source: 'Sentry Issue Alert (issue.created)',
    eventType: 'SENTRY_UNCAUGHT_EXCEPTION',
    author: 'sentry-monitor',
    channel: '#devops-alerts',
    defaultPlatform: 'Discord',
    defaultHarness: 'Kotlin / Firebase Agent',
    summary: 'Unhandled NullPointerException in PaymentWorker.kt:142 on idempotency retry key',
    problem: 'Missing nullable safe call (?.) when retrieving customer payment method token during Stripe webhook replay.',
    diffSnippet: `// PaymentWorker.kt
- val paymentToken = customer.paymentMethod.token
+ val paymentToken = customer.paymentMethod?.token ?: throw PaymentFailedException("Missing token")`,
    actions: ['Approve & Deploy Canary', 'Trigger Quarantine Drill', 'Dismiss Alert'],
  },
  {
    id: 'dependabot-cve',
    name: 'Dependabot High CVE-2026-4419',
    icon: '🛡️',
    source: 'Dependabot Security Alert',
    eventType: 'SECURITY_ADVISORY_INGEST',
    author: 'dependabot[bot]',
    channel: '#secops-engineering',
    defaultPlatform: 'Microsoft Teams',
    defaultHarness: 'OpenCode',
    summary: 'High Severity CVE-2026-4419: JWT Signature Verification Bypass in express-jwt < 8.4.1',
    problem: 'Automated scan found express-jwt vulnerable to algorithm spoofing in auth middleware.',
    diffSnippet: `// package.json
- "express-jwt": "^8.3.0",
+ "express-jwt": "^8.4.1",`,
    actions: ['Merge Security PR #89', 'Deploy to Staging', 'Dismiss Alert'],
  },
];

interface DispatchResult {
  success: boolean;
  message: string;
  botWorkspaceId: string;
  latencyMs: number;
  event: any;
  trace: { step: string; name: string; durationMs: number }[];
}

export interface InteractiveWebhookSimulatorProps {
  forceFailureMode?: boolean;
  onToggleFailureMode?: (enabled: boolean) => void;
}

export const InteractiveWebhookSimulator: React.FC<InteractiveWebhookSimulatorProps> = ({
  forceFailureMode,
  onToggleFailureMode,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<WebhookPreset>(PRESET_WEBHOOKS[0]);
  const [chatPlatform, setChatPlatform] = useState<ChatPlatform>(PRESET_WEBHOOKS[0].defaultPlatform);
  const [agentHarness, setAgentHarness] = useState<AgentHarness>(PRESET_WEBHOOKS[0].defaultHarness);
  const [customAuthor, setCustomAuthor] = useState<string>(PRESET_WEBHOOKS[0].author);
  const [customProblem, setCustomProblem] = useState<string>(PRESET_WEBHOOKS[0].problem);
  
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [humanDecision, setHumanDecision] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'trace' | 'json'>('card');
  const [hasCopiedCurl, setHasCopiedCurl] = useState<boolean>(false);

  // Agent Failure & Rollback Drill Simulation State
  const [isFailureMode, setIsFailureMode] = useState<boolean>(forceFailureMode ?? false);
  const [isRolledBack, setIsRolledBack] = useState<boolean>(false);

  // Sync with external forceFailureMode prop if provided
  React.useEffect(() => {
    if (forceFailureMode !== undefined) {
      setIsFailureMode(forceFailureMode);
      if (!forceFailureMode) {
        setIsRolledBack(false);
      }
    }
  }, [forceFailureMode]);

  const failureDiff = `// 🚨 REGRESSION: LLM Hallucinated deprecated API & broken type assertion
- const token = customer.stripe_session?.token;
+ const token = customer.stripe_session.v1_deprecated_token.raw(); // 💥 TypeError: undefined is not an object
+ customer.broadcastUnsafeTokenToSentry(token); // 💥 Leak: Exposing raw customer credential`;

  // Dynamic Multi-Turn Spans for LangSmith / OpenTelemetry Waterfall Trace
  const dynamicSpans: TraceSpan[] = [
    {
      id: 'span_01_ingest',
      name: `http.post /api/webhook/discord [${selectedPreset.eventType}]`,
      service: 'switch-gateway-ingress',
      category: 'INGRESS',
      startTimeMs: 0,
      durationMs: dispatchResult?.latencyMs ? Math.min(8, Math.round(dispatchResult.latencyMs * 0.3)) : 6,
      status: 'COMPLETED',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/webhook/discord',
        'http.status_code': 200,
        'client.ip': '192.168.1.42',
        'workspace.id': '2da969e8-ba79-47ec-be27-f983d58fec9a',
        'event.preset': selectedPreset.id,
        'drill.failure_simulation': isFailureMode,
      },
    },
    {
      id: 'span_02_normalize',
      parentId: 'span_01_ingest',
      name: 'switch.schema.normalize_event',
      service: 'switch-event-normalizer',
      category: 'NORMALIZATION',
      startTimeMs: 6,
      durationMs: 14,
      status: 'COMPLETED',
      attributes: {
        'switch.protocol_version': 'v1.4.0',
        'event.type': selectedPreset.eventType,
        'event.author': customAuthor,
      },
    },
    {
      id: 'span_03_dispatch',
      parentId: 'span_02_normalize',
      name: `agent.cli.spawn_${agentHarness.toLowerCase().replace(/[^a-z0-9]/g, '_')}_pipe`,
      service: 'switch-agent-runner',
      category: 'AGENT_CLI',
      startTimeMs: 20,
      durationMs: 42,
      status: 'COMPLETED',
      attributes: {
        'agent.harness': agentHarness,
        'process.stdin': 'PIPE_ATTACHED',
        'sandbox.isolation': 'container-jail-ephemeral',
      },
    },
    {
      id: 'span_04_analysis',
      parentId: 'span_03_dispatch',
      name: isFailureMode ? 'ast.tree_sitter_scan & unit_test_runner [FAIL]' : 'git.blame & ast.tree_sitter_scan',
      service: `${agentHarness.toLowerCase().replace(/[^a-z0-9]/g, '_')}-worker`,
      category: 'SANDBOX',
      startTimeMs: 62,
      durationMs: isFailureMode ? 145 : 110,
      status: isFailureMode ? 'FAILED' : 'COMPLETED',
      attributes: isFailureMode ? {
        'ast.error': 'UndefinedMethodCall: v1_deprecated_token() does not exist in Stripe v2026.4',
        'unit_tests.passed': '2/4 (FAILED)',
        'risk.score': 'CRITICAL_P1_TRIPWIRE',
        'sandbox.exit_code': 137,
        'regression.detected': true,
      } : {
        'git.diff_summary': selectedPreset.summary,
        'patch.verified': true,
        'unit_tests.passed': '4/4 (PASSED)',
      },
    },
    {
      id: 'span_05_card_gen',
      parentId: 'span_02_normalize',
      name: `switch.chat.render_${chatPlatform.toLowerCase().replace(/[^a-z0-9]/g, '_')}_block_kit`,
      service: 'switch-card-builder',
      category: 'CARD_DELIVERY',
      startTimeMs: isFailureMode ? 207 : 172,
      durationMs: 28,
      status: 'COMPLETED',
      attributes: {
        'chat.platform': chatPlatform,
        'channel.target': selectedPreset.channel,
        'card.variant': isFailureMode ? 'EMERGENCY_SAFETY_TRIPWIRE' : 'PROPOSED_VERIFIED_PATCH',
        'action_buttons': isFailureMode
          ? ['🛑 Reject & Rollback Branch', 'Quarantine Agent Sandbox', 'Override & Force Deploy (Risky)']
          : selectedPreset.actions,
      },
    },
    {
      id: 'span_06_human_gate',
      name: isFailureMode ? 'safety_governor.tripwire_pause_for_rollback' : 'human_in_the_loop.pause_for_decision',
      service: 'switch-safety-governor',
      category: 'HUMAN_GATE',
      startTimeMs: isFailureMode ? 235 : 200,
      durationMs: humanDecision ? 850 : 1400,
      status: isRolledBack ? 'COMPLETED' : humanDecision ? 'COMPLETED' : 'AWAITING_HUMAN',
      attributes: {
        'governance.rule': isFailureMode ? 'AUTOMATED_SAFETY_TRIPWIRE_TRIGGERED' : 'MANDATORY_PEER_APPROVAL_REQUIRED',
        'governance.recommendation': isFailureMode ? 'REJECT_AND_ROLLBACK' : 'PEER_APPROVAL_READY',
        'human.decision': humanDecision || (isFailureMode ? 'PENDING_EMERGENCY_ACTION' : 'WAITING_FOR_BUTTON_CLICK'),
      },
    },
    ...(humanDecision ? [{
      id: 'span_07_execution',
      parentId: 'span_06_human_gate',
      name: isRolledBack
        ? 'switch.safety_governor.execute_automated_rollback'
        : `executor.${humanDecision.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      service: isRolledBack ? 'switch-safety-governor' : 'switch-execution-engine',
      category: 'EXECUTION' as const,
      startTimeMs: 1050,
      durationMs: 65,
      status: 'COMPLETED' as const,
      attributes: isRolledBack ? {
        'rollback.git_branch': 'reverted to origin/main (HEAD~1)',
        'sandbox.container': 'CONTAINER_TERMINATED_AND_QUARANTINED',
        'production.impact': 'ZERO_OUTAGE_PRESERVED',
        'audit.event': 'AGENT_HALLUCINATION_PREVENTED',
      } : {
        'audit.action': humanDecision,
        'audit.status': 'SUCCESSFUL_CANARY_ROLLOUT',
      },
    }] : []),
  ];

  const handleSelectPreset = (preset: WebhookPreset) => {
    setSelectedPreset(preset);
    setChatPlatform(preset.defaultPlatform);
    setAgentHarness(preset.defaultHarness);
    setCustomAuthor(preset.author);
    setCustomProblem(preset.problem);
    setDispatchResult(null);
    setHumanDecision(null);
    setIsRolledBack(false);
    setExecutionStep(0);
  };

  const handleDispatch = async () => {
    setIsDispatching(true);
    setHumanDecision(null);
    setIsRolledBack(false);
    setExecutionStep(1); // Ingesting

    const effectiveDiff = isFailureMode ? failureDiff : selectedPreset.diffSnippet;
    const effectiveActions = isFailureMode
      ? ['🛑 Reject & Rollback Branch', 'Quarantine Agent Sandbox', 'Override & Force Deploy (Risky)']
      : selectedPreset.actions;
    const effectiveProblem = isFailureMode
      ? `[SIMULATED REGRESSION] Automated check tripped: Agent suggested patch calling deprecated v1 API without null safety. 2 unit tests failed.`
      : customProblem;

    try {
      const res = await fetch('/api/webhook/discord', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: isFailureMode ? 'SAFETY_TRIPWIRE_HALLUCINATION_DETECTED' : selectedPreset.eventType,
          source: isFailureMode ? 'Switch Sandbox Tripwire Sentinel' : selectedPreset.source,
          author: customAuthor,
          content: effectiveProblem,
          message: isFailureMode ? 'CRITICAL: Agent Hallucination Detected (Sandbox Failed)' : selectedPreset.summary,
          agentHarness,
          chatPlatform,
          channel: selectedPreset.channel,
          diffSnippet: effectiveDiff,
          actions: effectiveActions,
          botWorkspaceId: '2da969e8-ba79-47ec-be27-f983d58fec9a',
          isFailureDrill: isFailureMode,
        }),
      });

      const data: DispatchResult = await res.json();

      // Animate execution stages
      setTimeout(() => setExecutionStep(2), 250); // AST analysis / Failure detection
      setTimeout(() => setExecutionStep(3), 500); // Card generated
      setTimeout(() => {
        setExecutionStep(4); // Awaiting Human
        setDispatchResult(data);
        setIsDispatching(false);
      }, 750);
    } catch (e) {
      console.error('Dispatch failed:', e);
      setIsDispatching(false);
    }
  };

  const handleHumanAction = (action: string) => {
    setHumanDecision(action);
    const isRollbackAction = action.includes('Rollback') || action.includes('Quarantine');
    if (isRollbackAction) {
      setIsRolledBack(true);
    }
    try {
      confetti({
        particleCount: isFailureMode ? 65 : 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: isRollbackAction ? ['#10b981', '#34d399', '#059669'] : isFailureMode ? ['#ef4444', '#f59e0b', '#dc2626'] : ['#10b981', '#06b6d4', '#6366f1'],
      });
    } catch {
      // fallback
    }
  };

  const handleCopyCurl = () => {
    const curlCommand = `curl -X POST "${window.location.origin}/api/webhook/discord" \\
  -H "Content-Type: application/json" \\
  -d '{
    "botWorkspaceId": "2da969e8-ba79-47ec-be27-f983d58fec9a",
    "eventType": "${selectedPreset.eventType}",
    "author": "${customAuthor}",
    "content": "${customProblem.replace(/"/g, '\\"')}",
    "agentHarness": "${agentHarness}",
    "chatPlatform": "${chatPlatform}"
  }'`;

    navigator.clipboard.writeText(curlCommand);
    setHasCopiedCurl(true);
    setTimeout(() => setHasCopiedCurl(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 overflow-hidden shadow-2xl p-5 sm:p-7 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              INTERACTIVE WEBHOOK DISPATCH SIMULATOR
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              INSTANT JUDGE DELIGHT
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Fire Real-Time Webhooks into Switch AI Gateway
          </h3>
          <p className="text-xs text-neutral-400">
            Click any production incident preset to dispatch an authentic HTTP webhook into the gateway and witness live agent triage in under 300ms.
          </p>
        </div>

        {/* Copy cURL and Workspace ID Badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyCurl}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Copy cURL command to fire test webhook from your own terminal"
          >
            {hasCopiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hasCopiedCurl ? 'Copied cURL!' : 'Copy cURL Command'}</span>
          </button>
        </div>
      </div>

      {/* Preset Webhook Selector Bar */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5 font-mono">
          <span>SELECT WEBHOOK PRESET:</span>
          <span className="text-neutral-500">(1-Click Switch Scenarios)</span>
        </label>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESET_WEBHOOKS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-neutral-800 border-emerald-500/80 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-800/50 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                </div>
                <div className="text-[10px] text-neutral-400 line-clamp-1 font-mono">
                  {preset.source.split(' ')[0]}
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameter Fine-Tuning Strip */}
      <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-neutral-400">TARGET PLATFORM:</label>
          <select
            value={chatPlatform}
            onChange={(e) => setChatPlatform(e.target.value as ChatPlatform)}
            className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-medium outline-none focus:border-emerald-500"
          >
            <option value="Discord">Discord (#pr-reviews)</option>
            <option value="Slack">Slack (#war-room-incident)</option>
            <option value="Microsoft Teams">Microsoft Teams (DevOps Core)</option>
            <option value="Telegram">Telegram (@SwitchReleaseBot)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-neutral-400">ASSIGNED AGENT HARNESS:</label>
          <select
            value={agentHarness}
            onChange={(e) => setAgentHarness(e.target.value as AgentHarness)}
            className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-medium outline-none focus:border-emerald-500"
          >
            <option value="Claude Code">Claude Code CLI</option>
            <option value="Cursor">Cursor HyperCopilot</option>
            <option value="OpenCode">OpenCode SecOps Bot</option>
            <option value="Kotlin / Firebase Agent">Kotlin Firebase Daemon</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-neutral-400">TRIGGER AUTHOR / SENDER:</label>
          <input
            type="text"
            value={customAuthor}
            onChange={(e) => setCustomAuthor(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white font-mono outline-none focus:border-emerald-500"
            placeholder="e.g. srv-monitor, github-bot"
          />
        </div>
      </div>

      {/* Agent Failure & Rollback Drill Simulation Toggle */}
      <div className={`p-4 rounded-xl border transition-all ${
        isFailureMode
          ? 'bg-rose-950/40 border-rose-600/70 shadow-lg shadow-rose-950/40'
          : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              isFailureMode
                ? 'bg-rose-600/20 border-rose-500/50 text-rose-400 animate-pulse'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}>
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Simulate Agent Hallucination / Regression
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide uppercase ${
                  isFailureMode
                    ? 'bg-rose-500 text-neutral-950 shadow-sm shadow-rose-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}>
                  SAFETY DRILL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Injects an unverified hallucinated AST patch & failing unit test to verify Switch's automated safety tripwire and human-in-the-loop rollback circuit.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <span className={`text-[11px] font-mono font-semibold ${isFailureMode ? 'text-rose-400' : 'text-neutral-500'}`}>
              {isFailureMode ? 'TRIPWIRE ON' : 'NORMAL MODE'}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isFailureMode}
              onClick={() => {
                const next = !isFailureMode;
                setIsFailureMode(next);
                setHumanDecision(null);
                setIsRolledBack(false);
                onToggleFailureMode?.(next);
              }}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                isFailureMode ? 'bg-rose-600' : 'bg-neutral-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isFailureMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Big Dispatch Action Button */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
        isFailureMode
          ? 'bg-gradient-to-r from-rose-950/60 via-neutral-900 to-amber-950/60 border-rose-500/40'
          : 'bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-teal-950/60 border-emerald-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            isFailureMode
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            {isFailureMode ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            ) : (
              <Zap className="w-5 h-5 animate-bounce" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>
                {isFailureMode
                  ? `Safety Drill Ready: Tripwire on ${selectedPreset.name}`
                  : `Ready to Dispatch: ${selectedPreset.name}`}
              </span>
              {isFailureMode && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-900 text-rose-300 border border-rose-700">
                  REGRESSION INJECTED
                </span>
              )}
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              POST /api/webhook/discord · Target Workspace: 2da969e8-ba79-47ec-be27-f983d58fec9a
            </div>
          </div>
        </div>

        <button
          onClick={handleDispatch}
          disabled={isDispatching}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg disabled:opacity-50 cursor-pointer ${
            isFailureMode
              ? 'bg-rose-500 hover:bg-rose-400 text-neutral-950 shadow-rose-500/20'
              : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
          }`}
        >
          {isDispatching ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{isFailureMode ? 'Catching Tripwire...' : 'Ingesting & Processing...'}</span>
            </>
          ) : isFailureMode ? (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>Dispatch Regression Drill 🚨</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 fill-current" />
              <span>Dispatch Webhook Now ⚡</span>
            </>
          )}
        </button>
      </div>

      {/* Live Pipeline Execution Trace Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>SWITCH AI PIPELINE EXECUTION TRACE</span>
          <span>
            {executionStep === 0
              ? 'READY TO FIRE'
              : executionStep < 4
              ? 'PROCESSING IN REAL TIME...'
              : isFailureMode
              ? 'TRIPWIRE ACTIVATED · AWAITING ROLLBACK'
              : 'AWAITING HUMAN APPROVAL'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            executionStep >= 1 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">01. Ingestion (4ms)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            executionStep >= 2 ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">02. Schema Normalization (12ms)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            executionStep >= 3
              ? isFailureMode
                ? 'bg-rose-950/60 border-rose-800 text-rose-300 font-bold'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-neutral-950 border-neutral-800 text-neutral-500'
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isFailureMode ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
            <span className="truncate">
              {isFailureMode ? '03. Tripwire Tripped (145ms)' : '03. CLI Agent Triage (120ms)'}
            </span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
            executionStep >= 4
              ? isFailureMode
                ? 'bg-amber-950/70 border-amber-800 text-amber-300'
                : 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
              : 'bg-neutral-950 border-neutral-800 text-neutral-500'
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${isFailureMode ? 'bg-amber-400 animate-pulse' : 'bg-cyan-400 animate-pulse'}`} />
            <span className="truncate">
              {isFailureMode ? '04. Human Rollback Gate' : '04. Human Gate (Ready)'}
            </span>
          </div>
        </div>
      </div>

      {/* Output Results Viewer (Chat Card / Trace Table / Raw JSON) */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-xl">
        {/* Output Header */}
        <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-300">
              {chatPlatform} Preview: <strong>{selectedPreset.channel}</strong>
            </span>
            {dispatchResult && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                isFailureMode
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-400 border-emerald-800'
              }`}>
                {isFailureMode ? 'TRIPWIRE INTERCEPT · 200 OK' : `HTTP 200 OK · ${dispatchResult.latencyMs}ms`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-950 border border-neutral-800">
            <button
              onClick={() => setActiveTab('card')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'card' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interactive Card
            </button>
            <button
              onClick={() => setActiveTab('trace')}
              className={`px-2.5 py-1 text-xs rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'trace' ? 'bg-neutral-800 text-emerald-400 font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>OTel Trace Waterfall</span>
              <span className="px-1 py-0.2 text-[9px] font-mono rounded bg-emerald-500/20 text-emerald-300">OTel</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeTab === 'json' ? 'bg-neutral-800 text-white font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Raw Payload
            </button>
          </div>
        </div>

        {/* Tab 1: Interactive Chat Card */}
        {activeTab === 'card' && (
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${
                isFailureMode
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-emerald-500/20 border-emerald-500/40'
              }`}>
                {isFailureMode ? '🚨' : selectedPreset.icon}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-bold ${isFailureMode ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {agentHarness} (via Switch AI)
                  </span>
                  <span className="text-neutral-500 font-mono text-[11px]">Just now</span>
                  {isFailureMode && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                      SAFETY_GOVERNOR_INTERCEPT
                    </span>
                  )}
                </div>

                {/* Card Main Body */}
                <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                  isFailureMode
                    ? 'bg-rose-950/20 border-rose-600/50'
                    : 'bg-neutral-900 border-neutral-800'
                }`}>
                  {/* Failure Alert Banner */}
                  {isFailureMode && (
                    <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-700/80 text-rose-200 flex items-start gap-2.5 text-xs">
                      <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-bold flex items-center gap-2">
                          <span>🚨 AUTOMATED SAFETY TRIPWIRE TRIPPED: Potential Regression Detected</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-rose-900 border border-rose-700 text-rose-300">P1 TRIPWIRE</span>
                        </div>
                        <p className="text-[11px] text-rose-300/90 leading-relaxed">
                          The agent sandbox attempted to apply an unverified diff that failed <strong>2 of 4 sandbox unit tests</strong> with an <code className="font-mono text-rose-200 bg-rose-900/60 px-1 py-0.5 rounded">UndefinedMethodCall</code> error. Production deployment blocked by Switch Safety Governor.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Clean State Restored Shield Banner */}
                  {isRolledBack && (
                    <div className="p-3.5 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-300 space-y-1 text-xs animate-in fade-in">
                      <div className="font-bold flex items-center justify-between text-emerald-400">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>🛡️ Rollback Drill Executed Successfully: Clean State Preserved</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRolledBack(false);
                            setHumanDecision(null);
                          }}
                          className="text-[10px] text-emerald-400 hover:text-white flex items-center gap-1 font-mono hover:underline"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Drill
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                        Branch automatically reverted to <code className="font-mono text-emerald-100 bg-emerald-900/50 px-1 py-0.5 rounded">origin/main</code> (Commit 8f2a1b reverted). Ephemeral agent sandbox container killed and quarantined. <strong>Zero production downtime or customer impact.</strong>
                      </p>
                    </div>
                  )}

                  <div className="text-sm font-semibold text-white">
                    {isFailureMode ? 'CRITICAL: Blocked Unsafe Patch on Checkout Gateway' : selectedPreset.summary}
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-xs">
                    {isFailureMode
                      ? 'The AI agent suggested calling a deprecated v1 Stripe method without checking for null sessions. Switch sandbox caught the failure before human review.'
                      : customProblem}
                  </p>

                  {/* Proposed Patch Diff (Red highlighted if failure mode) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase ${isFailureMode ? 'text-rose-400 font-bold' : 'text-neutral-400'}`}>
                        {isFailureMode ? 'TRIPPED DIFF (CONTAINER FAILED 2 TESTS):' : 'PROPOSED VERIFIED PATCH:'}
                      </span>
                      {isFailureMode && (
                        <span className="text-[10px] font-mono text-rose-400">AST_VALIDATION: FAILED</span>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg text-xs font-mono whitespace-pre overflow-x-auto ${
                      isFailureMode
                        ? 'bg-neutral-950 border border-rose-900/80 text-rose-300'
                        : 'bg-neutral-950 border border-neutral-800 text-emerald-300'
                    }`}>
                      {isFailureMode ? failureDiff : selectedPreset.diffSnippet}
                    </div>
                  </div>

                  {/* Human-in-the-Loop Action Buttons */}
                  <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                      <span>{isFailureMode ? 'EMERGENCY GOVERNANCE ACTION REQUIRED:' : 'HUMAN-IN-THE-LOOP APPROVAL REQUIRED:'}</span>
                      {humanDecision && (
                        <span className={`font-bold flex items-center gap-1 ${isRolledBack ? 'text-emerald-400' : 'text-amber-400'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Executed: {humanDecision}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(isFailureMode
                        ? ['🛑 Reject & Rollback Branch', 'Quarantine Agent Sandbox', 'Override & Force Deploy (Risky)']
                        : selectedPreset.actions
                      ).map((act, i) => {
                        const isSelected = humanDecision === act;
                        const isRollback = act.includes('Rollback');
                        return (
                          <button
                            key={i}
                            onClick={() => handleHumanAction(act)}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all active:scale-95 cursor-pointer ${
                              isSelected
                                ? isRollback
                                  ? 'bg-emerald-500 text-neutral-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                                  : 'bg-rose-500 text-neutral-950 border-rose-400 font-bold shadow-md shadow-rose-500/20'
                                : isRollback
                                ? 'bg-rose-950 hover:bg-rose-900 text-rose-200 border-rose-800 hover:border-rose-600'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 hover:border-neutral-600'
                            }`}
                          >
                            {act}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Execution Trace Details (LangSmith / OpenTelemetry Waterfall) */}
        {activeTab === 'trace' && (
          <div className="p-3 sm:p-4">
            <TraceVisualizer
              spans={dynamicSpans}
              traceId={`trace_sw_${selectedPreset.id.slice(0, 8)}_${Date.now().toString().slice(-4)}`}
              totalDurationMs={humanDecision ? 1120 : 1600}
            />
          </div>
        )}

        {/* Tab 3: Raw JSON / Webhook Debugger Payload */}
        {activeTab === 'json' && (
          <div className="p-4 space-y-3">
            {isFailureMode && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-inner">
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <strong>FORCED DUMMY ERROR PAYLOAD IN WEBHOOK DEBUGGER</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-900 border border-rose-700 text-[10px] text-rose-200 font-bold">
                  HTTP 500 · REGRESSION_INTERCEPT
                </span>
              </div>
            )}
            <div className={`p-3 rounded-lg border font-mono text-xs overflow-x-auto max-h-80 ${
              isFailureMode
                ? 'bg-neutral-950 border-rose-900/80 text-rose-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-300'
            }`}>
              <pre>
                {JSON.stringify(
                  isFailureMode
                    ? {
                        status: 'SAFETY_TRIPWIRE_TRIGGERED',
                        error: 'LLM_HALLUCINATION_REGRESSION_DETECTED',
                        severity: 'CRITICAL_P1',
                        exitCode: 137,
                        sandboxJail: 'CONTAINER_TERMINATED_AND_QUARANTINED',
                        trippedCheck: 'AST_TREE_SITTER_SYNTAX_PARSER',
                        failingUnitTests: [
                          'TestStripeSessionIdempotentRetry.kt - NullPointerException on line 142',
                          'TestCredentialExfiltrationDefense.kt - UnauthorizedNetworkEgressBlocked'
                        ],
                        botWorkspaceId: '2da969e8-ba79-47ec-be27-f983d58fec9a',
                        eventType: 'SAFETY_TRIPWIRE_HALLUCINATION_DETECTED',
                        agentHarness,
                        chatPlatform,
                        channel: selectedPreset.channel,
                        corruptedDiffSnippet: failureDiff,
                        governanceRecommendation: 'REJECT_AND_ROLLBACK_BRANCH',
                        simulatedAt: new Date().toISOString(),
                      }
                    : (dispatchResult?.event || {
                        botWorkspaceId: '2da969e8-ba79-47ec-be27-f983d58fec9a',
                        eventType: selectedPreset.eventType,
                        source: selectedPreset.source,
                        author: customAuthor,
                        problem: customProblem,
                        channel: selectedPreset.channel,
                        chatPlatform,
                        agentHarness,
                        diffSnippet: selectedPreset.diffSnippet,
                        actions: selectedPreset.actions,
                        status: 'PENDING_APPROVAL',
                      }),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
