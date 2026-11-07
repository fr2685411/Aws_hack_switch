import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Video, Download } from 'lucide-react';
import { downloadStarterPackageZip } from '../utils/starterZip';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSubmitModal: () => void;
  onOpenHowToRecord: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenSubmitModal,
  onOpenHowToRecord,
  onScrollTo,
}) => {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadStarterPackageZip();
    } catch (e) {
      console.error('Failed to generate starter zip:', e);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-neutral-950/85 dark:bg-neutral-950/85 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onScrollTo('hero')}
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="font-display font-extrabold tracking-tighter bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            WeMakeDevs
          </span>
          <span className="text-neutral-500 font-light">/</span>
          <span className="text-neutral-200 font-display font-semibold">Switch</span>
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onScrollTo('overview')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </button>
          <button
            onClick={() => onScrollTo('tracks')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Tracks & Prizes
          </button>
          <button
            onClick={() => onScrollTo('solo-studio')}
            className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Solo Studio</span>
          </button>
          <button
            onClick={() => onScrollTo('simulator')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Workflow Sandbox
          </button>
          <button
            onClick={() => onScrollTo('workflow-3d')}
            className="hover:text-emerald-400 text-emerald-400 font-semibold transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>3D Workflow</span>
          </button>
          <button
            onClick={() => onScrollTo('github-integration')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>GitHub Connect</span>
          </button>
          <button
            onClick={() => onScrollTo('mesh-map')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-cyan-400"
          >
            <span>Global Mesh</span>
          </button>
          <button
            onClick={() => onScrollTo('leaderboard')}
            className="text-amber-400 font-medium hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Leaderboard</span>
          </button>
          <button
            onClick={() => onScrollTo('readiness-checklist')}
            className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Readiness</span>
          </button>
          <button
            onClick={() => onScrollTo('projects')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Live Projects
          </button>
          <button
            onClick={() => onScrollTo('starter-kits')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Starter Kits
          </button>
          <button
            onClick={() => onScrollTo('schedule')}
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            Schedule
          </button>
        </nav>

        {/* Zone 3: 1 primary action button + utility toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-neutral-300" />}
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/80 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            title="Download ready-to-run Discord Bot & Kotlin/Firebase Agent Starter ZIP"
          >
            <Download className={`w-3.5 h-3.5 text-emerald-400 ${isDownloadingZip ? 'animate-bounce' : ''}`} />
            <span>{isDownloadingZip ? 'Zipping...' : 'Download Starter ZIP'}</span>
          </button>

          <button
            onClick={onOpenHowToRecord}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="How to record your submission video"
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">How to Record</span>
          </button>

          <button
            onClick={onOpenSubmitModal}
            className="px-3.5 py-2 text-xs sm:text-sm font-medium text-neutral-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-lg transition-all shadow-sm hover:shadow-emerald-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submit Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};
