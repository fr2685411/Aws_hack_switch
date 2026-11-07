import React, { useState, useEffect } from 'react';
import { ArrowRight, Terminal, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenSubmitModal: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSubmitModal, onScrollTo }) => {
  // Target deadline: Nov 7, 2026 22:00:00 UTC
  const deadline = new Date('2026-11-07T22:00:00Z').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, deadline - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <section id="hero" className="relative pt-10 pb-20 border-b border-neutral-800/80 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-72 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-24 right-10 w-96 h-60 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Date & Organization Kicker */}
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-medium text-emerald-400 mb-6">
          <span>WeMakeDevs & DevTools Academy Present</span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span>Flip the Switch Hackathon</span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span className="text-neutral-300">November 4 – 7, 2026</span>
          <span className="text-neutral-600" aria-hidden="true">·</span>
          <span className="text-neutral-400">Online & Global</span>
        </div>

        {/* 2-Column Split: Headline & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              Bring AI coding agents out of the terminal and into team channels.
            </h1>

            <p className="text-lg text-neutral-300 font-normal leading-relaxed max-w-2xl">
              Terminal-based agents like Claude Code, Cursor, OpenCode, and Codex operate in silos.
              Use <strong className="text-white font-medium">Switch AI</strong> to connect these agents into Slack, Microsoft Teams, Discord, and Telegram to build collaborative open-source workflows that write code, review PRs, and triage production incidents.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onScrollTo('solo-studio')}
                className="px-5 py-3.5 text-base font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl transition-all shadow-md hover:shadow-emerald-500/25 flex items-center gap-2"
              >
                <span>Solo Hacker Launchpad</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onScrollTo('simulator')}
                className="px-5 py-3.5 text-base font-medium text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all flex items-center gap-2"
              >
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Test Workflow Simulator</span>
              </button>

              <button
                onClick={onOpenSubmitModal}
                className="px-4 py-3.5 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 rounded-xl transition-colors"
              >
                Submit Project
              </button>
            </div>

            {/* Micro Trust points */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-400 pt-3">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>$10,000 USD Prize Pool</span>
              </div>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <span>100% Permissive Open Source</span>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <span>Solo or Teams of up to 4</span>
              <span className="text-neutral-700" aria-hidden="true">·</span>
              <span>Free Switch AI Sandbox Credits</span>
            </div>
          </div>

          {/* Right Visual Carrier with Scrim & Real Hackathon Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/src/assets/images/hackathon_hero_stage_1794034551571.jpg"
                alt="Hackathon developers collaborating on open-source code"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 inset-x-0 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-300 font-mono">
                  <span>HACKATHON IN PROGRESS</span>
                  <span className="text-emerald-400 font-semibold">STAGE: SPRINT & SUBMIT</span>
                </div>
                <div className="p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 space-y-2">
                  <div className="text-xs text-neutral-400">Submission Window Closes In:</div>
                  <div className="grid grid-cols-4 gap-2 text-center font-mono tabular-nums">
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800/80">
                      <div className="text-xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Days</div>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800/80">
                      <div className="text-xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Hours</div>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800/80">
                      <div className="text-xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Mins</div>
                    </div>
                    <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800/80">
                      <div className="text-xl font-bold text-emerald-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Secs</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-neutral-400 text-center pt-1">
                    Final cutoff: Saturday, Nov 7, 2026 at 22:00 UTC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/60 text-sm">
          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="text-xs text-neutral-400 mb-1">Total Prize Pool</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">$10,000 USD</div>
            <div className="text-xs text-neutral-500 mt-1">Cash, grants & swag</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="text-xs text-neutral-400 mb-1">Community Reach</div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">300,000+</div>
            <div className="text-xs text-neutral-500 mt-1">Developers worldwide</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="text-xs text-neutral-400 mb-1">Supported Platforms</div>
            <div className="text-2xl font-bold text-white font-mono">Slack · Discord</div>
            <div className="text-xs text-neutral-500 mt-1">MS Teams & Telegram</div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="text-xs text-neutral-400 mb-1">Supported Agents</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">Claude · Cursor</div>
            <div className="text-xs text-neutral-500 mt-1">OpenCode, Codex, MCP</div>
          </div>
        </div>
      </div>
    </section>
  );
};
