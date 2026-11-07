import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Globe, MapPin, Zap, Radio, Shield, Server, RefreshCw, Layers, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export interface AgentNode {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  status: 'ACTIVE_RELAY' | 'PROCESSING_WEBHOOK' | 'IDLE' | 'INCIDENT_WAR_ROOM';
  agentHarness: string;
  chatPlatform: string;
  latencyMs: number;
  activeWorkspaces: number;
  uptime: string;
  description: string;
}

const GLOBAL_AGENT_NODES: AgentNode[] = [
  {
    id: 'node-sfo',
    name: 'US-West-01 (San Francisco)',
    city: 'San Francisco',
    country: 'United States',
    lat: 37.7749,
    lng: -122.4194,
    status: 'ACTIVE_RELAY',
    agentHarness: 'Claude Code CLI',
    chatPlatform: 'Slack',
    latencyMs: 24,
    activeWorkspaces: 142,
    uptime: '99.98%',
    description: 'Core North American Switch AI relay bridging GitHub PR webhooks into Slack channels.',
  },
  {
    id: 'node-nyc',
    name: 'US-East-02 (New York)',
    city: 'New York',
    country: 'United States',
    lat: 40.7128,
    lng: -74.006,
    status: 'PROCESSING_WEBHOOK',
    agentHarness: 'Cursor HyperCopilot',
    chatPlatform: 'Discord',
    latencyMs: 38,
    activeWorkspaces: 98,
    uptime: '99.95%',
    description: 'High-throughput Discord bot cluster managing real-time developer pair sessions.',
  },
  {
    id: 'node-blr',
    name: 'APAC-South-01 (Bengaluru)',
    city: 'Bengaluru',
    country: 'India',
    lat: 12.9716,
    lng: 77.5946,
    status: 'ACTIVE_RELAY',
    agentHarness: 'FireSwitch Kotlin Daemon',
    chatPlatform: 'Discord & Slack',
    latencyMs: 19,
    activeWorkspaces: 215,
    uptime: '99.99%',
    description: 'Official WeMakeDevs Hackathon Primary Node running Firestore sync and human-approval safety gates.',
  },
  {
    id: 'node-lon',
    name: 'EU-West-01 (London)',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lng: -0.1278,
    status: 'IDLE',
    agentHarness: 'OpenCode Release Bot',
    chatPlatform: 'Microsoft Teams',
    latencyMs: 44,
    activeWorkspaces: 76,
    uptime: '99.92%',
    description: 'Enterprise Teams gateway orchestrating staging release gates and automated changelog generation.',
  },
  {
    id: 'node-fra',
    name: 'EU-Central-01 (Frankfurt)',
    city: 'Frankfurt',
    country: 'Germany',
    lat: 50.1109,
    lng: 8.6821,
    status: 'INCIDENT_WAR_ROOM',
    agentHarness: 'SRE Incident Commander',
    chatPlatform: 'Slack',
    latencyMs: 31,
    activeWorkspaces: 64,
    uptime: '99.94%',
    description: 'Automated PagerDuty to Slack bridge spinning up ephemeral sandboxes to reproduce production regressions.',
  },
  {
    id: 'node-tyo',
    name: 'APAC-East-01 (Tokyo)',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lng: 139.6503,
    status: 'PROCESSING_WEBHOOK',
    agentHarness: 'Google ADK Autonomous Agent',
    chatPlatform: 'Discord',
    latencyMs: 52,
    activeWorkspaces: 110,
    uptime: '99.97%',
    description: 'Tokyo edge cluster executing automated pull request review benchmarks and diff validation.',
  },
  {
    id: 'node-sin',
    name: 'APAC-Southeast-01 (Singapore)',
    city: 'Singapore',
    country: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    status: 'ACTIVE_RELAY',
    agentHarness: 'Antigravity Orchestrator',
    chatPlatform: 'Telegram',
    latencyMs: 29,
    activeWorkspaces: 87,
    uptime: '99.96%',
    description: 'Low-latency mobile alerting edge routing Telegram commands to remote cloud agent runtimes.',
  },
  {
    id: 'node-sao',
    name: 'SA-East-01 (São Paulo)',
    city: 'São Paulo',
    country: 'Brazil',
    lat: -23.5505,
    lng: -46.6333,
    status: 'ACTIVE_RELAY',
    agentHarness: 'Custom MCP Agent',
    chatPlatform: 'Discord',
    latencyMs: 78,
    activeWorkspaces: 49,
    uptime: '99.89%',
    description: 'Latin America relay hosting Model Context Protocol tool bridges for distributed teams.',
  },
  {
    id: 'node-syd',
    name: 'Oceania-01 (Sydney)',
    city: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lng: 151.2093,
    status: 'IDLE',
    agentHarness: 'Test Flakiness Investigator',
    chatPlatform: 'Slack',
    latencyMs: 65,
    activeWorkspaces: 38,
    uptime: '99.91%',
    description: 'Nightly build quarantine runner and flaky test triage agent.',
  },
];

