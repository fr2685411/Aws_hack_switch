import { Track, StarterKit, ScheduleEvent, MentorJudge, Project } from '../types/hackathon';

export const TRACKS: Track[] = [
  {
    id: 'incident-response',
    title: 'Automated Incident Response & War Rooms',
    subtitle: 'Autonomous triage, root-cause correlation, and patch proposals directly in chat',
    prizeAmount: '$3,000 USD',
    description:
      'Connect terminal coding agents to production alerts (Datadog, Sentry, Prometheus, CloudWatch). When an incident triggers a Slack or Teams war room, the agent pulls logs, identifies the failing commit, writes a reproducible test case, and proposes a draft hotfix with human verification.',
    judgingCriteria: [
      'Incident diagnosis accuracy and log correlation speed',
      'Safety rails and human-in-the-loop confirmation before destructive actions',
      'Clean interactive Slack/Teams UI blocks with diff viewers and approve buttons',
      'Open source reusability across different monitoring stacks',
    ],
    suggestedIdeas: [
      'PagerAgent: Correlates Datadog stack traces with Git blame and spins up an isolated sandbox test.',
      'Rollback Guard: Agent in Discord that evaluates canary metrics and automates targeted feature-flag rollbacks.',
      'Postmortem Synthesizer: Listens to the war-room thread and generates a comprehensive markdown incident postmortem.',
    ],
  },
  {
    id: 'pr-copilot',
    title: 'Collaborative PR & Maintainer Copilot',
    subtitle: 'Streamline open source maintenance, review queues, and first-time contributor onboarding',
    prizeAmount: '$2,500 USD',
    description:
      'Open source maintainers spend countless hours triaging PRs, verifying reproduction steps, and ensuring code standards. Build a Switch-powered agent that lives in community Discord or Slack channels to interactively review PRs, run security linting, and guide contributors through failing CI checks.',
    judgingCriteria: [
      'Empathetic and constructive contributor interaction in public channels',
      'High-quality automated code review with contextual diff commentary',
      'Verification of local reproducing environments before bug reporting',
      'Permissive open source licensing and modular architecture',
    ],
    suggestedIdeas: [
      'ReviewPilot: Discord bot that gives instant AST review feedback and suggests code fixes as commit suggestions.',
      'ReproBot: Spins up a lightweight WebContainer sandbox to verify whether reported bug issues are reproducible.',
      'DocDrift: Watches merged pull requests and warns in chat when API docs need updating.',
    ],
  },
  {
    id: 'team-automation',
    title: 'Cross-Platform Team & Release Automation',
    subtitle: 'Natural language release pipelines, dependency upgrades, and environment provisioning',
    prizeAmount: '$2,500 USD',
    description:
      'Enable developers to operate complex devops pipelines, database migrations, and microservice orchestration using plain language in team channels. Harness Switch to securely bind Claude Code, OpenCode, or Cursor with team chat protocols.',
    judgingCriteria: [
      'Seamless command execution with audit logging and permissions checking',
      'Support for multiple chat platforms (Slack, Teams, Telegram)',
      'Robust error handling and status progression streaming',
      'Real-world utility for engineering teams and open source orgs',
    ],
    suggestedIdeas: [
      'ShipBot: Coordinates multi-service releases in Slack with automated smoke test verifications.',
      'DepGuardian: Evaluates Dependabot security warnings, runs local test suites, and opens approved PRs.',
      'EnvSpin: Discord bot that spins up ephemeral staging preview environments on demand.',
    ],
  },
  {
    id: 'community-onboarding',
    title: 'Community Onboarding & DevRel Agents',
    subtitle: 'Interactive developer onboarding, Q&A synthesis, and issue triage in public forums',
    prizeAmount: '$1,000 USD',
    description:
      'Bridge developer relations and technical support. Build agents that understand a repository’s architecture, documentation, and commit history to answer technical questions in community Discord/Telegram servers without hallucinating.',
    judgingCriteria: [
      'Codebase grounding accuracy using embeddings or MCP indexers',
      'Interactive guidance with runnable code snippets and playground links',
      'Graceful escalation to human maintainers when unsure',
      'Accessibility and welcoming tone for newcomers',
    ],
    suggestedIdeas: [
      'OnboardBot: Guides new contributors through their first "good first issue" step-by-step.',
      'Discord ARCH-Bot: Answers architectural questions in community Discord with links to exact source files.',
      'BugTriage Assistant: Automatically asks the right clarifying questions when bug reports are missing logs.',
    ],
  },
];

