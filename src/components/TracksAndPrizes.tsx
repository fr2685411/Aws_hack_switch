import React, { useState } from 'react';
import { TRACKS, PRIZES } from '../data/hackathonData';
import { TrackId } from '../types/hackathon';
import { Trophy, CheckCircle2, Lightbulb, ArrowUpRight } from 'lucide-react';

interface TracksAndPrizesProps {
  onOpenSubmitModal: () => void;
}

export const TracksAndPrizes: React.FC<TracksAndPrizesProps> = ({ onOpenSubmitModal }) => {
  const [activeTrackId, setActiveTrackId] = useState<TrackId>('incident-response');

  const selectedTrack = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];

  return (
    <section id="tracks" className="py-20 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
              <span>Challenge Categories & Rewards</span>
              <span aria-hidden="true">·</span>
              <span>$10,000 USD Prize Pool</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Four tracks designed for real-world open source impact.
            </h2>
            <p className="text-neutral-400 text-base leading-relaxed">
              Every track targets a critical friction point where software engineers and open-source maintainers lose hours. Connect your terminal agent to solve these challenges.
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 self-start md:self-end"
          >
            <span>Submit to Track</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Prize Pool Spotlight Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-14">
          {PRIZES.map((prize, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                  : 'bg-neutral-900/60 border-neutral-800'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-2">
                <Trophy className={`w-3.5 h-3.5 ${idx === 0 ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span className="truncate">{prize.rank}</span>
              </div>
              <div className="text-xl font-bold font-mono text-white mb-1.5 tabular-nums">
                {prize.amount}
              </div>
              <p className="text-[12px] text-neutral-400 leading-snug line-clamp-2">
                {prize.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Track Selector & Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Track Navigation */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select Track
            </div>

            {TRACKS.map((track, i) => {
              const isSelected = track.id === activeTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrackId(track.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-neutral-900 border-emerald-400 shadow-md'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-neutral-400">Track 0{i + 1}</span>
                    <span className="font-mono font-bold text-emerald-400">{track.prizeAmount}</span>
                  </div>
                  <h3 className={`text-sm font-semibold mb-1 ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                    {track.title}
                  </h3>
                  <div className="text-xs text-neutral-400 line-clamp-1">
                    {track.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Track Deep-Dive */}
          <div className="lg:col-span-8 p-6 md:p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">
                  CATEGORY BOUNTY: {selectedTrack.prizeAmount}
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  {selectedTrack.title}
                </h3>
              </div>
              <div className="text-xs text-neutral-400">
                Open Source Requirement: OSI Approved
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {selectedTrack.description}
            </p>

            {/* Judging Criteria */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Evaluation Criteria
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTrack.judgingCriteria.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300 p-3 rounded-lg bg-neutral-950 border border-neutral-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Starter Ideas */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Inspirational Project Ideas</span>
              </h4>
              <div className="space-y-2">
                {selectedTrack.suggestedIdeas.map((idea, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/60 text-xs text-neutral-300">
                    <strong className="text-emerald-300">{idea.split(':')[0]}:</strong>
                    <span>{idea.substring(idea.indexOf(':') + 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Callout Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-neutral-950 to-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
              <div className="text-xs text-neutral-400">
                Ready to build for this track? Check out the starter kits or register your project submission.
              </div>
              <button
                onClick={onOpenSubmitModal}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Submit This Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
