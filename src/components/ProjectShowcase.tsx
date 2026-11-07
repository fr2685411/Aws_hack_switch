import React, { useState } from 'react';
import { Project, ChatPlatform, AgentHarness } from '../types/hackathon';
import { Search, ThumbsUp, Github, ExternalLink, Filter, Layers, Code, Check } from 'lucide-react';

interface ProjectShowcaseProps {
  projects: Project[];
  onUpvote: (id: string) => void;
  userUpvotes: Set<string>;
  onOpenSubmitModal: () => void;
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({
  projects,
  onUpvote,
  userUpvotes,
  onOpenSubmitModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [harnessFilter, setHarnessFilter] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'all' || p.chatPlatform === platformFilter;
    const matchesHarness = harnessFilter === 'all' || p.agentHarness === harnessFilter;

    return matchesSearch && matchesPlatform && matchesHarness;
  });

  return (
    <section id="projects" className="py-20 border-b border-neutral-800 bg-neutral-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
              <span>Open Source Gallery</span>
              <span aria-hidden="true">·</span>
              <span>Live Community Submissions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              Impactful Open Source Projects
            </h2>
            <p className="text-neutral-400 text-sm max-w-2xl">
              Explore public agent tools created by developers in this hackathon. Check out their open source GitHub repos, test demos, and vote for the Community Choice prize.
            </p>
          </div>

          <button
            onClick={onOpenSubmitModal}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start md:self-end"
          >
            + Add Your Submission
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects, authors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-white placeholder-neutral-500 outline-none transition-colors"
              />
            </div>

            {/* Platform Segmented Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              {['all', 'Slack', 'Discord', 'Microsoft Teams', 'Telegram'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setPlatformFilter(plat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    platformFilter === plat
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {plat === 'all' ? 'All Channels' : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Filter: Agent Harness */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400 overflow-x-auto">
            <span className="font-medium text-neutral-300 whitespace-nowrap shrink-0">Filter by Agent:</span>
            {['all', 'Claude Code', 'Cursor', 'OpenCode', 'Codex', 'Antigravity'].map((agent) => (
              <button
                key={agent}
                onClick={() => setHarnessFilter(agent)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                  harnessFilter === agent
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {agent === 'all' ? 'Any Agent' : agent}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <p className="text-neutral-400 text-sm mb-4">No projects match your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
                setHarnessFilter('all');
              }}
              className="px-4 py-2 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-lg"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const hasUpvoted = userUpvotes.has(project.id);
              return (
                <div
                  key={project.id}
                  className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Header line: Title & Upvote */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                          {project.tagline}
                        </p>
                      </div>

                      <button
                        onClick={() => onUpvote(project.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium transition-all ${
                          hasUpvoted
                            ? 'bg-emerald-950 border-emerald-600 text-emerald-400 font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                        }`}
                        title={hasUpvoted ? 'You upvoted this' : 'Upvote project'}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current text-emerald-400' : ''}`} />
                        <span className="tabular-nums">{project.upvotes}</span>
                      </button>
                    </div>

                    {/* Unboxed Metadata (Zero-Pill discipline §1.A) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 pt-1">
                      <span>Team: <strong className="text-neutral-300">{project.teamName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{project.chatPlatform}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400">{project.agentHarness}</span>
                      <span aria-hidden="true">·</span>
                      <span>{project.license}</span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-5 mt-4 border-t border-neutral-800/70 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveModalProject(project)}
                      className="text-neutral-300 hover:text-emerald-400 font-medium transition-colors"
                    >
                      View Architecture →
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="p-1.5 text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 rounded-lg transition-colors"
                          title="View Live Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal for viewing project architecture */}
        {activeModalProject && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full rounded-2xl bg-neutral-900 border border-neutral-700 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    {activeModalProject.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {activeModalProject.tagline}
                  </p>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800"
                >
                  ✕
                </button>
              </div>

              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span>By <strong className="text-white">{activeModalProject.teamName}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Members: {activeModalProject.teamMembers.join(', ')}</span>
                <span aria-hidden="true">·</span>
                <span>{activeModalProject.license} License</span>
                <span aria-hidden="true">·</span>
                <span>Submitted {activeModalProject.submittedAt}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Project Description
                </h4>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {activeModalProject.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Architecture & Switch AI Integration</span>
                </h4>
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-emerald-300 leading-relaxed">
                  {activeModalProject.architecture}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-3">
                  <a
                    href={activeModalProject.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-4 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repo</span>
                  </a>
                  {activeModalProject.demoUrl && (
                    <a
                      href={activeModalProject.demoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-4 py-2 text-xs font-medium text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live Demo / Video</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    onUpvote(activeModalProject.id);
                  }}
                  className="px-4 py-2 text-xs font-mono font-medium rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-200 hover:text-white flex items-center gap-2"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Upvote ({activeModalProject.upvotes})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