export const PRIZES = [
  { rank: '1st Place Overall', amount: '$4,000 USD', desc: 'Top scoring open source project across all tracks, featured on WeMakeDevs & DevTools Academy.' },
  { rank: '2nd Place Overall', amount: '$2,500 USD', desc: 'Runner-up champion project displaying exceptional open source utility and team integration.' },
  { rank: '3rd Place Overall', amount: '$1,500 USD', desc: 'Third place award for outstanding technical execution and developer experience.' },
  { rank: 'Track Champions (4x)', amount: '$1,000 USD', desc: '$250 bonus for the highest-ranking submission in each of the 4 individual tracks.' },
  { rank: 'Community Choice & DevRel', amount: '$1,000 USD', desc: 'Voted by the WeMakeDevs community and open source maintainers for best documentation and demo.' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'pager-agent-oss',
    title: 'PagerAgent OSS',
    tagline: 'Autonomous on-call incident commander in Slack using Switch + Claude Code',
    description:
      'PagerAgent OSS connects directly into PagerDuty & Datadog webhooks via Switch AI. When an outage or 5xx spike strikes, it isolates the relevant microservice, runs git blame against recent releases, writes a reproducing unit test in an ephemeral sandbox, and presents a 1-click verified hotfix directly inside the Slack incident war room.',
    architecture:
      'PagerDuty Webhook -> Switch AI Gateway -> Claude Code CLI Worker (STDIN/STDOUT) -> GitHub MCP Tool -> Slack Block Kit Interactive Cards',
    teamName: 'ChaosFixers',
    teamMembers: ['Elena Rostova', 'Devon Vance', 'Karan Mehta'],
    repoUrl: 'https://github.com/chaosfixers/pager-agent-oss',
    demoUrl: 'https://youtu.be/pageragent-demo-switch',
    agentHarness: 'Claude Code',
    chatPlatform: 'Slack',
    trackId: 'incident-response',
    license: 'Apache-2.0',
    upvotes: 142,
    submittedAt: 'Nov 5, 2026',
    featured: true,
  },
  {
    id: 'review-pilot-discord',
    title: 'ReviewPilot',
    tagline: 'Empathetic Discord & Slack bot for real-time PR triage and AST security linting',
    description:
      'Designed for busy open source maintainers. ReviewPilot acts as an interactive code partner in community Discord channels. When a new pull request is opened, it analyzes the diff, checks code coverage changes, flags potential race conditions or unescaped queries, and offers conversational code suggestions that authors can apply with a single emoji reaction.',
    architecture:
      'GitHub Webhook -> Switch AI Router -> Cursor / OpenCode Agent -> Tree-sitter AST Parser -> Discord Bot Interaction Handlers',
    teamName: 'FOSS Flow',
    teamMembers: ['Sarah Jenkins', 'Alex Rivera'],
    repoUrl: 'https://github.com/foss-flow/review-pilot',
    demoUrl: 'https://reviewpilot.dev',
    agentHarness: 'Cursor',
    chatPlatform: 'Discord',
    trackId: 'pr-copilot',
    license: 'MIT',
    upvotes: 119,
    submittedAt: 'Nov 5, 2026',
    featured: true,
  },
  {
    id: 'repoguardian-teams',
    title: 'RepoGuardian Teams',
    tagline: 'Vulnerability triage and automated patch testing for Microsoft Teams',
    description:
      'RepoGuardian turns vulnerability reports into collaborative action items in MS Teams. Instead of drowning security engineers in Dependabot noise, it spins up an OpenCode agent via Switch to verify if the vulnerable function is actually imported or executed in your codebase, generates a minimal upgrade PR, and streams live test results into Teams.',
    architecture:
      'CVE Feed -> Switch AI Dispatcher -> OpenCode Agent -> Local Jest/Pytest Runner -> MS Teams Adaptive Cards',
    teamName: 'SecOps Guild',
    teamMembers: ['Tariq Al-Mansoor', 'Chloe Chen', 'Liam O\'Connor'],
    repoUrl: 'https://github.com/secops-guild/repoguardian-teams',
    demoUrl: 'https://repoguardian.dev/demo',
    agentHarness: 'OpenCode',
    chatPlatform: 'Microsoft Teams',
    trackId: 'team-automation',
    license: 'MIT',
    upvotes: 94,
    submittedAt: 'Nov 6, 2026',
    featured: true,
  },
  {
    id: 'docssync-agent',
    title: 'DocsSync Agent',
    tagline: 'Watches merged code changes and drafts API documentation updates automatically',
    description:
      'Keeps open source documentation in perpetual lockstep with your codebase. Whenever a PR affecting public API routes or CLI arguments is merged, DocsSync analyzes the typed docstrings, identifies stale markdown files, and posts a draft docs PR directly in the team Slack `#docs` channel with an approval button.',
    architecture:
      'Git Merge Event -> Switch AI Gateway -> Codex Agent -> TypeDoc / OpenAPI Extractor -> Slack Interactive Message',
    teamName: 'DocCraft',
    teamMembers: ['Maria Santos', 'Kenji Sato'],
    repoUrl: 'https://github.com/doccraft/docssync-agent',
    demoUrl: 'https://docssync.dev',
    agentHarness: 'Codex',
    chatPlatform: 'Slack',
    trackId: 'community-onboarding',
    license: 'Apache-2.0',
    upvotes: 87,
    submittedAt: 'Nov 6, 2026',
    featured: false,
  },
  {
    id: 'bughunter-telegram',
    title: 'BugHunter Telegram',
    tagline: 'Community bug reproduction harness triggered directly from Telegram dev chats',
    description:
      'Developers in distributed remote groups frequently share bug snippets in Telegram. BugHunter allows developers to tag `@BugHunterBot /reproduce <issue-url>`, which prompts an Antigravity agent to spin up a Docker sandbox, attempt to reproduce the failure against main branch, and report back execution logs within 45 seconds.',
    architecture:
      'Telegram Bot API -> Switch AI Event Router -> Antigravity Agent Container -> Docker In Docker -> Telegram Formatted Result',
    teamName: 'DistroHacks',
    teamMembers: ['Priya Sharma', 'Lucas Meyer'],
    repoUrl: 'https://github.com/distrohacks/bughunter-telegram',
    demoUrl: 'https://t.me/BugHunterBot',
    agentHarness: 'Antigravity',
    chatPlatform: 'Telegram',
    trackId: 'pr-copilot',
    license: 'MIT',
    upvotes: 76,
    submittedAt: 'Nov 6, 2026',
    featured: false,
  },
  {
    id: 'git-chatops-slack',
    title: 'GitChatOps Core',
    tagline: 'Conversational git worktree and preview branch orchestration for teams',
    description:
      'Provides developers with natural language control over staging environments, feature flags, and database seeders in Slack. Powered by Switch AI and Claude Code, team members can instruct the bot to create cherry-picked staging releases or run targeted performance benchmarks with full role-based access control.',
    architecture:
      'Slack Slash Commands & Thread Mentions -> Switch AI -> Claude Code -> GitHub Actions API & Kubernetes Operator',
    teamName: 'CloudWeavers',
    teamMembers: ['Nikhil Rao', 'Sophie Dubois', 'Mateo Rossi', 'Hanna Lindqvist'],
    repoUrl: 'https://github.com/cloudweavers/gitchatops-core',
    demoUrl: 'https://gitchatops.run',
    agentHarness: 'Claude Code',
    chatPlatform: 'Slack',
    trackId: 'team-automation',
    license: 'Apache-2.0',
    upvotes: 103,
    submittedAt: 'Nov 6, 2026',
    featured: false,
  },
];

