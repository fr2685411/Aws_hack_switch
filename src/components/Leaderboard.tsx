import React from 'react';
import { Project } from '../types/hackathon';
import { Trophy, ThumbsUp, Github, ExternalLink, ArrowUpRight, Flame, Medal } from 'lucide-react';

interface LeaderboardProps {
  projects: Project[];
  onUpvote: (projectId: string) => void;
  userUpvotes: Set<string>;
  onSelectProject: (project: Project) => void;
  onOpenSubmitModal: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  projects,
  onUpvote,
  userUpvotes,
  onSelectProject,
  onOpenSubmitModal,
}) => {
  // Sort projects by upvotes descending and take top 5
  const topProjects = [...projects]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  const getRankBadge = (rankIndex: number) => {
    switch (rankIndex) {
      case 0:
        return {
          numeral: '01',
          label: 'Champion',
          color: 'text-amber-400',
          borderColor: 'border-amber-500/50',
          bgColor: 'bg-amber-950/20',
          iconColor: 'text-amber-400',
        };
      case 1:
        return {
          numeral: '02',
          label: '2nd Place',
          color: 'text-neutral-200',
          borderColor: 'border-neutral-600/60',
          bgColor: 'bg-neutral-900/60',
          iconColor: 'text-neutral-300',
        };
      case 2:
        return {
          numeral: '03',
          label: '3rd Place',
          color: 'text-amber-600',
          borderColor: 'border-amber-700/50',
          bgColor: 'bg-amber-950/10',
          iconColor: 'text-amber-600',
        };
      default:
        return {
          numeral: `0${rankIndex + 1}`,
          label: `Rank ${rankIndex + 1}`,
          color: 'text-neutral-400',
          borderColor: 'border-neutral-800',
          bgColor: 'bg-neutral-900/40',
          iconColor: 'text-neutral-500',
        };
    }
  };

  return (
    <section id="leaderboard" className="py-20 border-b border-neutral-800 bg-neutral-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <Trophy className="w-4 h-4" />
              <span>LIVE COMMUNITY STANDINGS</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-neutral-300">$1,000 USD Community Choice Award</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Top 5 Project Leaderboard
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Ranked in real time by community votes. The highest-voted open-source agent project at the Nov 7 deadline wins the Community Choice Prize.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={onOpenSubmitModal}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Submit Your Project to Compete</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Leaderboard Stack */}
        <div className="space-y-3">
          {topProjects.map((project, index) => {
            const rank = getRankBadge(index);
            const hasUpvoted = userUpvotes.has(project.id);

            return (
              <div
                key={project.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                  index === 0
                    ? 'bg-neutral-900/90 border-amber-500/40 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/20'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Left: Rank & Title & Unboxed Metadata */}
                <div className="flex items-start md:items-center gap-4">
                  {/* Rank Indicator */}
                  <div
                    className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-mono shrink-0 ${rank.bgColor} ${rank.borderColor}`}
                  >
                    <span className={`text-base font-bold ${rank.color} tabular-nums`}>
                      {rank.numeral}
                    </span>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-wider font-sans">
                      {rank.label}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <h3
                        onClick={() => onSelectProject(project)}
                        className="text-base font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>
                      {index === 0 && (
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
                          CURRENT LEADER
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-300 line-clamp-1">
                      {project.tagline}
                    </p>

                    {/* Unboxed Metadata (§1.A) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 font-mono pt-0.5">
                      <span>Team: <strong className="text-neutral-200">{project.teamName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{project.chatPlatform}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400">{project.agentHarness}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.license}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Real-time Upvote & Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800 shrink-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-emerald-400 transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Upvote Button with live feedback */}
                  <button
                    onClick={() => onUpvote(project.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-medium transition-all ${
                      hasUpvoted
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/10'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                    }`}
                    title={hasUpvoted ? 'Remove your vote' : 'Vote for this project'}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current text-emerald-400' : ''}`} />
                    <span className="tabular-nums font-bold text-sm">{project.upvotes}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                      {hasUpvoted ? 'Voted' : 'Vote'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Incentive Footer Notice */}
        <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Voting is open to all community members until <strong>November 7, 2026, 22:00 UTC</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            Audit ID: SWITCH-VOTE-2026
          </span>
        </div>
      </div>
    </section>
  );
};
