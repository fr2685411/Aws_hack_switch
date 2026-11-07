import React, { useState } from 'react';
import { STARTER_KITS } from '../data/hackathonData';
import { Copy, Check, Terminal, ExternalLink, Star, ArrowRight } from 'lucide-react';

export const StarterKits: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cliInput, setCliInput] = useState('switch init my-open-agent --harness claude-code --platform slack');
  const [cliOutput, setCliOutput] = useState<string | null>(null);

  const handleCopy = (id: string, command: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunCli = (e: React.FormEvent) => {
    e.preventDefault();
    setCliOutput(
      `✔ Validating Switch AI credentials...\n✔ Scaffolding repository template (TypeScript + Node 22)...\n✔ Configuring agent runtime harness: Claude Code CLI\n✔ Initializing Slack Block Kit interactive message handlers...\n✔ Adding MCP server definitions: @modelcontextprotocol/server-filesystem\n\n🎉 Done! Created my-open-agent at ./my-open-agent\nInside that directory, you can run:\n\n  npm install\n  npm run dev\n\nReady for WeMakeDevs Flip the Switch Hackathon! 🚀`
    );
  };

  return (
    <section id="starter-kits" className="py-20 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
            <span>Developer Quickstarts & SDKs</span>
            <span aria-hidden="true">·</span>
            <span>Zero to Running in 60s</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Open Source Starter Kits & Templates
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Jumpstart your hackathon project in minutes with official templates configured with Switch AI SDK, chat platform listeners, and agent terminal bridges.
          </p>
        </div>

        {/* 2-Column Split: Kits Grid + Community Visual / CLI Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Starter Kit Cards */}
          <div className="lg:col-span-7 space-y-4">
            {STARTER_KITS.map((kit) => (
              <div
                key={kit.id}
                className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {kit.title}
                    </h3>
                    {/* Unboxed metadata (§1.A) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                      <span>Agent: <strong className="text-emerald-400">{kit.agent}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Platform: <strong className="text-neutral-200">{kit.platform}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {kit.stars}
                      </span>
                    </div>
                  </div>

                  <a
                    href={kit.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    title="View GitHub repository"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {kit.description}
                </p>

                {/* One click copy command */}
                <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300">
                  <span className="truncate selection:bg-emerald-500/30">
                    {kit.terminalCommand}
                  </span>
                  <button
                    onClick={() => handleCopy(kit.id, kit.terminalCommand)}
                    className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-emerald-400 transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedId === kit.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Community Visual + Interactive Scaffolder */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Photo Card */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 group">
              <img
                src="/src/assets/images/opensource_community_collab_1794034552463.jpg"
                alt="Open source developers collaborating"
                referrerPolicy="no-referrer"
                className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-xs text-neutral-300">
                <span className="font-semibold text-white">Global Open Source Collaboration</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Connect with mentors and peer teams on Discord to pair program and test bot permissions.
                </p>
              </div>
            </div>

            {/* Interactive CLI Scaffolder */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-mono text-neutral-300">Switch CLI Scaffolder</span>
                </div>
                <span className="text-[11px] font-mono text-neutral-500">v2.4.0</span>
              </div>

              <div className="p-4 space-y-3">
                <form onSubmit={handleRunCli} className="space-y-2">
                  <label className="text-[11px] text-neutral-400 font-medium">
                    Try CLI Command:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-lg text-emerald-300 outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap"
                    >
                      Run
                    </button>
                  </div>
                </form>

                {cliOutput && (
                  <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 whitespace-pre leading-relaxed animate-in fade-in duration-300">
                    {cliOutput}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
