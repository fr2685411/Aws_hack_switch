import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, ChevronRight, ChevronDown, Copy, Check, Terminal, Shield, ExternalLink, Filter, Layers, Code, Zap } from 'lucide-react';

export interface TraceSpan {
  id: string;
  parentId?: string;
  name: string;
  service: string;
  category: 'INGRESS' | 'NORMALIZATION' | 'AGENT_CLI' | 'SANDBOX' | 'CARD_DELIVERY' | 'HUMAN_GATE' | 'EXECUTION';
  startTimeMs: number;
  durationMs: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'AWAITING_HUMAN' | 'FAILED';
  attributes: Record<string, any>;
}

export const SAMPLE_SPANS: TraceSpan[] = [
  {
    id: 'span_01_ingest',
    name: 'http.post /api/webhook/discord',
    service: 'switch-gateway-ingress',
    category: 'INGRESS',
    startTimeMs: 0,
    durationMs: 8,
    status: 'COMPLETED',
    attributes: {
      'http.method': 'POST',
      'http.route': '/api/webhook/discord',
      'http.status_code': 200,
      'client.ip': '192.168.1.42',
      'workspace.id': '2da969e8-ba79-47ec-be27-f983d58fec9a',
      'payload.bytes': 1482,
    },
  },
  {
    id: 'span_02_normalize',
    parentId: 'span_01_ingest',
    name: 'switch.schema.normalize_event',
    service: 'switch-event-normalizer',
    category: 'NORMALIZATION',
    startTimeMs: 8,
    durationMs: 14,
    status: 'COMPLETED',
    attributes: {
      'switch.protocol_version': 'v1.4.0',
      'event.type': 'GITHUB_PR_OPENED',
      'event.normalized': true,
      'schema.validator': 'zod-strict-v3',
    },
  },
  {
    id: 'span_03_dispatch',
    parentId: 'span_02_normalize',
    name: 'agent.cli.spawn_worker_pipe',
    service: 'switch-agent-runner',
    category: 'AGENT_CLI',
    startTimeMs: 22,
    durationMs: 38,
    status: 'COMPLETED',
    attributes: {
      'agent.harness': 'Claude Code CLI',
      'process.stdin': 'PIPE_ATTACHED',
      'process.pid': 40821,
      'sandbox.isolation': 'container-jail-ephemeral',
    },
  },
  {
    id: 'span_04_git_blame',
    parentId: 'span_03_dispatch',
    name: 'git.blame & ast.tree_sitter_scan',
    service: 'claude-code-worker',
    category: 'SANDBOX',
    startTimeMs: 60,
    durationMs: 95,
    status: 'COMPLETED',
    attributes: {
      'git.head_commit': '8f2a1b9',
      'git.changed_files': ['src/checkout.ts', 'src/SocketManager.ts'],
      'ast.parser': 'tree-sitter-typescript',
      'ast.null_pointer_detected': true,
      'line.culprit': 'src/checkout.ts:142',
    },
  },
  {
    id: 'span_05_repro_test',
    parentId: 'span_04_git_blame',
    name: 'sandbox.run_reproducing_test',
    service: 'claude-code-worker',
    category: 'SANDBOX',
    startTimeMs: 155,
    durationMs: 115,
    status: 'COMPLETED',
    attributes: {
      'test.framework': 'jest / vitest',
      'test.command': 'vitest run tests/checkout.test.ts',
      'test.reproduced': true,
      'test.status': 'PASSED_REPRODUCED_REGRESSION',
    },
  },
  {
    id: 'span_06_card_gen',
    parentId: 'span_02_normalize',
    name: 'switch.chat.render_block_kit',
    service: 'switch-card-builder',
    category: 'CARD_DELIVERY',
    startTimeMs: 270,
    durationMs: 28,
    status: 'COMPLETED',
    attributes: {
      'chat.platform': 'Discord',
      'channel.target': '#pr-reviews',
      'card.type': 'InteractiveCard',
      'action_buttons': ['Approve & Deploy Hotfix', 'Run Full Regression', 'Reject & Rollback'],
    },
  },
  {
    id: 'span_07_human_gate',
    name: 'human_in_the_loop.pause_for_decision',
    service: 'switch-safety-governor',
    category: 'HUMAN_GATE',
    startTimeMs: 298,
    durationMs: 1240,
    status: 'AWAITING_HUMAN',
    attributes: {
      'governance.rule': 'MANDATORY_PEER_APPROVAL_REQUIRED',
      'governance.bypass_allowed': false,
      'human.status': 'WAITING_FOR_BUTTON_CLICK',
      'audit.record_id': 'audit_sec_99418',
    },
  },
  {
    id: 'span_08_execution',
    parentId: 'span_07_human_gate',
    name: 'git.cherry_pick & canary.deploy',
    service: 'switch-execution-engine',
    category: 'EXECUTION',
    startTimeMs: 1538,
    durationMs: 82,
    status: 'COMPLETED',
    attributes: {
      'deploy.target': 'canary-stage-01',
      'deploy.status': 'HEALTHY_200_OK',
      'audit.actor': 'lead_sre_approver',
      'audit.action': 'APPROVED_CANARY_ROLLOUT',
    },
  },
];

