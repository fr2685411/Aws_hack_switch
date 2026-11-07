import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Pause, Trash2, ArrowDown, Activity, ShieldAlert, CheckCircle2, Clock, Filter, Search, RefreshCw, Cpu, Layers } from 'lucide-react';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  phase: 'INGRESS' | 'NORMALIZE' | 'AST_SCAN' | 'SANDBOX' | 'GOVERNOR' | 'DELIVERY' | 'ROLLBACK';
  statusCode: number;
  statusText: string;
  latencyMs: number;
  service: string;
  message: string;
  level: 'info' | 'warn' | 'error' | 'success';
  endpoint?: string;
  payloadSize?: string;
  details?: string;
}

const INITIAL_LOGS: SystemLogEntry[] = [
  {
    id: 'log_001',
    timestamp: '09:08:35.102',
    phase: 'INGRESS',
    statusCode: 200,
    statusText: 'OK',
    latencyMs: 4,
    service: 'switch-gateway-ingress',
    endpoint: 'POST /api/webhook/discord',
    payloadSize: '1.42 KB',
    message: 'Webhook payload received from Discord Bot (ID: 2da969e8-ba79-47ec-be27-f983d58fec9a). HMAC signature verified.',
    level: 'info',
  },
  {
    id: 'log_002',
    timestamp: '09:08:35.116',
    phase: 'NORMALIZE',
    statusCode: 200,
    statusText: 'NORMALIZED',
    latencyMs: 14,
    service: 'switch-event-normalizer',
    message: 'Normalized Discord payload into UnifiedAgentEventSchema v1.4.0. Extracted context: git_diff, commit_sha, channel_id.',
    level: 'info',
  },
  {
    id: 'log_003',
    timestamp: '09:08:35.158',
    phase: 'SANDBOX',
    statusCode: 202,
    statusText: 'SPAWNED',
    latencyMs: 42,
    service: 'switch-agent-runner',
    message: 'Piped normalized context into Claude Code CLI worker via isolated STDIN stream (Container: c-jail-9941a).',
    level: 'info',
  },
  {
    id: 'log_004',
    timestamp: '09:08:35.268',
    phase: 'AST_SCAN',
    statusCode: 200,
    statusText: 'VERIFIED',
    latencyMs: 110,
    service: 'claude-code-worker',
    message: 'Tree-sitter AST syntax parse passed. 4/4 automated unit tests passed. Guard clause generated for session.token.',
    level: 'success',
  },
  {
    id: 'log_005',
    timestamp: '09:08:35.296',
    phase: 'DELIVERY',
    statusCode: 200,
    statusText: 'DELIVERED',
    latencyMs: 28,
    service: 'switch-card-builder',
    endpoint: 'POST /slack/api/chat.postMessage',
    payloadSize: '3.18 KB',
    message: 'Rendered Slack Block Kit template with interactive approval actions. Dispatched to #war-room-incident-408.',
    level: 'success',
  },
  {
    id: 'log_006',
    timestamp: '09:08:35.302',
    phase: 'GOVERNOR',
    statusCode: 200,
    statusText: 'AWAITING_HUMAN',
    latencyMs: 6,
    service: 'switch-safety-governor',
    message: 'Mandatory peer verification rule ACTIVE. Automated pipeline paused awaiting human SRE button response in thread.',
    level: 'info',
  },
];

interface AgentSystemLogStreamProps {
  isFailureMode?: boolean;
}

