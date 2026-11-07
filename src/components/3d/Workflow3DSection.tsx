import React, { useState } from 'react';
import { Switch3DScene } from './Switch3DScene';
import { Bot, Workflow, Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';

export const Workflow3DSection: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  return (
    <section id="workflow-3d" className="py-20 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <Bot className="w-4 h-4" />
              <span>PLAYABLE 3D WORKFLOW SIMULATOR</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-neutral-300">Live Interactive Agent Game</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Pilot the Switch Agent & Test Live Workflows in 3D
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Pilot your autonomous Switch coding robot directly using <kbd className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono">WASD</kbd> or on-screen controls. Complete missions across 4 interactive stations: receive Discord webhooks, spawn Kotlin AST triage, step onto the Human-in-the-Loop console to approve patches, and deploy hotfixes to earn XP.
            </p>
          </div>

          {/* Quick Legend Tags */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span>FireSwitch (Kotlin)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d97706]" />
              <span>Claude Code</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4]" />
              <span>Cursor Copilot</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d946ef]" />
              <span>OpenCode Bot</span>
            </div>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <Switch3DScene 
          isFullScreen={isFullScreen} 
          onToggleFullScreen={() => setIsFullScreen(!isFullScreen)} 
        />

        {/* 3-Column Architectural Spec Below Viewport */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>1. Zero-Latency Event Routing</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Inbound webhooks and bot mentions from Discord or Slack are ingested by Switch Gateway, serialized, and routed via WebSocket or gRPC to the agent process.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>2. Human-in-the-Loop Gateway Lock</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No code or deployment mutations execute autonomously. The agent returns an interactive action card into chat requiring explicit developer sign-off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>3. Cloud Firestore State Sync</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              All triage proposals, approval timestamps, and git commit hashes are saved to Firebase Firestore for continuous compliance and audit logging.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
