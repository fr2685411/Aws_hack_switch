import React, { useState, useEffect } from 'react';
import { AgentHarness, ChatPlatform, TrackId, Project } from '../types/hackathon';
import { 
  User, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  FileText, 
  ArrowRight, 
  Compass, 
  Lightbulb, 
  Zap, 
  Video, 
  Clock, 
  ExternalLink 
} from 'lucide-react';

interface SoloHackerStudioProps {
  onOpenSubmitWithProject: (projectDraft: Partial<Project>) => void;
}

interface SoloIdea {
  id: string;
  title: string;
  trackId: TrackId;
  harness: AgentHarness;
  platform: ChatPlatform;
  scopeSummary: string;
  whySoloFriendly: string;
  suggestedRepoName: string;
  description: string;
}

const SOLO_IDEAS: SoloIdea[] = [
  {
    id: 'solo-idea-1',
    title: 'IncidentPulse: Slack On-Call Sentry Commander',
    trackId: 'incident-response',
    harness: 'Claude Code',
    platform: 'Slack',
    scopeSummary: 'Listens to Sentry error webhooks, isolates failing line via Claude Code, posts interactive Slack card with [Deploy Fix] button.',
    whySoloFriendly: 'Clear single-event flow. No heavy frontend needed—Slack Block Kit provides the UI natively.',
    suggestedRepoName: 'incident-pulse-slack',
    description: 'Autonomous SRE assistant for small engineering teams. When an unhandled exception spikes, IncidentPulse reads stack traces via Switch AI, runs git blame with Claude Code, and presents a 1-click verified defensive hotfix directly in Slack.',
  },
  {
    id: 'solo-idea-2',
    title: 'ReviewBuddy: Discord PR Copilot & Linter',
    trackId: 'pr-copilot',
    harness: 'Cursor',
    platform: 'Discord',
    scopeSummary: 'Captures GitHub PR open events, performs AST diff review with Cursor, posts welcoming thread with copyable code improvements.',
    whySoloFriendly: 'High impact for open source communities; Discord bot APIs are super fast to spin up with discord.js.',
    suggestedRepoName: 'review-buddy-discord',
    description: 'Friendly PR reviewer and maintainer copilot. Evaluates incoming community pull requests, ensures test coverage didn’t drop, flags subtle memory leaks, and writes approachable guidance with runnable diff snippets in Discord.',
  },
  {
    id: 'solo-idea-3',
    title: 'ShipCommander: Telegram Release & Preview Bot',
    trackId: 'team-automation',
    harness: 'OpenCode',
    platform: 'Telegram',
    scopeSummary: 'Accepts simple chat commands like "/deploy preview branch-name" in Telegram, executes smoke tests, and returns live status.',
    whySoloFriendly: 'Telegram bots have zero setup friction—get an API token in 30 seconds from @BotFather.',
    suggestedRepoName: 'ship-commander-telegram',
    description: 'Lightweight DevOps ChatOps bot for distributed open source developers. Enables team members to trigger branch previews, check CI build logs, and tag semantic releases directly from Telegram chats.',
  },
  {
    id: 'solo-idea-4',
    title: 'DocsKeeper: Automated Markdown Sync Agent',
    trackId: 'community-onboarding',
    harness: 'Codex',
    platform: 'Slack',
    scopeSummary: 'Detects when merged code changes API parameters, checks README and docs, opens documentation update PR automatically.',
    whySoloFriendly: 'Solves an acute pain point for all open source projects with high judging appeal.',
    suggestedRepoName: 'docs-keeper-agent',
    description: 'Keeps documentation perpetually in sync with repository code. Watches merged pull requests, compares TypeScript/Python interfaces against existing docs, and submits draft PRs with updated markdown.',
  },
  {
    id: 'solo-idea-kotlin-firebase',
    title: 'FireSwitch: Kotlin & Firebase Collaborative Agent',
    trackId: 'incident-response',
    harness: 'Kotlin / Firebase Agent',
    platform: 'Slack',
    scopeSummary: 'Kotlin Coroutines daemon listening to Switch alerts, syncing real-time incident state into Cloud Firestore, and proposing verified patches.',
    whySoloFriendly: 'Combines Kotlin clean architecture with Firebase real-time listeners; zero backend orchestration needed.',
    suggestedRepoName: 'fireswitch-kotlin-agent',
    description: 'Autonomous Kotlin & Firebase engineering agent inside a Switch collaborative workspace room. Listens to production events, updates Firestore documents in real time, and delivers verified fixes with clean Kotlin snippets into team chat.',
  },
];