export const AgentSystemLogStream: React.FC<AgentSystemLogStreamProps> = ({ isFailureMode = false }) => {
  const [logs, setLogs] = useState<SystemLogEntry[]>(INITIAL_LOGS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'ERRORS' | 'INGRESS'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<SystemLogEntry | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  // Periodic log stream generator simulating live Switch AI decision steps
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
      const randomId = `log_${Date.now().toString().slice(-6)}`;

      if (isFailureMode) {
        // Emit failure & tripwire logs
        const failureScenarios: SystemLogEntry[] = [
          {
            id: randomId,
            timestamp: timeStr,
            phase: 'INGRESS',
            statusCode: 200,
            statusText: 'OK',
            latencyMs: Math.floor(Math.random() * 8) + 4,
            service: 'switch-gateway-ingress',
            endpoint: 'POST /api/webhook/discord',
            payloadSize: '1.84 KB',
            message: 'Incoming webhook: Automated agent hotfix proposal payload received.',
            level: 'info',
          },
          {
            id: `${randomId}_ast`,
            timestamp: timeStr,
            phase: 'AST_SCAN',
            statusCode: 500,
            statusText: 'TRIPWIRE_TRIPPED',
            latencyMs: 145,
            service: 'switch-safety-sentinel',
            endpoint: 'INTERNAL /validator/ast-tree-sitter',
            message: 'AST Parser Exception: LLM hallucinated undefined method raw_v0_internal_secret(). 2/4 unit tests FAILED.',
            level: 'error',
            details: 'TypeError: customer.stripe_session.v1_deprecated_token.raw is not a function at checkout.ts:143',
          },
          {
            id: `${randomId}_quarantine`,
            timestamp: timeStr,
            phase: 'SANDBOX',
            statusCode: 500,
            statusText: 'SIGKILL_137',
            latencyMs: 18,
            service: 'switch-container-jail',
            message: 'Rogue container terminated. Ephemeral worker memory wiped and quarantined to prevent production pollution.',
            level: 'error',
          },
          {
            id: `${randomId}_rollback`,
            timestamp: timeStr,
            phase: 'ROLLBACK',
            statusCode: 200,
            statusText: 'ROLLBACK_READY',
            latencyMs: 8,
            service: 'switch-safety-governor',
            message: 'Governance Circuit Tripped: Mandatory rollback action dispatched to human engineering team.',
            level: 'warn',
          },
        ];

        const randomPick = failureScenarios[Math.floor(Math.random() * failureScenarios.length)];
        setLogs((prev) => [...prev.slice(-45), randomPick]);
      } else {
        // Normal healthy heartbeat & decision-making logs
        const normalScenarios: SystemLogEntry[] = [
          {
            id: randomId,
            timestamp: timeStr,
            phase: 'INGRESS',
            statusCode: 200,
            statusText: 'OK',
            latencyMs: Math.floor(Math.random() * 10) + 4,
            service: 'switch-gateway-ingress',
            endpoint: 'POST /api/webhook/discord',
            payloadSize: '1.28 KB',
            message: 'Incoming event: GitHub PR #314 status update parsed and HMAC validated.',
            level: 'info',
          },
          {
            id: `${randomId}_norm`,
            timestamp: timeStr,
            phase: 'NORMALIZE',
            statusCode: 200,
            statusText: 'NORMALIZED',
            latencyMs: Math.floor(Math.random() * 12) + 8,
            service: 'switch-event-normalizer',
            message: 'Schema normalized to Switch Unified Event Spec. Inferred agent harness: Cursor HyperCopilot.',
            level: 'info',
          },
          {
            id: `${randomId}_ast`,
            timestamp: timeStr,
            phase: 'AST_SCAN',
            statusCode: 200,
            statusText: 'VERIFIED',
            latencyMs: Math.floor(Math.random() * 40) + 75,
            service: 'cursor-worker-daemon',
            message: 'AST Tree-sitter diff validation passed with 0 warnings. No circular dependencies detected.',
            level: 'success',
          },
          {
            id: `${randomId}_delivery`,
            timestamp: timeStr,
            phase: 'DELIVERY',
            statusCode: 200,
            statusText: 'DELIVERED',
            latencyMs: Math.floor(Math.random() * 15) + 20,
            service: 'switch-card-builder',
            endpoint: 'POST /discord/api/v10/channels/messages',
            payloadSize: '2.44 KB',
            message: 'Discord Rich Embed with interactive action buttons dispatched to channel #pr-reviews.',
            level: 'success',
          },
        ];

        const randomPick = normalScenarios[Math.floor(Math.random() * normalScenarios.length)];
        setLogs((prev) => [...prev.slice(-45), randomPick]);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming, isFailureMode]);

  // Handle manual log generation
  const handleTriggerWebhookPing = () => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
    const id = `manual_${Date.now()}`;

    const newEntries: SystemLogEntry[] = [
      {
        id: `${id}_1`,
        timestamp: timeStr,
        phase: 'INGRESS',
        statusCode: 200,
        statusText: 'OK',
        latencyMs: 6,
        service: 'switch-gateway-ingress',
        endpoint: 'POST /api/webhook/discord',
        payloadSize: '2.10 KB',
        message: 'Manual test webhook ping ingested into Switch AI Gateway from client.',
        level: 'info',
      },
      {
        id: `${id}_2`,
        timestamp: timeStr,
        phase: 'AST_SCAN',
        statusCode: isFailureMode ? 500 : 200,
        statusText: isFailureMode ? 'TRIPWIRE_FAIL' : 'CLEAN_PASS',
        latencyMs: isFailureMode ? 142 : 88,
        service: 'switch-ast-scanner',
        message: isFailureMode
          ? 'AST Validation Failed: Injected regression detected on customer session handling.'
          : 'AST Validation Succeeded: Syntax and type definitions verified cleanly.',
        level: isFailureMode ? 'error' : 'success',
      },
    ];

    setLogs((prev) => [...prev, ...newEntries]);
  };

  // Filter logs based on selected level and query
  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'INFO' && log.level !== 'info') return false;
    if (filterLevel === 'ERRORS' && log.level !== 'error' && log.level !== 'warn') return false;
    if (filterLevel === 'INGRESS' && log.phase !== 'INGRESS') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.service.toLowerCase().includes(q) ||
        log.phase.toLowerCase().includes(q) ||
        log.statusCode.toString().includes(q)
      );
    }
    return true;
  });

  // Calculate stats
  const avgLatency = Math.round(
    logs.reduce((acc, curr) => acc + curr.latencyMs, 0) / (logs.length || 1)
  );
  const errorCount = logs.filter((l) => l.level === 'error').length;
  const successRate = Math.round(((logs.length - errorCount) / (logs.length || 1)) * 100);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/95 overflow-hidden shadow-2xl space-y-0">
      {/* Terminal Title Bar */}
      <div className="px-5 py-3.5 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* macOS style control dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/40" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/40" />
          </div>

          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              SWITCH AI · AGENT SYSTEM LOG STREAM
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>DECISION ENGINE</span>
            </span>
            {isFailureMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 font-bold animate-pulse">
                TRIPWIRE AUDIT ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Live Metric Badges */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Latency: <strong className="text-white">{avgLatency}ms</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Health: <strong className={successRate < 90 ? 'text-amber-400' : 'text-emerald-400'}>{successRate}%</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>Events: <strong className="text-white">{logs.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Control Strip & Filter Bar */}
      <div className="px-5 py-2.5 bg-neutral-900/60 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Stream Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isStreaming
                ? 'bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border-neutral-700'
                : 'bg-amber-950/60 text-amber-300 border-amber-800'
            }`}
            title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isStreaming ? 'Live Streaming' : 'Stream Paused'}</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerWebhookPing}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Inject simulated webhook event into stream"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Webhook Ping</span>
          </button>

          <button
            type="button"
            onClick={() => setLogs([])}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 border border-neutral-800 text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear current stream"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              autoScroll
                ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/80 font-semibold'
                : 'bg-neutral-900 text-neutral-500 border-neutral-800'
            }`}
            title="Toggle autoscroll to bottom"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto-scroll</span>
          </button>
        </div>

        {/* Search & Level Filters */}
        <div className="flex items-center gap-2">
          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-2 py-0.5 rounded ${filterLevel === 'ALL' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              ALL
            </button>
            <button
              onClick={() => setFilterLevel('INGRESS')}
              className={`px-2 py-0.5 rounded ${filterLevel === 'INGRESS' ? 'bg-neutral-800 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              HTTP
            </button>
            <button
              onClick={() => setFilterLevel('ERRORS')}
              className={`px-2 py-0.5 rounded ${filterLevel === 'ERRORS' ? 'bg-rose-900/60 text-rose-300 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              ERRORS
            </button>
          </div>

          {/* Grep search */}
          <div className="relative">
            <Search className="w-3 h-3 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="grep logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2.5 py-1 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 outline-none focus:border-emerald-500 w-28 sm:w-36 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Terminal Scrolling Log View */}
      <div
        ref={scrollRef}
        className="p-4 sm:p-5 font-mono text-xs overflow-y-auto max-h-[360px] space-y-2 bg-neutral-950 scroll-smooth"
      >
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-neutral-500 space-y-2">
            <Terminal className="w-8 h-8 mx-auto opacity-30" />
            <p>No log records match current filters.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isError = log.level === 'error';
            const isWarn = log.level === 'warn';
            const isSuccess = log.level === 'success';

            // Latency styling
            const latencyColor =
              log.latencyMs < 20
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80'
                : log.latencyMs < 80
                ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80'
                : 'text-amber-400 bg-amber-950/60 border-amber-800/80';

            // Status code styling
            const statusColor =
              log.statusCode === 200 || log.statusCode === 202
                ? 'text-emerald-300 bg-emerald-950/80 border-emerald-700'
                : log.statusCode === 500
                ? 'text-rose-300 bg-rose-950/90 border-rose-600 font-bold'
                : 'text-amber-300 bg-amber-950/80 border-amber-700';

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none group ${
                  selectedLog?.id === log.id
                    ? 'bg-neutral-900 border-neutral-700 ring-1 ring-emerald-500/50'
                    : isError
                    ? 'bg-rose-950/20 border-rose-900/60 hover:bg-rose-950/40'
                    : isWarn
                    ? 'bg-amber-950/20 border-amber-900/60 hover:bg-amber-950/40'
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] leading-tight">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Timestamp */}
                    <span className="text-neutral-500 text-[10px]">
                      {log.timestamp}
                    </span>

                    {/* Status Code Badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                      HTTP {log.statusCode} {log.statusText}
                    </span>

                    {/* Latency Badge */}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center gap-1 ${latencyColor}`}>
                      <Clock className="w-2.5 h-2.5" />
                      <span>{log.latencyMs}ms</span>
                    </span>

                    {/* Phase Tag */}
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase font-semibold">
                      [{log.phase}]
                    </span>

                    {/* Service Name */}
                    <span className="text-neutral-400 font-medium">
                      {log.service}
                    </span>
                  </div>

                  {log.payloadSize && (
                    <span className="text-neutral-500 text-[10px]">
                      {log.payloadSize}
                    </span>
                  )}
                </div>

                {/* Main Log Message */}
                <div className="mt-1.5 flex items-start gap-2">
                  <span className={`shrink-0 text-xs ${isError ? 'text-rose-400' : isSuccess ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-neutral-400'}`}>
                    {isError ? '✖' : isSuccess ? '✔' : isWarn ? '▲' : '❯'}
                  </span>
                  <div className={`text-xs leading-relaxed ${isError ? 'text-rose-200 font-semibold' : 'text-neutral-300'}`}>
                    {log.message}
                  </div>
                </div>

                {/* Expanded Trace Details */}
                {selectedLog?.id === log.id && (
                  <div className="mt-2.5 pt-2 border-t border-neutral-800 text-[11px] space-y-1.5 bg-neutral-950/80 p-2.5 rounded border border-neutral-800/80">
                    <div className="text-neutral-400 flex items-center justify-between">
                      <span>INTERNAL DECISION RECORD:</span>
                      <span className="text-neutral-500 font-mono text-[10px]">ID: {log.id}</span>
                    </div>
                    {log.endpoint && (
                      <div className="text-neutral-300">
                        Endpoint: <strong className="text-cyan-300">{log.endpoint}</strong>
                      </div>
                    )}
                    <div className="text-neutral-300">
                      Processing Latency: <strong className="text-emerald-400">{log.latencyMs}ms</strong> · Status:{' '}
                      <strong className={log.statusCode === 200 ? 'text-emerald-400' : 'text-rose-400'}>
                        {log.statusCode} ({log.statusText})
                      </strong>
                    </div>
                    {log.details && (
                      <div className="p-2 rounded bg-rose-950/60 border border-rose-800 font-mono text-rose-300 text-[10px] whitespace-pre-wrap">
                        {log.details}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="px-5 py-2.5 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Switch Decision Ingress: <strong>Active (Zero-Drop Daemon)</strong></span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>HTTP 200: <strong className="text-emerald-400">{logs.filter((l) => l.statusCode === 200).length}</strong></span>
          <span>HTTP 202: <strong className="text-cyan-400">{logs.filter((l) => l.statusCode === 202).length}</strong></span>
          <span>HTTP 500: <strong className="text-rose-400">{logs.filter((l) => l.statusCode === 500).length}</strong></span>
          <span>Workspace: <strong className="text-neutral-200">2da969e8</strong></span>
        </div>
      </div>
    </div>
  );
};
