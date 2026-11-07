import React from 'react';
import { Github, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onScrollTo: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800/60">
          <div>
            <div className="flex items-center gap-2 text-white font-display font-bold text-base">
              <span>WeMakeDevs</span>
              <span className="text-neutral-500 font-normal">/</span>
              <span>Flip the Switch Hackathon</span>
            </div>
            <p className="text-neutral-400 text-xs mt-1">
              Building impactful open source developer workflows with AI coding agents and team channels.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
            <button onClick={() => onScrollTo('hero')} className="hover:text-emerald-400 transition-colors">
              Overview
            </button>
            <button onClick={() => onScrollTo('tracks')} className="hover:text-emerald-400 transition-colors">
              Tracks & Prizes
            </button>
            <button onClick={() => onScrollTo('simulator')} className="hover:text-emerald-400 transition-colors">
              Workflow Sandbox
            </button>
            <button onClick={() => onScrollTo('projects')} className="hover:text-emerald-400 transition-colors">
              Live Projects
            </button>
            <button onClick={() => onScrollTo('starter-kits')} className="hover:text-emerald-400 transition-colors">
              Starter Kits
            </button>
            <button onClick={() => onScrollTo('schedule')} className="hover:text-emerald-400 transition-colors">
              Schedule
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span>Powered by Switch AI & DevTools Academy</span>
            <span aria-hidden="true">·</span>
            <span>All participant submissions are 100% OSI Open Source</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wemakedevs"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://wemakedevs.org"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white transition-colors"
            >
              WeMakeDevs.org
            </a>
            <a
              href="https://devtoolsacademy.com"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white transition-colors"
            >
              DevTools Academy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
