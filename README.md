# FireSwitch: Autonomous Kotlin & Firebase AI Agent for Discord

[![Hackathon: WeMakeDevs Flip the Switch](https://img.shields.io/badge/Hackathon-WeMakeDevs%20Flip%20the%20Switch-10b981?style=for-the-badge)](https://www.wemakedevs.org/hackathons/switch)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![Kotlin: 2.0.21](https://img.shields.io/badge/Kotlin-2.0.21-7f52ff?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Firebase: Cloud Firestore](https://img.shields.io/badge/Firebase-Firestore-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Switch AI Gateway](https://img.shields.io/badge/Switch%20AI-Gateway%20v2-38bdf8?style=for-the-badge)](https://switch.live)

> **WeMakeDevs Flip the Switch Hackathon Submission** ($10,000 USD Prize Pool)  
> *Track: Incident Response Automation / PR Copilot*  
> *Built for WeMakeDevs Flip the Switch Hackathon (Workspace ID: 2da969e8-ba79-47ec-be27-f983d58fec9a)*

---

## ⚡ Overview & The Problem

Terminal AI coding agents (such as Claude Code, Cursor, OpenCode, and Codex) have revolutionized software engineering, but they remain **trapped inside isolated local developer CLI windows**. When production crashes occur or pull requests need triage, developers are forced to manually copy-paste stack traces between monitoring tools, terminal CLI agents, and team chat rooms.

**FireSwitch flips the switch**: It bridges autonomous terminal agents directly into **Discord** (and Slack) using the **Switch AI Gateway** and a **Kotlin & Firebase daemon**, enforcing an **interactive human-in-the-loop approval gate** before any code changes or hotfix deployments execute.

---

## 🏛️ System Architecture

```text
               +---------------------------------------+
               |        Discord Channel / User         |
               |     (@FireSwitch / !triage <issue>)   |
               +-------------------+-------------------+
                                   |
                                   | Webhook / Event
                                   v
               +---------------------------------------+
               |           Switch AI Gateway           |
               |  (Sub-15ms Ingestion & Event Normal)  |
               +-------------------+-------------------+
                                   |
                                   | Event Stream
                                   v
               +---------------------------------------+
               |   FireSwitch Kotlin Coroutines Daemon |
               |     (AST Diagnosis & Diff Synthesis)  |
               +-------------------+-------------------+
                                   |
                                   v
               +---------------------------------------+
               |    Discord Interactive Embed Card     |
               |   [Approve & Execute]    [Reject]     |
               +-------------------+-------------------+
                                   |
                                   | Human Developer Approves
                                   v
        +--------------------------+--------------------------+
        |                                                     |
        v                                                     v
+-------------------------------+             +-------------------------------+
|     Google Cloud Firestore    |             |      Git & CI/CD Pipeline     |
| (Immutable Audit Trail & Log) |             |  (Atomic Merge & Prod Deploy) |
+-------------------------------+             +-------------------------------+
```

---

## 🚀 Key Features

1. **Human-in-the-Loop Gateway Lock**: Autonomous agents never merge or deploy code without explicit developer sign-off via Discord interactive button components.
2. **Kotlin 2.0 Coroutines & Kord**: Idiomatic, high-throughput asynchronous daemon listening to incoming gateway events.
3. **Google Cloud Firestore Sync**: Immutable audit records, approval timestamps, and developer signatures recorded in real time.
4. **Live 3D WebGL Digital Twin (Three.js)**: Full 3D playable workspace simulator where developers pilot the agent bot, test AST triage, and trigger human approvals.
5. **Continuous Webhook Diagnostics**: Built-in inspector visualizing raw JSON payloads and TLS 1.3 signatures.

---

## 📦 Repository Structure

```text
├── agent-discord-kotlin/       # Kotlin 2.0 + Kord + Firebase Daemon
│   ├── build.gradle.kts        # Gradle dependencies (Kord, Firebase Admin, Coroutines)
│   ├── src/main/kotlin/        # Main.kt and FirebaseService.kt
│   └── .env.example            # Discord Bot Token configuration
├── agent-discord-node/         # Instant Node.js Discord runner (Zero-Gradle alternative)
│   ├── bot.mjs                 # discord.js runner with [Approve & Execute] buttons
│   ├── package.json            # Node configuration
│   └── .env.example
├── src/                        # Interactive Hackathon Web Platform & 3D Twin
│   ├── components/3d/          # Three.js 3D Playable Workflow Simulator
│   ├── components/             # Solo Studio, GitHub Connect, Submission Audit
│   └── utils/starterZip.ts     # Client-side 1-click starter package bundler
├── server.ts                   # Express server with /api/webhook/discord & Vite middleware
├── .env.example                # Platform environment variables
└── README.md                   # This documentation
```

---

## 🛠️ Step-by-Step Setup & How to Run

### Step 1: Discord Bot Setup (2 Minutes)

1. Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Go to the **Bot** tab:
   - Click **Reset Token** and copy your token.
   - Under **Privileged Gateway Intents**, enable:
     - `[x] Message Content Intent` *(Mandatory for reading !triage)*
     - `[x] Server Members Intent`
3. Go to **OAuth2 -> URL Generator**:
   - Scopes: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Embed Links`, `Read Message History`
   - Paste the generated URL into your browser to invite the bot to your Discord server.

---

### Step 2: Run the Discord Bot Agent

#### Option A: Lightweight Node.js Runner (Instant, No Gradle Required)
```bash
cd agent-discord-node
npm install
cp .env.example .env
# Edit .env and paste your DISCORD_BOT_TOKEN
npm start
```

#### Option B: Kotlin & Firebase Daemon (Production Architecture)
```bash
cd agent-discord-kotlin
cp .env.example .env
# Edit .env and paste your DISCORD_BOT_TOKEN
./gradlew run
```

---

### Step 3: Run the Web Platform & 3D Interactive Simulator

```bash
# In the root repository directory:
npm install
cp .env.example .env
# Set GEMINI_API_KEY in .env
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Testing in Discord (Live Demo Flow)

1. Open your Discord server where your bot is present.
2. In any text channel, send:
   ```text
   !triage NullPointerException in payment token refresher
   ```
3. The bot will respond with:
   - An AST diagnostic embed categorized as `[Bug]`.
   - A proposed defensive Kotlin guard clause.
   - Interactive **`[Approve & Execute]`** and **`[Reject]`** buttons.
4. Click **`[Approve & Execute]`**:
   - The bot acknowledges your human sign-off: `Change Approved & Executed by @User`.
   - State and audit logs are recorded in Google Cloud Firestore.

---

## 📋 Hackathon Verification Checklist

- [x] **OSI Open Source License**: Licensed under MIT.
- [x] **Switch AI Integration**: Real-time webhook ingestion via `/api/webhook/discord`.
- [x] **Human-in-the-Loop**: Interactive button approval components enforced in Discord.
- [x] **Demo Video**: 90–120s walkthrough covering problem, live triage, and human approval.
- [x] **Architecture Diagram**: Documented above.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