interface TraceVisualizerProps {
  spans?: TraceSpan[];
  traceId?: string;
  totalDurationMs?: number;
}

export const TraceVisualizer: React.FC<TraceVisualizerProps> = ({
  spans = SAMPLE_SPANS,
  traceId = 'trace_sw_2da969e8_7741',
  totalDurationMs = 1620,
}) => {
  const [selectedSpan, setSelectedSpan] = useState<TraceSpan>(spans[3]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [playbackMs, setPlaybackMs] = useState<number>(totalDurationMs);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasCopiedJson, setHasCopiedJson] = useState<boolean>(false);

  const filteredSpans = spans.filter((s) => {
    if (activeCategoryFilter !== 'ALL' && s.category !== activeCategoryFilter) return false;
    return true;
  });

  const getCategoryColor = (cat: TraceSpan['category']) => {
    switch (cat) {
      case 'INGRESS':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'NORMALIZATION':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'AGENT_CLI':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'SANDBOX':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'CARD_DELIVERY':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'HUMAN_GATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'EXECUTION':
        return 'bg-teal-500/20 text-teal-400 border-teal-500/40';
      default:
        return 'bg-neutral-800 text-neutral-400 border-neutral-700';
    }
  };

  const getBarColor = (cat: TraceSpan['category'], status: TraceSpan['status']) => {
    if (status === 'AWAITING_HUMAN') return 'bg-amber-400 animate-pulse';
    if (status === 'FAILED') return 'bg-red-400';
    switch (cat) {
      case 'INGRESS':
        return 'bg-emerald-400';
      case 'NORMALIZATION':
        return 'bg-blue-400';
      case 'AGENT_CLI':
        return 'bg-indigo-400';
      case 'SANDBOX':
        return 'bg-purple-400';
      case 'CARD_DELIVERY':
        return 'bg-cyan-400';
      case 'HUMAN_GATE':
        return 'bg-amber-400';
      case 'EXECUTION':
        return 'bg-teal-400';
      default:
        return 'bg-neutral-400';
    }
  };

  const handleCopyOTelJson = () => {
    const otelPayload = {
      traceId,
      resourceSpans: [
        {
          resource: {
            attributes: [
              { key: 'service.name', value: { stringValue: 'switch-agent-gateway' } },
              { key: 'workspace.id', value: { stringValue: '2da969e8-ba79-47ec-be27-f983d58fec9a' } },
              { key: 'telemetry.sdk.name', value: { stringValue: 'opentelemetry-switch-exporter' } },
            ],
          },
          scopeSpans: [
            {
              scope: { name: 'switch.agent.trace', version: '1.4.0' },
              spans: spans.map((s) => ({
                traceId,
                spanId: s.id,
                parentSpanId: s.parentId,
                name: s.name,
                startTimeUnixNano: (s.startTimeMs * 1_000_000).toString(),
                endTimeUnixNano: ((s.startTimeMs + s.durationMs) * 1_000_000).toString(),
                status: { code: s.status === 'FAILED' ? 2 : 1 },
                attributes: Object.entries(s.attributes).map(([k, v]) => ({
                  key: k,
                  value: typeof v === 'number' ? { intValue: v } : { stringValue: String(v) },
                })),
              })),
            },
          ],
        },
      ],
    };

    navigator.clipboard.writeText(JSON.stringify(otelPayload, null, 2));
    setHasCopiedJson(true);
    setTimeout(() => setHasCopiedJson(false), 2200);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl space-y-4">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-900/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
              LANGSMITH / OPENTELEMETRY EXECUTION TRACE
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
              OTEL COMPLIANT
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            Multi-Turn Agent Execution Trace & Waterfall
          </h3>
          <p className="text-xs text-neutral-400">
            Real-time execution spans tracking webhook ingress, CLI agent sandboxing, diff validation, and human-in-the-loop authorization.
          </p>
        </div>

        {/* Trace ID & Export */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col text-right font-mono text-[11px]">
            <span className="text-neutral-400">TRACE ID:</span>
            <span className="text-emerald-400 font-bold">{traceId}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyOTelJson}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Export OpenTelemetry / LangSmith compliant JSON"
          >
            {hasCopiedJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied OTel JSON</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Export OTel JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="px-4 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-neutral-500 mr-1">FILTER SPANS:</span>
          {['ALL', 'INGRESS', 'AGENT_CLI', 'SANDBOX', 'CARD_DELIVERY', 'HUMAN_GATE', 'EXECUTION'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                activeCategoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Total Time & Span Count */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
          <span>Total Spans: <strong className="text-white">{filteredSpans.length}</strong></span>
          <span>·</span>
          <span>Total Trace Time: <strong className="text-emerald-400">{totalDurationMs}ms</strong></span>
        </div>
      </div>

      {/* Main Grid: Left Waterfall Chart, Right Span Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-neutral-800 min-h-[460px]">
        {/* Left Column: Waterfall Timeline (7 cols) */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-neutral-800 p-4 space-y-3 overflow-x-auto">
          {/* Time scale ruler */}
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 border-b border-neutral-800/80 pb-1 px-1">
            <span>0ms (Ingress)</span>
            <span>400ms (AST)</span>
            <span>800ms (Review)</span>
            <span>1200ms (Gate)</span>
            <span>1600ms (Rollout)</span>
          </div>

          {/* Span Rows */}
          <div className="space-y-2">
            {filteredSpans.map((span) => {
              const isSelected = selectedSpan?.id === span.id;
              // Calculate percent offset and width
              const leftPct = Math.min(95, (span.startTimeMs / totalDurationMs) * 100);
              const widthPct = Math.max(3, Math.min(100 - leftPct, (span.durationMs / totalDurationMs) * 100));

              return (
                <div
                  key={span.id}
                  onClick={() => setSelectedSpan(span)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-neutral-950/80 border-neutral-800/80 hover:bg-neutral-900/60 hover:border-neutral-700'
                  }`}
                >
                  {/* Top line: Name, Service badge, Duration */}
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${getCategoryColor(span.category)}`}>
                        {span.category}
                      </span>
                      <span className="font-semibold text-white truncate text-[11px] font-mono">
                        {span.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] shrink-0 ml-2">
                      <span className="text-neutral-400">{span.durationMs}ms</span>
                      <span className={`w-2 h-2 rounded-full ${
                        span.status === 'AWAITING_HUMAN' ? 'bg-amber-400 animate-ping' :
                        span.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-red-400'
                      }`} />
                    </div>
                  </div>

                  {/* Horizontal Waterfall Bar */}
                  <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getBarColor(span.category, span.status)}`}
                      style={{
                        marginLeft: `${leftPct}%`,
                        width: `${widthPct}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Span Inspector Drawer (5 cols) */}
        <div className="lg:col-span-5 p-4 bg-neutral-950/90 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>SPAN INSPECTOR</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {selectedSpan ? selectedSpan.id : 'No span selected'}
            </span>
          </div>

          {selectedSpan ? (
            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 block mb-0.5">SPAN OPERATION:</span>
                <div className="font-mono text-emerald-300 font-bold bg-neutral-900 p-2 rounded-lg border border-neutral-800 break-all">
                  {selectedSpan.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <span className="text-neutral-500 block">SERVICE</span>
                  <strong className="text-white">{selectedSpan.service}</strong>
                </div>
                <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <span className="text-neutral-500 block">CATEGORY</span>
                  <strong className="text-emerald-400">{selectedSpan.category}</strong>
                </div>
                <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <span className="text-neutral-500 block">START OFFSET</span>
                  <strong className="text-white">+{selectedSpan.startTimeMs} ms</strong>
                </div>
                <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800">
                  <span className="text-neutral-500 block">DURATION</span>
                  <strong className="text-emerald-400">{selectedSpan.durationMs} ms</strong>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-neutral-400">STATUS:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedSpan.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    selectedSpan.status === 'AWAITING_HUMAN' ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse' :
                    'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {selectedSpan.status}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  {selectedSpan.status === 'AWAITING_HUMAN'
                    ? 'Execution pipeline safely halted by the Switch AI Safety Governor. An authorized engineer must click the button in chat before the patch is merged.'
                    : 'Span completed cleanly within strict real-time execution budget.'}
                </p>
              </div>

              {/* OpenTelemetry Attributes Key/Value Table */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-400 flex items-center justify-between">
                  <span>OPENTELEMETRY ATTRIBUTES:</span>
                  <span className="text-neutral-500">{Object.keys(selectedSpan.attributes).length} keys</span>
                </span>
                <div className="bg-neutral-900/90 rounded-lg border border-neutral-800 p-2.5 max-h-48 overflow-y-auto font-mono text-[10px] space-y-1.5">
                  {Object.entries(selectedSpan.attributes).map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-2 border-b border-neutral-800/60 pb-1">
                      <span className="text-neutral-400 truncate">{k}:</span>
                      <span className="text-emerald-300 font-semibold text-right break-all">
                        {Array.isArray(v) ? `[${v.join(', ')}]` : String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-500 text-xs">
              Select any span on the waterfall timeline to view its OpenTelemetry attributes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
