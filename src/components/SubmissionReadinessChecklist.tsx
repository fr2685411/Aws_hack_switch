import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ShieldCheck, 
  Video, 
  Github, 
  Cpu, 
  Trophy, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ExternalLink, 
  RefreshCw, 
  Bot, 
  Check 
} from 'lucide-react';
import { Project } from '../types/hackathon';

export interface ChecklistCriterion {
  id: string;
  title: string;
  description: string;
  category: 'code' | 'video' | 'architecture' | 'safety' | 'track' | 'integration';
  weight: number;
  whyCritical: string;
}

export const HACKATHON_CRITERIA: ChecklistCriterion[] = [
  {
    id: 'crit-github',
    title: 'Public GitHub Repo with OSI License',
    description: 'Repository must be public and contain a valid LICENSE file (MIT or Apache 2.0).',
    category: 'code',
    weight: 20,
    whyCritical: 'Required for open-source judging. Projects without an OSI license are disqualified.',
  },
  {
    id: 'crit-video',
    title: '90–120s Live Video Demo URL',
    description: 'Public link (YouTube, Loom, or Vimeo) demonstrating chat interaction and human approval.',
    category: 'video',
    weight: 20,
    whyCritical: 'Judges evaluate the live video demo to verify autonomous agent execution in chat.',
  },
  {
    id: 'crit-architecture',
    title: 'Architecture & Event Flow Described',
    description: 'README and submission detailing: Webhook -> Switch AI Gateway -> Agent -> Chat Card.',
    category: 'architecture',
    weight: 15,
    whyCritical: 'Ensures clear system design and reproducibility for the open source community.',
  },
  {
    id: 'crit-human-safety',
    title: 'Human-in-the-Loop Safety Rail Verified',
    description: 'Interactive button component in Discord/Slack requiring human sign-off before changes execute.',
    category: 'safety',
    weight: 20,
    whyCritical: 'Core Hackathon Rule: Autonomous agents must never deploy code without explicit human consent.',
  },
  {
    id: 'crit-track',
    title: 'Specific Hackathon Track Selected',
    description: 'Project aligned with Incident Response ($3k), PR Copilot ($2.5k), Automation ($2.5k), or Community ($1k).',
    category: 'track',
    weight: 10,
    whyCritical: 'Prizes are awarded per track category; unassigned projects default to general pool.',
  },
  {
    id: 'crit-switch-sdk',
    title: 'Switch AI Gateway Integration Operational',
    description: 'Live bot or webhook endpoint connecting terminal agent to Discord, Slack, Teams, or Telegram.',
    category: 'integration',
    weight: 15,
    whyCritical: 'The core theme of "Flip the Switch" is taking agents out of CLI windows into chat.',
  },
];

interface SubmissionReadinessChecklistProps {
  onOpenSubmitModal: () => void;
  onOpenSubmitWithProject?: (projectDraft: Partial<Project>) => void;
  onScrollTo?: (sectionId: string) => void;
}

