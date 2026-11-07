import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Monitor, 
  Mic, 
  FileCode, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { AgentHarness, ChatPlatform } from '../types/hackathon';

interface HowToRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToRecordModal: React.FC<HowToRecordModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'script' | 'tools' | 'checklist'>('timeline');
  const [copiedScript, setCopiedScript] = useState(false);

  // Script customizer state
  const [customProjectName, setCustomProjectName] = useState('IncidentPulse');
  const [customPlatform, setCustomPlatform] = useState<ChatPlatform>('Discord');
  const [customHarness, setCustomHarness] = useState<AgentHarness>('Claude Code');

  // Pre-flight checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'prep-1': true,
    'prep-2': true,
    'prep-3': false,
    'prep-4': false,
    'prep-5': false,
  });

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const spokenScript = `Hi judges and WeMakeDevs community! I am hacking solo on ${customProjectName} for the Flip the Switch Hackathon.

The Problem: AI coding agents usually sit trapped inside isolated terminal windows. When issues happen, developers must manually copy logs back and forth.

The Solution: I connected ${customHarness} directly into ${customPlatform} using Switch AI. 

Watch this live flow:
1. Here in ${customPlatform}, I trigger our agent with an alert or prompt.
2. Switch AI intercepts the event and routes the repository context to our agent worker.
3. The agent diagnoses the root cause and posts an interactive card with a verified code diff.
4. Critically, we require Human-in-the-Loop verification—I click this "Approve & Merge" button right here in chat.
5. The fix is atomically verified and committed.

Our project is 100% open source under an MIT license. The GitHub repository includes complete setup instructions and architecture documentation. Thanks for watching!`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(spokenScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full rounded-2xl bg-neutral-900 border border-neutral-700 p-6 md:p-8 space-y-6 my-8 max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <Video className="w-4 h-4" />
              <span>JUDGES DEMO GUIDE</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-neutral-300">Target Duration: 90–120 Seconds</span>
            </div>
            <h3 className="text-2xl font-bold text-white font-display">
              How to Record a Winning Submission Video
            </h3>
            <p className="text-xs text-neutral-400">
              Judges review hundreds of projects. Follow this proven 5-step script and capture live proof of your Switch AI agent workflow.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-950 border border-neutral-800 overflow-x-auto">
          {[
            { id: 'timeline', label: '2-Minute Timeline Blueprint' },
            { id: 'script', label: 'Spoken Pitch Script' },
            { id: 'tools', label: 'Screen & Recording Tools' },
            { id: 'checklist', label: 'Pre-Flight Checklist' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === t.id
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: 2-Minute Timeline Blueprint */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  time: '0:00 – 0:20',
                  title: '1. The Hook & Problem',
                  desc: 'State your name (solo hacker), project name, and why terminal agents need team chat integration.',
                  highlight: 'Problem & Hook',
                },
                {
                  time: '0:20 – 0:50',
                  title: '2. Live Trigger & Route',
                  desc: 'Send a prompt or webhook into Slack/Discord. Show Switch AI receiving and dispatching it.',
                  highlight: 'Live Event',
                },
                {
                  time: '0:50 – 1:20',
                  title: '3. Human-in-the-Loop',
                  desc: 'Show the agent diagnostic card with code diff and click [Approve & Merge] live on screen.',
                  highlight: 'Crucial for Judges',
                },
                {
                  time: '1:20 – 1:45',
                  title: '4. Open Source Repo',
                  desc: 'Quickly display GitHub README.md, MIT license, and architecture diagram.',
                  highlight: 'OSI Proof',
                },
                {
                  time: '1:45 – 2:00',
                  title: '5. Call to Action',
                  desc: 'Provide your GitHub repository link and close.',
                  highlight: 'Final Cutoff',
                },
              ].map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-400 font-semibold">{step.time}</span>
                      <span className="text-[10px] text-neutral-500">{step.highlight}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                    <p className="text-[11px] text-neutral-400 leading-snug">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tips Box */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>What Hackathon Judges Look For in Your Video:</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>No slide decks</strong>: Spend 90% of the video showing real code and chat screens.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>The Click Proof</strong>: Make sure your mouse click on the approval button is clearly visible.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Keep it under 3 mins</strong>: 90 to 120 seconds is the ideal sweet spot for judges.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Unlisted or Public Link</strong>: Ensure your YouTube or Loom permissions allow public viewing.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Spoken Pitch Script Generator */}
        {activeTab === 'script' && (
          <div className="space-y-4">
            {/* Customizer controls */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Project Name:</span>
                <input
                  type="text"
                  value={customProjectName}
                  onChange={(e) => setCustomProjectName(e.target.value)}
                  className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-700 text-white outline-none w-32"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Chat:</span>
                <select
                  value={customPlatform}
                  onChange={(e) => setCustomPlatform(e.target.value as ChatPlatform)}
                  className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-700 text-white outline-none"
                >
                  <option value="Discord">Discord</option>
                  <option value="Slack">Slack</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Agent:</span>
                <select
                  value={customHarness}
                  onChange={(e) => setCustomHarness(e.target.value as AgentHarness)}
                  className="px-2 py-1 text-xs rounded bg-neutral-900 border border-neutral-700 text-white outline-none"
                >
                  <option value="Claude Code">Claude Code</option>
                  <option value="Cursor">Cursor</option>
                  <option value="OpenCode">OpenCode</option>
                  <option value="Kotlin / Firebase Agent">Kotlin / Firebase Agent</option>
                  <option value="Codex">Codex</option>
                </select>
              </div>
            </div>

            {/* Script Display */}
            <div className="relative p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-800">
                <span className="font-mono text-[11px] text-emerald-400">Spoken Teleprompter Script (approx. 75s reading time)</span>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs border border-neutral-700 transition-colors"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Script!' : 'Copy Script'}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-200 font-mono whitespace-pre-wrap leading-relaxed">
                {spokenScript}
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Screen & Recording Tools */}
        {activeTab === 'tools' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Loom (Recommended)</h4>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">FASTEST</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Instant browser or desktop recorder with camera bubble. Automatically generates a shareable public link with zero rendering wait.
                </p>
                <a
                  href="https://www.loom.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px] pt-1"
                >
                  <span>loom.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">OBS Studio</h4>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">OPEN SOURCE</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  High-fidelity 1080p screen recording without watermarks. Upload the resulting MP4 directly as an unlisted video on YouTube.
                </p>
                <a
                  href="https://obsproject.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 text-[11px] pt-1"
                >
                  <span>obsproject.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">macOS QuickTime</h4>
                  <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">BUILT-IN</span>
                </div>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Press <code>Cmd + Shift + 5</code> to select your screen area and record with microphone audio. Upload directly to YouTube or Google Drive.
                </p>
                <span className="text-[11px] text-neutral-500 pt-1 block">Pre-installed on macOS</span>
              </div>
            </div>

            {/* Avoid Common Pitfalls */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 space-y-2">
              <div className="font-semibold text-red-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Common Video Mistakes That Disqualify Projects:</span>
              </div>
              <ul className="space-y-1 text-[11px] text-red-200/90 list-disc list-inside">
                <li><strong>Exposing live private API keys on screen</strong>: Keep your <code>.env</code> file hidden during recording.</li>
                <li><strong>Setting video to "Private"</strong>: YouTube links must be set to "Unlisted" or "Public" so judges can view them.</li>
                <li><strong>Silent recordings without audio</strong>: Talk through what is happening; judges want to hear your architectural thought process.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Pre-Flight Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-4 text-xs">
            <div className="text-xs text-neutral-400">
              Run through these 5 quick checks right before hitting "Record":
            </div>

            <div className="space-y-2">
              {[
                { id: 'prep-1', text: 'Local agent worker running in terminal (displaying "Listening on webhook...")' },
                { id: 'prep-2', text: 'Target channel open (Slack / Discord / Teams) with bot actively joined' },
                { id: 'prep-3', text: 'One test trigger prompt ready to paste (e.g. "@Bot investigate checkout failure")' },
                { id: 'prep-4', text: 'Public GitHub repo open in another browser tab showing README.md and LICENSE' },
                { id: 'prep-5', text: 'Microphone test passed and computer notifications muted' },
              ].map((item) => {
                const isChecked = checklist[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-800/60 text-white'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-400' : 'text-neutral-600'}`} />
                    <span className="text-xs">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="text-xs text-neutral-400">
            Once recorded, paste your video link into the <strong>Submission Portal</strong>.
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all"
          >
            Got It, Ready to Record!
          </button>
        </div>
      </div>
    </div>
  );
};