export const STARTER_KITS: StarterKit[] = [
  {
    id: 'switch-claude-slack',
    title: 'Switch + Claude Code Slack Template',
    agent: 'Claude Code',
    platform: 'Slack',
    description: 'Pre-configured TypeScript project with Switch AI gateway, Slack Bolt SDK, and Claude Code terminal execution harness.',
    terminalCommand: 'npx create-switch-app my-incident-agent --template claude-slack',
    githubUrl: 'https://github.com/wemakedevs/switch-claude-slack-starter',
    stars: 342,
  },
  {
    id: 'switch-opencode-teams',
    title: 'OpenCode + Microsoft Teams Bot Kit',
    agent: 'OpenCode',
    platform: 'Microsoft Teams',
    description: 'Full-stack starter for building enterprise incident and CI/CD agents using OpenCode and Teams Adaptive Cards.',
    terminalCommand: 'npx create-switch-app my-teams-agent --template opencode-teams',
    githubUrl: 'https://github.com/wemakedevs/switch-opencode-teams-starter',
    stars: 285,
  },
  {
    id: 'switch-cursor-discord',
    title: 'Cursor + Discord PR Copilot Kit',
    agent: 'Cursor',
    platform: 'Discord',
    description: 'Discord.js v14 template equipped with GitHub webhook listener and Switch Cursor agent bridge for open source communities.',
    terminalCommand: 'npx create-switch-app my-discord-reviewer --template cursor-discord',
    githubUrl: 'https://github.com/wemakedevs/switch-cursor-discord-starter',
    stars: 418,
  },
  {
    id: 'switch-telegram-mcp',
    title: 'Telegram + Custom MCP Agent Kit',
    agent: 'Custom MCP',
    platform: 'Telegram',
    description: 'Lightweight Python/FastAPI and Node.js starter connecting Telegram bots with Model Context Protocol (MCP) tool servers.',
    terminalCommand: 'npx create-switch-app my-telegram-bot --template mcp-telegram',
    githubUrl: 'https://github.com/wemakedevs/switch-mcp-telegram-starter',
    stars: 210,
  },
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 'event-1',
    day: 'Day 1',
    dateStr: 'Wednesday, Nov 4, 2026',
    timeStr: '15:00 UTC',
    title: 'Opening Ceremony & Keynote: Freeing AI Agents from the Terminal',
    speaker: 'Kunal Kushwaha & Switch AI Core Team',
    type: 'ceremony',
    description: 'Kickoff presentation detailing the hackathon vision, Switch AI architecture, $10,000 prize tracks, and open source submission rules.',
  },
  {
    id: 'event-2',
    day: 'Day 1',
    dateStr: 'Wednesday, Nov 4, 2026',
    timeStr: '17:00 UTC',
    title: 'Hands-on Workshop: Connecting Claude Code & OpenCode to Slack via Switch',
    speaker: 'Lead Architect, DevTools Academy',
    type: 'workshop',
    description: 'Step-by-step masterclass on piping agent STDIN/STDOUT into chat platforms, handling asynchronous approvals, and configuring safe tools.',
  },
  {
    id: 'event-3',
    day: 'Day 2',
    dateStr: 'Thursday, Nov 5, 2026',
    timeStr: '14:00 UTC',
    title: 'Mentorship Office Hours & Architecture Review Session',
    speaker: 'Open Source Mentors & Switch Engineering Team',
    type: 'office-hours',
    description: 'Drop-in breakout rooms for teams to test their Switch event webhooks, get debugging help, and refine their open source project scope.',
  },
  {
    id: 'event-4',
    day: 'Day 3',
    dateStr: 'Friday, Nov 6, 2026',
    timeStr: '16:00 UTC',
    title: 'Live Hacking Jam & Project Polish: Crafting Stellar Video Demos',
    speaker: 'WeMakeDevs Community Leads',
    type: 'workshop',
    description: 'Learn how to present your open-source agent effectively to judges: clear problem statements, live failure-to-fix flows, and architecture diagrams.',
  },
  {
    id: 'event-5',
    day: 'Day 4',
    dateStr: 'Saturday, Nov 7, 2026',
    timeStr: '22:00 UTC',
    title: 'Project Submission Hard Deadline',
    speaker: 'All Teams',
    type: 'deadline',
    description: 'Final cutoff! All public GitHub repositories, README documentation, and demo videos must be submitted via the hackathon portal.',
  },
  {
    id: 'event-6',
    day: 'Day 4',
    dateStr: 'Saturday, Nov 7, 2026',
    timeStr: '23:30 UTC',
    title: 'Closing Showcase, Community Voting & Winners Announcement',
    speaker: 'Judging Panel & Community Hosts',
    type: 'ceremony',
    description: 'Live broadcast celebrating standout projects, awarding $10,000 in prizes across tracks, and spotlighting community contributions.',
  },
];