export const SubmissionReadinessChecklist: React.FC<SubmissionReadinessChecklistProps> = ({
  onOpenSubmitModal,
  onOpenSubmitWithProject,
  onScrollTo,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('switch_submission_readiness');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default sensible state
    return {
      'crit-github': true,
      'crit-architecture': true,
      'crit-human-safety': true,
      'crit-track': true,
      'crit-switch-sdk': true,
      'crit-video': false,
    };
  });

  const [activeCriterionId, setActiveCriterionId] = useState<string>('crit-human-safety');
  const [prefilledSuccess, setPrefilledSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('switch_submission_readiness', JSON.stringify(checkedItems));
    } catch {}
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (checkAll: boolean) => {
    const updated: Record<string, boolean> = {};
    HACKATHON_CRITERIA.forEach((c) => {
      updated[c.id] = checkAll;
    });
    setCheckedItems(updated);
  };

  // Calculate score
  const totalScore = HACKATHON_CRITERIA.reduce((acc, item) => {
    return acc + (checkedItems[item.id] ? item.weight : 0);
  }, 0);

  const completedCount = HACKATHON_CRITERIA.filter((c) => checkedItems[c.id]).length;
  const isFullyReady = totalScore === 100;

  const activeCriterion = HACKATHON_CRITERIA.find((c) => c.id === activeCriterionId) || HACKATHON_CRITERIA[0];

  const handleQuickPreFill = () => {
    if (onOpenSubmitWithProject) {
      onOpenSubmitWithProject({
        title: 'FireSwitch: Kotlin & Firebase Collaborative Agent',
        tagline: 'Autonomous Kotlin daemon listening to Switch alerts with real-time Firestore sync and human approval cards.',
        description: 'Connects terminal Kotlin Coroutine agents with Discord and Slack. Features an interactive AST diagnostic embed with human-in-the-loop sign-off buttons before code merges.',
        teamName: 'FireSwitch Solo Team',
        teamMembers: ['Developer (Solo)'],
        repoUrl: 'https://github.com/wemakedevs/switch-kotlin-firebase-starter',
        demoUrl: 'https://loom.com/share/switch-hackathon-demo-sample',
        agentHarness: 'Kotlin / Firebase Agent',
        chatPlatform: 'Discord',
        trackId: 'incident-response',
        license: 'MIT',
        architecture: 'Discord Gateway Webhook -> Switch AI Gateway -> Kotlin Coroutine Daemon -> Cloud Firestore -> Discord Embed with [Approve & Execute] Button',
      });
      setPrefilledSuccess(true);
      setTimeout(() => setPrefilledSuccess(false), 2500);
    } else {
      onOpenSubmitModal();
    }
  };

  return (
    <section id="readiness-checklist" className="py-20 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>COMPLIANCE & READINESS AUDIT</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-300">$10,000 USD Prize Qualification</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Submission Readiness Checklist
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Verify that your hackathon submission meets every judging criterion. Complete all 6 requirements to unlock full scoring potential for track prizes and the $1,000 Community Choice Award.
            </p>
          </div>

          {/* Real-time Readiness Score Gauge */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4 shrink-0 shadow-lg">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-neutral-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`transition-all duration-500 ${isFullyReady ? 'text-emerald-400' : 'text-amber-400'}`}
                  strokeDasharray={`${totalScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-mono text-base font-bold text-white">{totalScore}%</span>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase text-neutral-400 font-semibold">
                Audit Status:
              </div>
              <div className={`text-sm font-bold ${isFullyReady ? 'text-emerald-400' : 'text-amber-300'}`}>
                {isFullyReady ? 'QUALIFIED FOR PRIZES ✓' : `${completedCount}/6 CRITERIA MET`}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono">
                {isFullyReady ? 'Ready for Nov 7 Deadline' : 'Complete video to qualify'}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Interactive Criteria Checklist & Detailed Reviewer Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Criteria Checkboxes (Col 7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Official Hackathon Requirements
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => handleSelectAll(true)}
                  className="text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  Check All
                </button>
                <span className="text-neutral-600">·</span>
                <button
                  onClick={() => handleSelectAll(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2.5">
              {HACKATHON_CRITERIA.map((criterion) => {
                const isChecked = !!checkedItems[criterion.id];
                const isSelected = activeCriterionId === criterion.id;

                return (
                  <div
                    key={criterion.id}
                    onClick={() => setActiveCriterionId(criterion.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-neutral-900 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                        : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleItem(criterion.id);
                        }}
                        className="mt-0.5 shrink-0 focus:outline-none"
                        aria-label={`Toggle ${criterion.title}`}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-neutral-600 hover:text-neutral-400 transition-colors" />
                        )}
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-bold ${isChecked ? 'text-white' : 'text-neutral-300'}`}>
                            {criterion.title}
                          </h4>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-950 text-neutral-400 border border-neutral-800">
                            +{criterion.weight} pts
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-snug">
                          {criterion.description}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 uppercase ${
                      isChecked
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-neutral-950 text-neutral-500 border border-neutral-800'
                    }`}>
                      {isChecked ? 'MET' : 'PENDING'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800">
              <span className="text-xs text-neutral-400 font-mono">
                Weighting: Code (40%) • Safety (20%) • Video (20%) • Design (20%)
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleQuickPreFill}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{prefilledSuccess ? 'Pre-filled!' : 'Submit Verified Project'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Inspector Card for Selected Criterion (Col 5) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 sticky top-24">
            <div className="space-y-1 border-b border-neutral-800 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                  Criterion Deep Dive
                </span>
                <span className="text-xs font-mono text-neutral-500">
                  Weight: {activeCriterion.weight}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                {activeCriterion.title}
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-semibold text-neutral-200">
                  Why Judges Require This:
                </div>
                <p className="text-neutral-400">
                  {activeCriterion.whyCritical}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <div className="font-semibold text-neutral-200">
                  Specification Checklist:
                </div>
                <p className="text-neutral-400">
                  {activeCriterion.description}
                </p>
              </div>
            </div>

            {/* Contextual Action Link based on selected criterion */}
            <div className="pt-2">
              {activeCriterion.id === 'crit-video' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('hero')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-4 h-4" />
                  <span>Open Video Recording Teleprompter & Guide</span>
                </button>
              )}

              {activeCriterion.id === 'crit-github' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('github-integration')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>Audit Your GitHub Repo with Live Linter</span>
                </button>
              )}

              {activeCriterion.id === 'crit-human-safety' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('simulator')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Test Human Approval in Workflow Sandbox</span>
                </button>
              )}

              {activeCriterion.id === 'crit-track' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('tracks')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Explore 4 Prize Tracks & Awards</span>
                </button>
              )}

              {activeCriterion.id === 'crit-switch-sdk' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('workflow-3d')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Inspect 3D Switch AI Workflow Simulator</span>
                </button>
              )}

              {activeCriterion.id === 'crit-architecture' && (
                <button
                  onClick={() => onScrollTo && onScrollTo('solo-studio')}
                  className="w-full py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
                >
                  <Layers className="w-4 h-4" />
                  <span>Scaffold Complete Architecture in Solo Studio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
