import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { TracksAndPrizes } from './components/TracksAndPrizes';
import { ProjectShowcase } from './components/ProjectShowcase';
import { StarterKits } from './components/StarterKits';
import { ScheduleAndFaq } from './components/ScheduleAndFaq';
import { Footer } from './components/Footer';
import { SubmissionModal } from './components/SubmissionModal';
import { SoloHackerStudio } from './components/SoloHackerStudio';
import { GitHubRepoConnect } from './components/GitHubRepoConnect';
import { Leaderboard } from './components/Leaderboard';
import { GeminiChatbot } from './components/GeminiChatbot';
import { HowToRecordModal } from './components/HowToRecordModal';
import { INITIAL_PROJECTS } from './data/hackathonData';
import { Project } from './types/hackathon';
import { CheckCircle2, ArrowRight, ShieldCheck, Terminal, Users, Cpu } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isHowToRecordOpen, setIsHowToRecordOpen] = useState<boolean>(false);
  const [submissionDraft, setSubmissionDraft] = useState<Partial<Project> | null>(null);
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('switch_hackathon_projects');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PROJECTS;
  });

  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('switch_hackathon_upvotes');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // fallback
    }
    return new Set<string>();
  });

  // Keep dark class synced on root document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('switch_hackathon_projects', JSON.stringify(projects));
    } catch {
      // fallback
    }
  }, [projects]);

  // Persist upvotes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('switch_hackathon_upvotes', JSON.stringify(Array.from(userUpvotes)));
    } catch {
      // fallback
    }
  }, [userUpvotes]);

  const handleUpvote = (projectId: string) => {
    const updatedUpvotes = new Set(userUpvotes);
    const hasAlreadyUpvoted = updatedUpvotes.has(projectId);

    if (hasAlreadyUpvoted) {
      updatedUpvotes.delete(projectId);
    } else {
      updatedUpvotes.add(projectId);
    }
    setUserUpvotes(updatedUpvotes);

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            upvotes: hasAlreadyUpvoted ? Math.max(0, p.upvotes - 1) : p.upvotes + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    handleScrollTo('projects');
  };

  const handleOpenSubmitWithDraft = (draft: Partial<Project>) => {
    setSubmissionDraft(draft);
    setIsSubmitModalOpen(true);
  };

  const handleAttachRepoToSubmission = (repoData: {
    repoUrl: string;
    title: string;
    description: string;
    license: string;
    tagline: string;
  }) => {
    setSubmissionDraft({
      title: repoData.title,
      tagline: repoData.tagline,
      description: repoData.description,
      repoUrl: repoData.repoUrl,
      license: repoData.license,
      teamMembers: ['solo-developer'],
      teamName: 'Open Source Contributor',
      architecture: `GitHub Repository -> Switch AI Gateway -> Agent Harness -> Interactive Chat Channel`,
    });
    setIsSubmitModalOpen(true);
  };

  const handleOpenSubmit = () => {
    setSubmissionDraft(null);
    setIsSubmitModalOpen(true);
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSubmitModal={handleOpenSubmit}
        onOpenHowToRecord={() => setIsHowToRecordOpen(true)}
        onScrollTo={handleScrollTo}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
          onScrollTo={handleScrollTo}
        />

        {/* Why Switch & Open Source Vision Section */}
        <section id="overview" className="py-20 border-b border-neutral-800 bg-neutral-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Photo & Architecture showcase */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-xl group">
                  <img
                    src="/src/assets/images/switch_agent_teams_1794034552181.jpg"
                    alt="Engineers collaborating on AI agent workflows"
                    referrerPolicy="no-referrer"
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-xs text-neutral-300 space-y-1">
                    <span className="font-semibold text-white">From Isolated CLI to Team Orchestration</span>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Instead of one engineer staring at a terminal prompt, Switch turns agents into proactive team members that listen to webhooks, propose code in chat, and accept peer approvals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Text & Core Pillars */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
                    <span>The Core Problem & Breakthrough</span>
                    <span aria-hidden="true">·</span>
                    <span>Why We Built This Hackathon</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                    The next frontier of open source is autonomous team agents.
                  </h2>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    AI coding tools have transformed how individual developers write code. But software development is a team sport. Real engineering happens across pull request reviews, Slack incident channels, and staging deployments.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>01. Unshackle the Terminal</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                      Pipe Claude Code, Cursor, OpenCode, and Codex STDIN/STDOUT directly into team chat events using Switch’s low-latency streaming adapters.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>02. Human-in-the-Loop Safety Rails</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                      Every high-impact action—from opening a hotfix PR to rolling back an image—requires an explicit button approval from authorized engineers in chat.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Cpu className="w-4 h-4 text-emerald-400" />
                      <span>03. 100% Open Source Ecosystem</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                      All templates, tools, and submissions are published openly so any organization or maintainer worldwide can clone and run them.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleScrollTo('simulator')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect the interactive architecture simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tracks and Prizes */}
        <TracksAndPrizes onOpenSubmitModal={handleOpenSubmit} />

        {/* Solo Participant Sprint Studio & Code Scaffolder */}
        <SoloHackerStudio onOpenSubmitWithProject={handleOpenSubmitWithDraft} />

        {/* GitHub Repository Connect & Live Audit Tracker */}
        <GitHubRepoConnect
          onAttachToSubmission={handleAttachRepoToSubmission}
          onScrollTo={handleScrollTo}
        />

        {/* Interactive Architecture & Workflow Simulator */}
        <InteractiveSimulator />

        {/* Live Top 5 Project Leaderboard */}
        <Leaderboard
          projects={projects}
          onUpvote={handleUpvote}
          userUpvotes={userUpvotes}
          onSelectProject={() => handleScrollTo('projects')}
          onOpenSubmitModal={handleOpenSubmit}
        />

        {/* Live Project Showcase Gallery */}
        <ProjectShowcase
          projects={projects}
          onUpvote={handleUpvote}
          userUpvotes={userUpvotes}
          onOpenSubmitModal={handleOpenSubmit}
        />

        {/* Starter Kits & CLI Scaffolder */}
        <StarterKits />

        {/* Schedule, Mentors & FAQ */}
        <ScheduleAndFaq />
      </main>

      {/* Footer */}
      <Footer onScrollTo={handleScrollTo} />

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={handleAddProject}
        initialDraft={submissionDraft}
      />

      {/* How To Record Demo Video Modal */}
      <HowToRecordModal
        isOpen={isHowToRecordOpen}
        onClose={() => setIsHowToRecordOpen(false)}
      />

      {/* Gemini AI Multi-Turn Chatbot */}
      <GeminiChatbot />
    </div>
  );
}
