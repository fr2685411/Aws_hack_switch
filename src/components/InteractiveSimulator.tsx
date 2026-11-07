import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, ArrowRight, Shield, GitPullRequest, AlertTriangle, MessageSquare, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { AgentHarness, ChatPlatform } from '../types/hackathon';

type ScenarioKey = 'outage' | 'pr-review' | 'cve-patch' | 'chatops';

interface ScenarioConfig {
  key: ScenarioKey;
  name: string;
  defaultHarness: AgentHarness;
  defaultPlatform: ChatPlatform;
  channelName: string;
  triggerEvent: string;
  steps: {
    phase: string;
    description: string;
    terminalLog: string;
    payloadSnippet: string;
  }[];
  finalMessage: {
    sender: string;
    avatar: string;
    title: string;
    body: string;
    codeSnippet?: string;
    actions: string[];
  };
}

const SCENARIOS: ScenarioConfig[] = [
  {
    key: 'outage',
    name: 'Production Outage War Room',
    defaultHarness: 'Claude Code',
    defaultPlatform: 'Slack',
    channelName: '#war-room-incident-408',
    triggerEvent: 'Datadog Alert: 504 Gateway Timeout spike on /api/v2/checkout',
    steps: [
      {
        phase: 'Event Ingestion',
        description: 'Datadog webhook received by Switch AI gateway and normalized into a unified agent event schema.',
        terminalLog: '$ switch gateway listen --port 8080\n[INGEST] POST /events/datadog - AlertID: DD-98421\n[ROUTER] Dispatching event to worker: claude-code-harness',
        payloadSnippet: JSON.stringify({ event: 'alert.triggered', service: 'checkout-api', p99_latency: '4200ms', error_rate: '14.8%' }, null, 2),
      },
      {
        phase: 'Terminal Agent Execution',
        description: 'Switch pipes event context into Claude Code via STDIN. Agent executes git log, blame, and isolates null pointer in payment token caching.',
        terminalLog: '$ claude-code run --context @event.json\n> git log -n 5 --stat\n> Found commit 8f2a1b "Cache Stripe customer session"\n> Identified line 142 in src/checkout.ts: session.token is undefined on retry\n> Writing repro test in tests/checkout.test.ts... PASS (reproduced bug)',
        payloadSnippet: JSON.stringify({ commit: '8f2a1b9', file: 'src/checkout.ts', fix_type: 'guard_clause_patch', test_status: 'passed' }, null, 2),
      },
      {
        phase: 'Channel Delivery',
        description: 'Switch AI translates the patch proposal and test artifacts into interactive Slack Block Kit UI with approval actions.',
        terminalLog: '[DISPATCH] Formatting Slack Block Kit template\n[SLACK_API] chat.postMessage -> #war-room-incident-408\n[STATUS] Awaiting human SRE approval in thread',
        payloadSnippet: JSON.stringify({ channel: 'C08123XYZ', blocks: 4, has_action_buttons: true }, null, 2),
      },
    ],
    finalMessage: {
      sender: 'Claude Code (via Switch)',
      avatar: '⚡',
      title: '🚨 Root Cause Identified & Patch Verified',
      body: 'I analyzed the 504 spike on `/api/v2/checkout`. Commit `8f2a1b` assumed `stripe_token` is present on idempotent retries, causing an unhandled promise rejection. I wrote a reproducing unit test and applied a defensive fallback.',
      codeSnippet: `// src/checkout.ts - Proposed Patch\n- const token = customer.stripe_session.token;\n+ const token = customer.stripe_session?.token ?? await refreshSession(customer.id);`,
      actions: ['Deploy Hotfix to Canary', 'Run Full Regression Suite', 'Rollback Commit 8f2a1b'],
    },
  },
  {
    key: 'pr-review',
    name: 'Open Source PR Copilot',
    defaultHarness: 'Cursor',
    defaultPlatform: 'Discord',
    channelName: '#pr-triage',
    triggerEvent: 'GitHub Webhook: Pull Request #314 opened by first-time contributor',
    steps: [
      {
        phase: 'PR Webhook Received',
        description: 'Switch captures GitHub pull_request.opened event with diff stats and repository guidelines.',
        terminalLog: '[SWITCH_WEBHOOK] GitHub event pull_request.opened -> Repo: wemakedevs/switch-router\n[PR #314] +184 lines / -12 lines by @newbie_dev',
        payloadSnippet: JSON.stringify({ pr_number: 314, author: 'newbie_dev', base: 'main', head: 'fix-memory-leak' }, null, 2),
      },
      {
        phase: 'AST & Benchmark Analysis',
        description: 'Cursor agent inspects the changed files using tree-sitter AST, verifies license header compliance, and checks for memory leaks.',
        terminalLog: '$ cursor-agent analyze --diff @pr_diff.patch\n> AST check: Valid syntax\n> License check: Apache-2.0 headers present\n> Warning: Event listener in SocketManager.ts missing cleanup in onDisconnect()',
        payloadSnippet: JSON.stringify({ ast_score: 98, leaks_detected: 1, file: 'src/SocketManager.ts' }, null, 2),
      },
      {
        phase: 'Discord Feedback Posted',
        description: 'Switch formats an empathetic, constructive review in the Discord community channel with a copyable 1-click suggestion.',
        terminalLog: '[SWITCH_DISCORD] Sending rich embed to Discord #pr-triage\n[DISCORD] Embed delivered with interactive button components',
        payloadSnippet: JSON.stringify({ guild_id: '10982348', embed_color: '#10B981', action: 'suggest_commit' }, null, 2),
      },
    ],
    finalMessage: {
      sender: 'ReviewPilot Agent (via Switch)',
      avatar: '🤖',
      title: '🌟 New Contributor PR #314 Reviewed',
      body: 'Welcome @newbie_dev! Thanks for fixing the socket reconnection logic! The implementation is super clean. One minor detail: `socket.on("ping")` should be unsubscribed inside `cleanupListeners()` to avoid listener leaks when clients disconnect abruptly.',
      codeSnippet: `// src/SocketManager.ts\n  cleanupListeners() {\n+   this.socket.off("ping", this.handlePing);\n    this.socket.disconnect();\n  }`,
      actions: ['Apply Suggested Commit to PR', 'Approve & Trigger CI', 'Ask Contributor for Benchmarks'],
    },
  },
  {
    key: 'cve-patch',
    name: 'Security CVE Auto-Patcher',
    defaultHarness: 'OpenCode',
    defaultPlatform: 'Microsoft Teams',
    channelName: 'SecOps-Engineering-Channel',
    triggerEvent: 'Dependabot Advisory: High severity CVE-2026-4419 detected in express-jwt',
    steps: [
      {
        phase: 'Advisory Ingest',
        description: 'Switch catches security advisory payload and triggers OpenCode dependency resolver.',
        terminalLog: '[SEC_GATEWAY] CVE-2026-4419 received. Package: express-jwt < 8.4.1\n[SWITCH] Initializing OpenCode security triage container',
        payloadSnippet: JSON.stringify({ cve: 'CVE-2026-4419', severity: 'HIGH', package: 'express-jwt', target_version: '8.4.1' }, null, 2),
      },
      {
        phase: 'Dependency Verification',
        description: 'Agent scans all package imports to determine whether vulnerable algorithms are invoked in production code paths.',
        terminalLog: '$ opencode verify-dep --package express-jwt\n> Static call graph search: jwt.algorithms usage found in src/auth/verify.ts\n> Upgrading package.json to ^8.4.1\n> Running npm test: 42 passed, 0 failed',
        payloadSnippet: JSON.stringify({ reachable: true, breaking_changes: 0, test_pass_rate: '100%' }, null, 2),
      },
      {
        phase: 'Adaptive Card in Teams',
        description: 'Switch delivers an Adaptive Card directly into Microsoft Teams with live test logs and one-click PR merge.',
        terminalLog: '[TEAMS_BOT] Posting Adaptive Card to DevOps Core\n[TEAMS] Card rendered with execute_action handlers',
        payloadSnippet: JSON.stringify({ card_type: 'AdaptiveCard', version: '1.5', can_auto_merge: true }, null, 2),
      },
    ],
    finalMessage: {
      sender: 'OpenCode SecOps (via Switch)',
      avatar: '🛡️',
      title: '🔒 Vulnerability Mitigated: CVE-2026-4419',
      body: 'Verified that `express-jwt` ^8.4.1 patches the signature validation flaw without breaking existing JWT tokens. All 42 unit and integration tests passed cleanly in the staging sandbox container.',
      codeSnippet: `// package.json\n- "express-jwt": "^8.3.0",\n+ "express-jwt": "^8.4.1",`,
      actions: ['Merge Security PR #89', 'Deploy to Staging', 'Dismiss Alert'],
    },
  },
  {
    key: 'chatops',
    name: 'Conversational Staging & Release',
    defaultHarness: 'Codex',
    defaultPlatform: 'Telegram',
    channelName: '@SwitchReleaseBot',
    triggerEvent: 'Telegram Message: "/release stage v2.8.0-rc1 with feature/oauth2"',
    steps: [
      {
        phase: 'Command Parsed',
        description: 'Switch receives Telegram message, authorizes user ID against maintainers team list, and creates workspace.',
        terminalLog: '[TELEGRAM_BOT] Update received from user @sarah_lead (Role: Maintainer)\n[COMMAND] /release stage v2.8.0-rc1\n[SWITCH] Spawning isolated Codex worker',
        payloadSnippet: JSON.stringify({ command: 'release', target: 'staging', tag: 'v2.8.0-rc1', user: 'sarah_lead' }, null, 2),
      },
      {
        phase: 'Worktree & Build Orchestration',
        description: 'Codex executes git fetch, merges feature branch, builds container image, and deploys preview endpoint.',
        terminalLog: '$ codex run --script deploy-preview.sh\n> Merging origin/feature/oauth2 into release branch\n> Running docker build -t app:v2.8.0-rc1 .\n> Provisioning ephemeral ingress: https://preview-rc1.switch.internal',
        payloadSnippet: JSON.stringify({ build_time: '24s', ingress: 'https://preview-rc1.switch.internal', status: 'ready' }, null, 2),
      },
      {
        phase: 'Status Delivery',
        description: 'Switch sends formatted Markdown response with clickable test URL and health probe confirmation.',
        terminalLog: '[SWITCH] Formatted Telegram response sent\n[TELEGRAM] Message sent with inline keyboard buttons',
        payloadSnippet: JSON.stringify({ sent_to: '@sarah_lead', status: 'deployed' }, null, 2),
      },
    ],
    finalMessage: {
      sender: 'Switch Release Bot',
      avatar: '🚀',
      title: '✅ Staging Environment Deployed',
      body: 'Candidate `v2.8.0-rc1` is now live for QA testing! Branch `feature/oauth2` was merged with zero conflicts. Automated smoke tests report healthy response times.',
      codeSnippet: `Preview URL: https://preview-rc1.switch.internal\nHealth Check: 200 OK (38ms)\nCommit: 4e9102c by @sarah_lead`,
      actions: ['Open Preview Webapp', 'Promote to Production', 'Tear Down Staging'],
    },
  },
];