const SOLO_CHECKLIST_ITEMS = [
  { id: 'step-1', label: 'Claim free Switch AI API credits & join Discord mentor office hours' },
  { id: 'step-2', label: 'Scaffold project repository with an OSI license (MIT / Apache 2.0)' },
  { id: 'step-3', label: 'Create bot credentials on chosen chat app (Slack, Discord, Teams, or Telegram)' },
  { id: 'step-4', label: 'Wire Switch AI event listener to receive webhooks and spawn agent worker' },
  { id: 'step-5', label: 'Implement 1 human-in-the-loop interactive button (e.g. [Approve & Merge])' },
  { id: 'step-6', label: 'Record a crisp 90–120 second video demo showing the end-to-end workflow' },
  { id: 'step-7', label: 'Submit project repo URL and demo video to the hackathon showcase' },
];

export const SoloHackerStudio: React.FC<SoloHackerStudioProps> = ({ onOpenSubmitWithProject }) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('solo-idea-1');
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'index' | 'package' | 'readme' | 'env'>('index');

  // Solo project custom fields
  const activeIdea = SOLO_IDEAS.find((i) => i.id === selectedIdeaId) || SOLO_IDEAS[0];
  const [projectName, setProjectName] = useState(activeIdea.title);
  const [repoName, setRepoName] = useState(activeIdea.suggestedRepoName);
  const [soloDeveloperHandle, setSoloDeveloperHandle] = useState('solo-hacker');
  const [harness, setHarness] = useState<AgentHarness>(activeIdea.harness);
  const [platform, setPlatform] = useState<ChatPlatform>(activeIdea.platform);

  // Sync when selecting a pre-baked idea
  const handleSelectIdea = (idea: SoloIdea) => {
    setSelectedIdeaId(idea.id);
    setProjectName(idea.title);
    setRepoName(idea.suggestedRepoName);
    setHarness(idea.harness);
    setPlatform(idea.platform);
  };

  // Checklist state stored in localStorage
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('switch_solo_checklist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { 'step-1': true, 'step-2': true };
  });

  const toggleCheck = (id: string) => {
    const updated = { ...checkedSteps, [id]: !checkedSteps[id] };
    setCheckedSteps(updated);
    try {
      localStorage.setItem('switch_solo_checklist', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / SOLO_CHECKLIST_ITEMS.length) * 100);

  const isKotlin = harness === 'Kotlin / Firebase Agent';

  // Generate customized code files for solo builder
  const generatedCode = {
    index: isKotlin
      ? `package com.switch.agent

import com.google.firebase.FirebaseApp
import com.google.firebase.cloud.FirestoreClient
import com.google.cloud.firestore.FieldValue
import com.google.cloud.firestore.Firestore
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

/**
 * ${projectName}
 * Solo Open Source Hackathon Project for WeMakeDevs Flip the Switch
 * Author: ${soloDeveloperHandle} (Solo Hacker)
 * Stack: Kotlin Coroutines + Firebase Firestore + Switch AI Gateway
 * License: MIT
 */

data class SwitchIncidentTask(
    val id: String = "",
    val channel: String = "",
    val title: String = "",
    val rawLog: String = "",
    val status: String = "OPEN",
    val proposedKotlinFix: String = "",
    val verifiedBy: String? = null
)

class SwitchFirebaseAgent(
    private val switchApiKey: String,
    private val firestore: Firestore
) {
    private val agentScope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    fun start() {
        println("🚀 [Switch Agent] Listening for incoming ${platform} events and Firestore sync...")

        // Real-time Firestore snapshot listener for new incidents
        firestore.collection("switch_tasks")
            .whereEqualTo("status", "OPEN")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    System.err.println("Firestore listener error: \${error.message}")
                    return@addSnapshotListener
                }

                snapshot?.documentChanges?.forEach { change ->
                    val task = change.document.toObject(SwitchIncidentTask::class.java)
                    agentScope.launch { triageAndResolve(task) }
                }
            }
    }

    private suspend fun triageAndResolve(task: SwitchIncidentTask) = withContext(Dispatchers.Default) {
        println("⚡ Triaging task: \${task.title}")

        // 1. Clean Architecture: Analyze stack trace, isolate root cause
        val resolutionPatch = """
            // Root Cause: Unhandled State Flow race condition
            // Smallest fix: Use stateIn with SharingStarted.WhileSubscribed
            val uiState: StateFlow<UiState> = repository.observeItems()
                .map { UiState.Success(it) }
                .stateIn(
                    scope = viewModelScope,
                    started = SharingStarted.WhileSubscribed(5_000),
                    initialValue = UiState.Loading
                )
        """.trimIndent()

        // 2. Persist state to Firebase Firestore
        firestore.collection("switch_tasks").document(task.id)
            .update(
                mapOf(
                    "status" to "RESOLVED",
                    "proposedKotlinFix" to resolutionPatch,
                    "updatedAt" to FieldValue.serverTimestamp()
                )
            )

        println("✅ Task \${task.id} resolved and synced to Firestore!")
    }
}

fun main() {
    FirebaseApp.initializeApp()
    val db = FirestoreClient.getFirestore()
    val agent = SwitchFirebaseAgent(System.getenv("SWITCH_API_KEY") ?: "", db)
    agent.start()
    Thread.currentThread().join()
}`
      : `/**
 * ${projectName}
 * Solo Open Source Hackathon Project for WeMakeDevs Flip the Switch
 * Author: ${soloDeveloperHandle}
 * License: MIT
 */

import { SwitchGateway, createChatAdapter } from '@switch-ai/sdk';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// 1. Initialize Switch AI Gateway
const gateway = new SwitchGateway({
  apiKey: process.env.SWITCH_API_KEY!,
  environment: 'production',
});

// 2. Initialize ${platform} Chat Adapter
const chat = createChatAdapter({
  platform: '${platform.toLowerCase()}',
  botToken: process.env.${platform.toUpperCase().replace(/\s+/g, '_')}_BOT_TOKEN!,
  signingSecret: process.env.${platform.toUpperCase().replace(/\s+/g, '_')}_SIGNING_SECRET,
});

console.log('🚀 [Solo Agent] Listening for ${platform} events via Switch AI...');

// 3. Handle incoming chat mentions or webhook triggers
chat.on('message', async (event) => {
  console.log(\`[Switch Event] Received message in \${event.channel}: \${event.text}\`);

  // Send quick acknowledgement to chat
  await chat.sendMessage(event.channel, {
    text: '⚡ [${harness}] Analyzing repository context via Switch AI...',
  });

  // 4. Pipe context into terminal coding agent (${harness})
  const agentWorker = spawn('${harness.toLowerCase().replace(/\s+/g, '-')}', ['run', '--context', JSON.stringify(event)]);

  let agentOutput = '';
  agentWorker.stdout.on('data', (data) => {
    agentOutput += data.toString();
  });

  agentWorker.on('close', async (code) => {
    console.log(\`[Agent Closed] Status code: \${code}\`);

    // 5. Deliver interactive card with Human-in-the-Loop verification button
    await chat.sendMessage(event.channel, {
      title: '✅ Agent Analysis Complete',
      body: \`Identified relevant solution for your repository:\n\n\` + agentOutput.slice(0, 300),
      actions: [
        { id: 'approve_patch', label: 'Approve & Create Hotfix PR', style: 'primary' },
        { id: 'run_tests', label: 'Run Staging Test Suite', style: 'secondary' },
        { id: 'dismiss', label: 'Dismiss', style: 'danger' },
      ],
    });
  });
});

// 6. Handle interactive button clicks from human reviewers
chat.on('action', async (actionEvent) => {
  if (actionEvent.actionId === 'approve_patch') {
    await chat.sendMessage(actionEvent.channel, {
      text: \`🎉 Approved by \${actionEvent.user}! Triggering automated git commit and pull request.\`,
    });
  }
});`,

    package: isKotlin
      ? `plugins {
    kotlin("jvm") version "2.0.21"
    application
}

group = "com.switch.agent"
version = "1.0.0"

repositories {
    mavenCentral()
    google()
}

dependencies {
    // Kotlin Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.9.0")
    
    // Firebase Admin SDK & Cloud Firestore
    implementation("com.google.firebase:firebase-admin:9.4.1")
    implementation("com.google.cloud:google-cloud-firestore:3.27.0")
    
    // JSON & HTTP
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")
    implementation("io.ktor:ktor-client-core:3.0.1")
    implementation("io.ktor:ktor-client-cio:3.0.1")
    
    // Logging
    implementation("ch.qos.logback:logback-classic:1.5.11")
}

application {
    mainClass.set("com.switch.agent.MainKt")
}`
      : `{
  "name": "${repoName}",
  "version": "1.0.0",
  "description": "${activeIdea.scopeSummary}",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "keywords": [
    "switch-ai",
    "wemakedevs",
    "hackathon",
    "ai-agent",
    "${platform.toLowerCase()}",
    "${harness.toLowerCase().replace(/\s+/g, '-')}",
    "open-source"
  ],
  "author": "${soloDeveloperHandle}",
  "license": "MIT",
  "dependencies": {
    "@switch-ai/sdk": "^2.4.1",
    "dotenv": "^16.4.5"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0"
  }
}`,

    readme: `# ${projectName}

> ${activeIdea.scopeSummary}

Built for the **WeMakeDevs Flip the Switch Hackathon** (Nov 4–7, 2026).
- **Track**: ${activeIdea.trackId}
- **Agent Harness**: ${harness}
- **Target Chat Platform**: ${platform}
- **Database**: Cloud Firestore
- **Author**: [@${soloDeveloperHandle}](https://github.com/${soloDeveloperHandle}) (Solo Participant)
- **License**: MIT

---

## 💡 The Problem
In real engineering workspaces, coding agents need robust persistent state, atomic task coordination, and instant synchronization with human developers in team channels.

## 🛠️ The Solution
${projectName} connects a **${harness}** directly to **${platform}** using **Switch AI** and **Firebase Firestore**:
1. Ingests incident webhooks via Switch AI Gateway
2. Writes reactive task documents to Cloud Firestore with real-time snapshot listeners
3. Formats clean ${isKotlin ? 'Kotlin' : 'TypeScript'} diff fixes with defensive error handling
4. Requires explicit **human-in-the-loop button approval** before merging

---

## 🏗️ Architecture Flow
\`\`\`
[${platform} Event / Alert]
       │
       ▼
[Switch AI Gateway Webhook]
       │
       ▼
[Kotlin Coroutines Agent Daemon] <───► [Cloud Firestore Tasks DB]
       │
       ▼
[${platform} Interactive Message with [Approve] Button]
       │
       ▼ (Human Approved)
[Automated GitHub PR & Hotfix Deploy]
\`\`\`

---

## ⚡ Quickstart

1. **Clone repository**:
\`\`\`bash
git clone https://github.com/${soloDeveloperHandle}/${repoName}.git
cd ${repoName}
${isKotlin ? './gradlew run' : 'npm install && npm run dev'}
\`\`\`

2. **Configure environment variables**:
\`\`\`bash
cp .env.example .env
\`\`\`

---

## 🎥 2-Minute Demo Video
- [Link to Demo Video (YouTube / Loom)](#)

## 📄 License
MIT License. 100% Free and Open Source.`,

    env: isKotlin
      ? `# Switch AI Developer Platform Credentials
SWITCH_API_KEY="sk_switch_live_your_key_here"

# Firebase Cloud Firestore Credentials
GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"
FIREBASE_PROJECT_ID="switch-hackathon-2026"

# ${platform} Bot Credentials
${platform.toUpperCase().replace(/\s+/g, '_')}_BOT_TOKEN="xoxb-your-token-here"
${platform.toUpperCase().replace(/\s+/g, '_')}_SIGNING_SECRET="your-secret-here"`
      : `# Switch AI Developer Platform Credentials
SWITCH_API_KEY="sk_switch_live_your_key_here"

# ${platform} Bot Credentials
${platform.toUpperCase().replace(/\s+/g, '_')}_BOT_TOKEN="xoxb-your-token-here"
${platform.toUpperCase().replace(/\s+/g, '_')}_SIGNING_SECRET="your-secret-here"

# Environment
NODE_ENV="development"
PORT=3000`
  };

  const handleCopyCode = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFileName(filename);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  const handlePreFillSubmission = () => {
    onOpenSubmitWithProject({
      title: projectName,
      tagline: activeIdea.scopeSummary,
      description: activeIdea.description,
      teamName: `${soloDeveloperHandle} (Solo Hacker)`,
      teamMembers: [soloDeveloperHandle],
      repoUrl: `https://github.com/${soloDeveloperHandle}/${repoName}`,
      agentHarness: harness,
      chatPlatform: platform,
      trackId: activeIdea.trackId,
      license: 'MIT',
      architecture: `${platform} Webhook -> Switch AI Gateway -> ${harness} Worker -> ${platform} Card with Human Approval`,
    });
  };

  return (
    <section id="solo-studio" className="py-20 border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Banner Kicker */}
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl shadow-emerald-950/20">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
              <User className="w-4 h-4" />
              <span>SOLO PARTICIPANT SPRINT STUDIO</span>
              <span className="text-neutral-600" aria-hidden="true">·</span>
              <span className="text-neutral-300">Fast-Track Your Hackathon Win</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Building solo? Here is your complete hackathon playbook.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Solo developers have a huge advantage: zero coordination overhead and ultra-fast iteration speed. Pick a scoped project idea, generate ready-to-run Switch code, and follow the sprint checklist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handlePreFillSubmission}
              className="px-5 py-3 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Pre-fill Solo Submission Form</span>
            </button>
            <div className="text-center md:text-right text-[11px] text-neutral-400 font-mono">
              Deadline: Nov 7, 2026 (Live Now)
            </div>
          </div>
        </div>

        {/* 2-Column Split: Ideation Picker + Solo Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Curated Solo Project Blueprints */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. Select an Achievable Solo Concept (or customize)</span>
              </div>
              <span className="text-xs text-neutral-500">Optimized for 24–48h build</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SOLO_IDEAS.map((idea) => {
                const isSelected = selectedIdeaId === idea.id;
                return (
                  <div
                    key={idea.id}
                    onClick={() => handleSelectIdea(idea)}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 border-emerald-400 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                        : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className={`text-sm font-bold ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                        {idea.title}
                      </h3>
                      {isSelected ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          SELECTED
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-500 hover:text-neutral-300">
                          Select
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                      {idea.scopeSummary}
                    </p>

                    {/* Unboxed metadata (§1.A) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/60">
                      <span>Platform: <strong className="text-neutral-200">{idea.platform}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>Harness: <strong className="text-emerald-400">{idea.harness}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-400">Track: {idea.trackId}</span>
                    </div>

                    <div className="mt-2 text-[11px] text-emerald-400/90 bg-emerald-950/20 p-2 rounded border border-emerald-900/30">
                      💡 <strong>Solo Edge:</strong> {idea.whySoloFriendly}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Solo Hacker Roadmap & Progress Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">
                    SOLO ROADMAP
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Sprint Checklist
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                    {progressPercent}%
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {completedCount} of {SOLO_CHECKLIST_ITEMS.length} done
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-neutral-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Checkbox items */}
              <div className="space-y-2.5 pt-1">
                {SOLO_CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedSteps[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-neutral-950/60 border-neutral-800/60 text-neutral-300'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-snug ${isChecked ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Pro tips for solo winners */}
              <div className="pt-3 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
                <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Solo Hacker Pro Tips:</span>
                </div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-neutral-400">
                  <li><strong>Focus on 1 Hero Flow</strong>: A rock-solid trigger → agent fix → approval beats 10 broken commands.</li>
                  <li><strong>Human in the Loop</strong>: Judges look for the interactive button in Slack/Discord.</li>
                  <li><strong>2-Min Loom Video</strong>: Show your screen live! 80% of judging decisions are made during the video demo.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Instant Code Generator for the Solo Builder */}
        <div className="p-6 md:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-semibold mb-1">
                STEP 2: SCAFFOLD YOUR REPO
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Generated Code Workspace for "{projectName}"
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Pre-wired Switch SDK, chat platform adapter, agent process spawning, and human-in-the-loop approvals.
              </p>
            </div>

            {/* Config inputs for solo dev */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="GitHub Username"
                value={soloDeveloperHandle}
                onChange={(e) => setSoloDeveloperHandle(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none w-36 font-mono"
                title="Your GitHub handle"
              />
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as ChatPlatform)}
                className="px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
              >
                <option value="Slack">Slack</option>
                <option value="Discord">Discord</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Telegram">Telegram</option>
              </select>
              <select
                value={harness}
                onChange={(e) => setHarness(e.target.value as AgentHarness)}
                className="px-3 py-1.5 text-xs rounded-lg bg-neutral-950 border border-neutral-800 text-white focus:border-emerald-500 outline-none"
              >
                <option value="Claude Code">Claude Code</option>
                <option value="Cursor">Cursor</option>
                <option value="OpenCode">OpenCode</option>
                <option value="Codex">Codex</option>
                <option value="Antigravity">Antigravity</option>
                <option value="Custom MCP">Custom MCP</option>
                <option value="Kotlin / Firebase Agent">Kotlin / Firebase Agent</option>
              </select>
            </div>
          </div>

          {/* Code Viewer with Tabs */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
            {/* Tab strip */}
            <div className="px-4 py-2.5 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'index', name: isKotlin ? 'SwitchFirebaseAgent.kt' : 'src/index.ts', icon: Code2 },
                  { id: 'package', name: isKotlin ? 'build.gradle.kts' : 'package.json', icon: FileText },
                  { id: 'readme', name: 'README.md', icon: FileText },
                  { id: 'env', name: '.env.example', icon: FileText },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveCodeTab(t.id as any)}
                      className={`px-3 py-1 text-xs font-mono font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                        activeCodeTab === t.id
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Copy button */}
              <button
                onClick={() =>
                  handleCopyCode(
                    activeCodeTab,
                    activeCodeTab === 'index'
                      ? generatedCode.index
                      : activeCodeTab === 'package'
                      ? generatedCode.package
                      : activeCodeTab === 'readme'
                      ? generatedCode.readme
                      : generatedCode.env
                  )
                }
                className="px-3 py-1 text-xs font-mono rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 flex items-center gap-1.5 transition-colors"
              >
                {copiedFileName === activeCodeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy File</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[380px]">
              <pre className="font-mono text-xs text-neutral-300 whitespace-pre leading-relaxed">
                {activeCodeTab === 'index' && generatedCode.index}
                {activeCodeTab === 'package' && generatedCode.package}
                {activeCodeTab === 'readme' && generatedCode.readme}
                {activeCodeTab === 'env' && generatedCode.env}
              </pre>
            </div>
          </div>

          {/* Quick terminal instructions */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold text-white">
                Ready to push to GitHub and submit?
              </div>
              <div className="text-xs text-neutral-400">
                Create a new repository named <code className="text-emerald-300 font-mono">{repoName}</code> with an MIT license and copy these files.
              </div>
            </div>

            <button
              onClick={handlePreFillSubmission}
              className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <span>Submit "{projectName}" as Solo Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