export const MENTORS_JUDGES: MentorJudge[] = [
  {
    id: 'kunal',
    name: 'Kunal Kushwaha',
    role: 'Founder',
    organization: 'WeMakeDevs',
    expertise: 'Open Source Ecosystem, DevRel & Cloud Native',
    githubHandle: 'kunal-kushwaha',
  },
  {
    id: 'arnav',
    name: 'Arnav Sharma',
    role: 'Head of Developer Experience',
    organization: 'DevTools Academy',
    expertise: 'Agent Tooling, MCP Protocols & Developer Tooling',
    githubHandle: 'arnav-sharma-dev',
  },
  {
    id: 'maya',
    name: 'Maya Lin',
    role: 'Founding Engineer',
    organization: 'Switch AI',
    expertise: 'Chat Protocol Adapters & Realtime Event Routing',
    githubHandle: 'mayalin-switch',
  },
  {
    id: 'marcus',
    name: 'Marcus Thorne',
    role: 'Principal Staff SRE & FOSS Maintainer',
    organization: 'Open Incident Alliance',
    expertise: 'Production Reliability & Automated War Rooms',
    githubHandle: 'mthorne-oss',
  },
];

export const FAQS = [
  {
    q: 'Who is eligible to participate in the Flip the Switch Hackathon?',
    a: 'Anyone! Developers of all skill levels from anywhere in the world can participate. You can build as a solo developer or in teams of up to 4 members.',
  },
  {
    q: 'What is the core technical requirement for projects?',
    a: 'Your project must connect one or more AI coding agents (such as Claude Code, Cursor, Codex, OpenCode, Antigravity, or custom MCP agents) to team communication platforms (Slack, Microsoft Teams, Discord, or Telegram) using Switch AI as the integration layer.',
  },
  {
    q: 'Does my project need to be open source?',
    a: 'Yes, 100%. All submissions must be published under an OSI-approved open source license (such as MIT, Apache 2.0, or BSD) with a public repository and clear setup instructions.',
  },
  {
    q: 'Is access to Switch AI free during the hackathon?',
    a: 'Yes. All registered participants receive free access and API credits to the Switch AI developer platform and MCP gateway throughout the hackathon.',
  },
  {
    q: 'Can I submit a project built before the hackathon?',
    a: 'No. While you may use existing open source libraries, tools, and starter templates, the agent integration and core hackathon application must be built during the hackathon window (Nov 4 - Nov 7, 2026).',
  },
  {
    q: 'How will projects be evaluated?',
    a: 'Submissions are judged across four pillars: Open Source Impact (30%), Real-world Team Collaboration Experience (30%), Technical Depth & Switch Architecture (25%), and Usability & Documentation (15%).',
  },
];
