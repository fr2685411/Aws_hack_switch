import React, { useState } from 'react';
import { SCHEDULE_EVENTS, MENTORS_JUDGES, FAQS } from '../data/hackathonData';
import { Calendar, ChevronDown, ChevronUp, Github, Users, HelpCircle, Clock } from 'lucide-react';

export const ScheduleAndFaq: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const days = ['All', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];

  const filteredEvents =
    selectedDay === 'All'
      ? SCHEDULE_EVENTS
      : SCHEDULE_EVENTS.filter((e) => e.day === selectedDay);

  return (
    <section id="schedule" className="py-20 border-b border-neutral-800 bg-neutral-950/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Schedule Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
                <span>Agenda & Milestones</span>
                <span aria-hidden="true">·</span>
                <span>November 4 – 7, 2026</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Hackathon Schedule
              </h2>
              <p className="text-neutral-400 text-sm max-w-2xl">
                Tune in to live architectural workshops, mentor breakout hours, and the closing demo day ceremony.
              </p>
            </div>

            {/* Day Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedDay === d
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline List */}
          <div className="space-y-3">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  {/* Unboxed event metadata (§1.A) */}
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                    <span className="text-emerald-400 font-bold">{evt.day}</span>
                    <span aria-hidden="true">·</span>
                    <span>{evt.dateStr}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-neutral-300 font-semibold">{evt.timeStr}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="text-xs text-neutral-400 font-medium shrink-0 md:text-right">
                  <div className="text-neutral-300 font-semibold">{evt.speaker}</div>
                  <div className="text-[11px] text-neutral-500 uppercase tracking-wider mt-0.5">
                    {evt.type.replace('-', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mentors & Judges Section */}
        <div>
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
              <span>Guidance & Review</span>
              <span aria-hidden="true">·</span>
              <span>Open Source Champions</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Mentors & Judges
            </h2>
            <p className="text-neutral-400 text-sm">
              Engineers and community leaders providing feedback, evaluating submissions, and reviewing project architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MENTORS_JUDGES.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3"
              >
                <div>
                  <h3 className="text-base font-bold text-white">
                    {m.name}
                  </h3>
                  <div className="text-xs text-emerald-400 font-medium">
                    {m.role} · {m.organization}
                  </div>
                </div>

                <p className="text-xs text-neutral-300">
                  {m.expertise}
                </p>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                  <span className="font-mono text-[11px]">@{m.githubHandle}</span>
                  <a
                    href={`https://github.com/${m.githubHandle}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Accordions */}
        <div>
          <div className="max-w-2xl mb-8">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-2">
              <span>Common Questions</span>
              <span aria-hidden="true">·</span>
              <span>Rules & Guidelines</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-sm">
              Everything you need to know about submissions, open source licensing, team limits, and judging.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