export const InteractiveSimulator: React.FC = () => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<ScenarioKey>('outage');
  const [activeStep, setActiveStep] = useState<number>(2); // completed by default to show rich state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<'visual' | 'logs'>('visual');
  const [userActionTaken, setUserActionTaken] = useState<string | null>(null);

  const scenario = SCENARIOS.find((s) => s.key === selectedScenarioKey) || SCENARIOS[0];

  const handleRunSimulation = () => {
    setIsRunning(true);
    setUserActionTaken(null);
    setActiveStep(0);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < scenario.steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsRunning(false);
          return prev;
        }
      });
    }, 900);
  };

  const handleReset = () => {
    setActiveStep(scenario.steps.length - 1);
    setUserActionTaken(null);
    setIsRunning(false);
  };

  return (
    <section id="simulator" className="py-20 border-b border-neutral-800 bg-neutral-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
            <span>Architecture & Workflow Sandbox</span>
            <span aria-hidden="true">·</span>
            <span>Live Interactive Demo</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            How Switch bridges terminal agents with real team channels.
          </h2>
          <p className="text-neutral-400 text-base leading-relaxed">
            See the exact pipeline in action: from production alert or GitHub webhook, through Switch AI gateway, into terminal agents (Claude Code, Cursor, OpenCode), and back into Slack, Discord, or Teams with human approval controls.
          </p>
        </div>

        {/* Interactive Controls & Scenario Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 mb-8">
          {/* Segmented Scenario Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800/80">
            {SCENARIOS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setSelectedScenarioKey(s.key);
                  setActiveStep(s.steps.length - 1);
                  setUserActionTaken(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  selectedScenarioKey === s.key
                    ? 'bg-emerald-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 active:scale-95 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Running Simulation...' : 'Play Live Simulation'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset view"
              className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-800/80 hover:bg-neutral-800 rounded-lg border border-neutral-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Pipeline Journey & Output Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3-Step Pipeline Flow */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Pipeline Steps
            </div>

            {scenario.steps.map((st, idx) => {
              const isPassed = activeStep > idx;
              const isCurrent = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-900/90 border-emerald-500/80 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                      : isPassed
                      ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                      : 'bg-neutral-900/20 border-neutral-900 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        0{idx + 1}.
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {st.phase}
                      </h4>
                    </div>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <span className="text-[11px] font-mono text-emerald-400 font-medium">ACTIVE</span>
                    ) : (
                      <span className="text-[11px] font-mono text-neutral-600">WAITING</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              );
            })}

            {/* Architecture Metadata Box */}
            <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <div className="text-neutral-300 font-medium">Trigger Event:</div>
              <div className="font-mono text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-800">
                {scenario.triggerEvent}
              </div>
              <div className="flex items-center gap-3 pt-1 text-neutral-400">
                <span>Agent: <strong className="text-emerald-400">{scenario.defaultHarness}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Platform: <strong className="text-neutral-200">{scenario.defaultPlatform}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Protocol: <strong className="text-neutral-200">MCP + STDIN</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Chat / Terminal Canvas */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden shadow-2xl">
              {/* Header of the mock canvas */}
              <div className="px-5 py-3.5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    {scenario.channelName} ({scenario.defaultPlatform})
                  </span>
                </div>

                {/* View Mode Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-neutral-900 rounded-lg border border-neutral-800">
                  <button
                    onClick={() => setSelectedTab('visual')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      selectedTab === 'visual'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Visual Channel
                  </button>
                  <button
                    onClick={() => setSelectedTab('logs')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                      selectedTab === 'logs'
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Terminal Logs
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 min-h-[400px] flex flex-col justify-between">
                {selectedTab === 'visual' ? (
                  <div className="space-y-6">
                    {/* Simulated incoming trigger in chat */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm shrink-0">
                        🔔
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-neutral-300">System Webhook</span>
                          <span className="text-neutral-500">Today at 14:02 UTC</span>
                        </div>
                        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono">
                          {scenario.triggerEvent}
                        </div>
                      </div>
                    </div>

                    {/* Agent Response Card rendered via Switch */}
                    {activeStep >= 1 && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm shrink-0">
                          {scenario.finalMessage.avatar}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-emerald-400">
                              {scenario.finalMessage.sender}
                            </span>
                            <span className="text-neutral-500">Switch AI Gateway · 14:02:18 UTC</span>
                          </div>

                          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                            <div className="text-sm font-semibold text-white">
                              {scenario.finalMessage.title}
                            </div>
                            <p className="text-xs text-neutral-300 leading-relaxed">
                              {scenario.finalMessage.body}
                            </p>

                            {scenario.finalMessage.codeSnippet && (
                              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-emerald-300 whitespace-pre overflow-x-auto">
                                {scenario.finalMessage.codeSnippet}
                              </div>
                            )}

                            {/* Human in the loop action buttons */}
                            <div className="pt-2 border-t border-neutral-800/80">
                              <div className="text-[11px] text-neutral-400 mb-2">
                                Human-in-the-Loop Verification Required:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {scenario.finalMessage.actions.map((act, i) => (
                                  <button
                                    key={i}
                                    onClick={() => setUserActionTaken(act)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                                      userActionTaken === act
                                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400 font-semibold'
                                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-neutral-600'
                                    }`}
                                  >
                                    {act}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Follow up reaction when user clicks action */}
                    {userActionTaken && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Action executed: <strong className="font-semibold text-white">"{userActionTaken}"</strong></span>
                        </div>
                        <span className="font-mono text-[10px] text-emerald-400">STATUS: VERIFIED & LOGGED</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Terminal Logs View */
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 space-y-3 overflow-x-auto">
                      <div className="text-neutral-500">// Real-time STDIN/STDOUT stream from terminal agent</div>
                      <div className="whitespace-pre text-emerald-400">
                        {scenario.steps[activeStep]?.terminalLog || scenario.steps[0].terminalLog}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-400 space-y-2">
                      <div className="text-neutral-500">// Switch Event Gateway Payload</div>
                      <pre className="text-neutral-300 overflow-x-auto">
                        {scenario.steps[activeStep]?.payloadSnippet || scenario.steps[0].payloadSnippet}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Footer status notice */}
                <div className="pt-4 mt-6 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-2">
                    <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terminal-to-Chat latency: <strong>~240ms</strong></span>
                  </div>
                  <span>Switch AI Engine v2.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