interface GlobalAgentMapProps {
  apiKey?: string;
}

export const GlobalAgentMap: React.FC<GlobalAgentMapProps> = ({ apiKey: propKey }) => {
  const [apiKey, setApiKey] = useState<string>(
    propKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(GLOBAL_AGENT_NODES[2]); // Default to Bengaluru
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [pingRunning, setPingRunning] = useState(false);
  const [latencyOverrides, setLatencyOverrides] = useState<Record<string, number>>({});
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 20, lng: 0 });
  const [mapZoom, setMapZoom] = useState<number>(2);

  // Fallback to fetch key from server if not populated in client bundle
  useEffect(() => {
    if (!apiKey) {
      fetch('/api/config/maps')
        .then((res) => res.json())
        .then((data) => {
          if (data?.apiKey) {
            setApiKey(data.apiKey);
          }
        })
        .catch(() => {});
    }
  }, [apiKey]);

  const handleSimulatePing = () => {
    setPingRunning(true);
    setTimeout(() => {
      const updated: Record<string, number> = {};
      GLOBAL_AGENT_NODES.forEach((n) => {
        // Jitter by ±6ms
        const jitter = Math.floor(Math.random() * 12) - 6;
        updated[n.id] = Math.max(12, n.latencyMs + jitter);
      });
      setLatencyOverrides(updated);
      setPingRunning(false);
    }, 800);
  };

  const filteredNodes = GLOBAL_AGENT_NODES.filter((n) => {
    if (filterPlatform !== 'ALL' && !n.chatPlatform.includes(filterPlatform)) return false;
    if (filterStatus !== 'ALL' && n.status !== filterStatus) return false;
    return true;
  });

  const getPinColors = (status: AgentNode['status']) => {
    switch (status) {
      case 'ACTIVE_RELAY':
        return { background: '#10b981', glyphColor: '#ffffff', borderColor: '#064e3b' };
      case 'PROCESSING_WEBHOOK':
        return { background: '#06b6d4', glyphColor: '#ffffff', borderColor: '#164e63' };
      case 'INCIDENT_WAR_ROOM':
        return { background: '#ef4444', glyphColor: '#ffffff', borderColor: '#7f1d1d' };
      case 'IDLE':
      default:
        return { background: '#64748b', glyphColor: '#ffffff', borderColor: '#334155' };
    }
  };

  const getStatusBadge = (status: AgentNode['status']) => {
    switch (status) {
      case 'ACTIVE_RELAY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800">ONLINE RELAY</span>;
      case 'PROCESSING_WEBHOOK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800">PROCESSING</span>;
      case 'INCIDENT_WAR_ROOM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-800">WAR ROOM</span>;
      case 'IDLE':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-400 border border-neutral-700">STANDBY</span>;
    }
  };

  const focusNode = (node: AgentNode) => {
    setSelectedNode(node);
    setMapCenter({ lat: node.lat, lng: node.lng });
    setMapZoom(5);
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 overflow-hidden shadow-2xl flex flex-col">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Switch Global Agent Mesh & Developer Locator
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                LIVE GOOGLE MAPS
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Explore active Switch AI relay nodes, Discord bot workers, and hackathon teams across global edge clusters.
            </p>
          </div>
        </div>

        {/* Global Latency Ping Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulatePing}
            disabled={pingRunning}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Measure round-trip ping time to all edge nodes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pingRunning ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{pingRunning ? 'Pinging Relays...' : 'Ping All Edge Nodes'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Metrics Strip */}
      <div className="px-4 py-3 bg-neutral-950/40 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neutral-400 text-[11px] font-mono">FILTER PLATFORM:</span>
          {['ALL', 'Slack', 'Discord', 'Teams', 'Telegram'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterPlatform === p
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-neutral-600 mx-1">|</span>

          <span className="text-neutral-400 text-[11px] font-mono">STATUS:</span>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACTIVE_RELAY', label: 'Online' },
            { id: 'PROCESSING_WEBHOOK', label: 'Active Jobs' },
            { id: 'INCIDENT_WAR_ROOM', label: 'Incidents' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStatus(s.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterStatus === s.id
                  ? 'bg-neutral-800 text-white border border-neutral-600'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-neutral-400">
          <span>Active Nodes: <strong className="text-emerald-400">{filteredNodes.length}</strong></span>
          <span>Global Workspaces: <strong className="text-white">839</strong></span>
          <span>Mesh Uptime: <strong className="text-emerald-400">99.96%</strong></span>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Left Side: Interactive Node Directory */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-800 p-3 bg-neutral-950/60 max-h-[540px] overflow-y-auto space-y-2">
          <div className="px-2 py-1 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>EDGE CLUSTERS ({filteredNodes.length})</span>
            <span>CLICK TO CENTER</span>
          </div>

          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const latency = latencyOverrides[node.id] || node.latencyMs;

            return (
              <div
                key={node.id}
                onClick={() => focusNode(node)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-neutral-800/90 border-emerald-500/60 shadow-md shadow-emerald-500/5'
                    : 'bg-neutral-900/60 border-neutral-800/80 hover:bg-neutral-800/60 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      node.status === 'ACTIVE_RELAY' ? 'bg-emerald-400 animate-ping' :
                      node.status === 'PROCESSING_WEBHOOK' ? 'bg-cyan-400' :
                      node.status === 'INCIDENT_WAR_ROOM' ? 'bg-red-400' : 'bg-neutral-500'
                    }`} />
                    <span className="font-semibold text-white text-xs">{node.city}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({node.country})</span>
                  </div>
                  {getStatusBadge(node.status)}
                </div>

                <div className="mt-2 text-[11px] text-neutral-300 flex items-center justify-between font-mono">
                  <span className="text-neutral-400">{node.agentHarness}</span>
                  <span className={latency < 30 ? 'text-emerald-400' : latency < 60 ? 'text-cyan-400' : 'text-amber-400'}>
                    ⚡ {latency} ms
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Platform: <strong className="text-neutral-200">{node.chatPlatform}</strong></span>
                  <span>Workspaces: <strong className="text-white">{node.activeWorkspaces}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Google Map Container */}
        <div className="lg:col-span-8 relative min-h-[460px] lg:min-h-[540px] w-full bg-neutral-950 flex flex-col">
          <APIProvider apiKey={apiKey}>
            <Map
              center={mapCenter}
              zoom={mapZoom}
              onCameraChanged={(ev) => {
                setMapCenter(ev.detail.center);
                setMapZoom(ev.detail.zoom);
              }}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full min-h-[460px] lg:min-h-[540px]"
              style={{ width: '100%', height: '100%' }}
            >
              {filteredNodes.map((node) => {
                const colors = getPinColors(node.status);
                return (
                  <AdvancedMarker
                    key={node.id}
                    position={{ lat: node.lat, lng: node.lng }}
                    onClick={() => setSelectedNode(node)}
                    title={`${node.name} - ${node.agentHarness}`}
                  >
                    <Pin
                      background={colors.background}
                      glyphColor={colors.glyphColor}
                      borderColor={colors.borderColor}
                      scale={selectedNode?.id === node.id ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedNode && (
                <InfoWindow
                  position={{ lat: selectedNode.lat, lng: selectedNode.lng }}
                  onCloseClick={() => setSelectedNode(null)}
                >
                  <div className="p-2 max-w-xs text-neutral-900 font-sans space-y-1.5">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-1">
                      <strong className="text-xs font-bold text-neutral-950 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {selectedNode.name}
                      </strong>
                    </div>

                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      {selectedNode.description}
                    </p>

                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono bg-neutral-100 p-1.5 rounded">
                      <div>
                        <span className="text-neutral-500 block">HARNESS</span>
                        <strong className="text-neutral-800">{selectedNode.agentHarness}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">PLATFORM</span>
                        <strong className="text-neutral-800">{selectedNode.chatPlatform}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">LATENCY</span>
                        <strong className="text-emerald-700">
                          {latencyOverrides[selectedNode.id] || selectedNode.latencyMs} ms
                        </strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">UPTIME</span>
                        <strong className="text-neutral-800">{selectedNode.uptime}</strong>
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Relay Linked
                      </span>
                      <span className="text-neutral-500">
                        ID: {selectedNode.id}
                      </span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Map Overlay Controls Footer */}
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex items-center justify-between">
            <div className="pointer-events-auto bg-neutral-950/85 backdrop-blur-md border border-neutral-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-neutral-300 flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Switch AI Global Edge Mesh Active</span>
              <span className="text-neutral-500">·</span>
              <span className="text-emerald-400">DEMO_MAP_ID</span>
            </div>

            <div className="pointer-events-auto bg-neutral-950/85 backdrop-blur-md border border-neutral-800 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-neutral-400 shadow-lg">
              Google Maps Platform
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
