export type AgentHarness = 'Claude Code' | 'Cursor' | 'OpenCode' | 'Codex' | 'Antigravity' | 'Custom MCP' | 'Kotlin / Firebase Agent';

export type ChatPlatform = 'Slack' | 'Discord' | 'Microsoft Teams' | 'Telegram';

export type TrackId = 'incident-response' | 'pr-copilot' | 'team-automation' | 'community-onboarding';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  architecture: string;
  teamName: string;
  teamMembers: string[];
  repoUrl: string;
  demoUrl?: string;
  agentHarness: AgentHarness;
  chatPlatform: ChatPlatform;
  trackId: TrackId;
  license: string;
  upvotes: number;
  submittedAt: string;
  featured?: boolean;
}

export interface Track {
  id: TrackId;
  title: string;
  subtitle: string;
  prizeAmount: string;
  description: string;
  judgingCriteria: string[];
  suggestedIdeas: string[];
}

export interface StarterKit {
  id: string;
  title: string;
  agent: AgentHarness;
  platform: ChatPlatform;
  description: string;
  terminalCommand: string;
  githubUrl: string;
  stars: number;
}

export interface ScheduleEvent {
  id: string;
  day: string;
  dateStr: string;
  timeStr: string;
  title: string;
  speaker: string;
  type: 'workshop' | 'ceremony' | 'office-hours' | 'deadline';
  description: string;
}

export interface MentorJudge {
  id: string;
  name: string;
  role: string;
  organization: string;
  expertise: string;
  avatarUrl?: string;
  githubHandle: string;
}
