import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { 
  Gamepad2, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Bot, 
  ShieldCheck, 
  ChevronUp, 
  ChevronDown, 
  Code2, 
  Database, 
  Send, 
  TestTube, 
  X, 
  Flame, 
  Radio, 
  Cpu 
} from 'lucide-react';

// Procedural Web Audio Sound Generator
function playProceduralSound(type: 'interact' | 'approve' | 'boost' | 'deploy' | 'switch' | 'test') {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'interact') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'approve') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'switch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'test') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(550, now + 0.06);
      osc.frequency.setValueAtTime(700, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'deploy') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'boost') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch {
    // Audio context policy guard
  }
}

// Procedural 2D Billboard Text Sprite Generator (Zero 404s)
function createTextSprite(title: string, subtitle: string, colorHex: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(5, 7, 10, 0.88)';
  ctx.strokeStyle = colorHex;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(10, 10, 492, 140, 24);
  ctx.fill();
  ctx.stroke();

  // Status indicator dot
  ctx.fillStyle = colorHex;
  ctx.beginPath();
  ctx.arc(42, 60, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(title, 70, 72);

  ctx.fillStyle = colorHex;
  ctx.font = '600 22px monospace';
  ctx.fillText(subtitle, 42, 122);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.2, 1.0, 1);
  return sprite;
}

// Procedural grid texture
function createProceduralGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.18;

  const step = 32;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#34d399';
  ctx.globalAlpha = 0.5;
  for (let x = 0; x <= 512; x += step * 2) {
    for (let y = 0; y <= 512; y += step * 2) {
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Radial shadow texture
function createRadialShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export interface BotDefinition {
  id: string;
  name: string;
  role: string;
  primaryColor: number;
  colorHex: string;
  accentColor: number;
  defaultPosition: [number, number, number];
  harness: string;
  description: string;
  specialty: string;
  codeSnippet: string;
}

export const BOT_DEFINITIONS: BotDefinition[] = [
  {
    id: 'bot-kotlin-firebase',
    name: 'FireSwitch Agent',
    role: 'Kotlin & Firebase Daemon',
    primaryColor: 0x10b981, // Emerald
    colorHex: '#10b981',
    accentColor: 0xf59e0b, // Amber
    defaultPosition: [0, 0.9, 0],
    harness: 'Kotlin / Firebase Agent',
    description: 'Autonomous Kotlin coroutine teammate syncing real-time state with Cloud Firestore and proposing atomic, defensive patches.',
    specialty: 'Real-time Firestore sync & null-safety validation',
    codeSnippet: `suspend fun triageIncident(db: FirebaseFirestore, incidentId: String): Result<Unit> = runCatching {
    val snapshot = db.collection("incidents").document(incidentId).get().await()
    require(snapshot.exists()) { "Incident $incidentId not found" }
    db.collection("incidents").document(incidentId).update("status", "PATCH_PROPOSED").await()
}`,
  },
  {
    id: 'bot-claude-code',
    name: 'Claude Code Scout',
    role: 'Anthropic AST Architect',
    primaryColor: 0xd97706, // Warm Terracotta Amber
    colorHex: '#d97706',
    accentColor: 0xef4444,
    defaultPosition: [-6, 0.9, -4],
    harness: 'Claude Code',
    description: 'Deep AST architectural investigator. Pipes CLI git blame and stack traces into structured triage cards directly in Slack or Discord.',
    specialty: 'Root-cause AST inspection & multi-file refactoring',
    codeSnippet: `claude triage --file src/auth/TokenProvider.kt \\
  --error "NullPointerException in refreshSession()" \\
  --output format:switch-card --interactive`,
  },
  {
    id: 'bot-cursor',
    name: 'Cursor HyperCopilot',
    role: 'Instant Diff & Linter',
    primaryColor: 0x06b6d4, // Cyan
    colorHex: '#06b6d4',
    accentColor: 0x6366f1,
    defaultPosition: [6, 0.9, -4],
    harness: 'Cursor',
    description: 'High-speed diff synthesizer. Evaluates incoming GitHub PRs, spots subtle memory leaks or unhandled null branches in 0.2s.',
    specialty: 'Fast diff generation & GitHub PR verification',
    codeSnippet: `export async function verifyPRDiff(prNumber: number) {
  const diff = await fetchPRDiff(prNumber);
  const review = await cursor.analyzeAST(diff, { ruleset: 'strict-nullability' });
  return review.generateDiscordEmbed();
}`,
  },
  {
    id: 'bot-opencode',
    name: 'OpenCode Release Bot',
    role: 'DevOps & ChatOps Agent',
    primaryColor: 0xd946ef, // Fuchsia
    colorHex: '#d946ef',
    accentColor: 0x3b82f6,
    defaultPosition: [0, 0.9, -7],
    harness: 'OpenCode',
    description: 'Command-driven autonomous DevOps worker. Handles "/deploy preview", semantic version tagging, and smoke testing from Telegram.',
    specialty: 'Continuous deployment & container health checks',
    codeSnippet: `opencode release create --tag "v1.4.2-hotfix" \\
  --target staging --smoke-test --require-human-approval`,
  },
];

interface Switch3DSceneProps {
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

export const Switch3DScene: React.FC<Switch3DSceneProps> = ({
  isFullScreen = false,
  onToggleFullScreen,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active Playable Bot & Interaction State
  const [activeBotId, setActiveBotId] = useState<string>('bot-kotlin-firebase');
  const [isGameMode, setIsGameMode] = useState<boolean>(true);
  const [xpPoints, setXpPoints] = useState<number>(250);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isControlsOpen, setIsControlsOpen] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Human Multi-Option Interaction Modal
  const [selectedBotForInteraction, setSelectedBotForInteraction] = useState<BotDefinition | null>(null);
  const [interactionResultLog, setInteractionResultLog] = useState<string | null>(null);

  // Mutable Game Input Refs (to preserve Three.js canvas stability)
  const gameInputRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    playerPos: new THREE.Vector3(0, 0.9, 0),
    playerVelocity: new THREE.Vector3(0, 0, 0),
    playerRotation: 0,
    isGrounded: true,
    isGameMode: true,
    activeBotId: 'bot-kotlin-firebase',
  });

  const activeBot = BOT_DEFINITIONS.find((b) => b.id === activeBotId) || BOT_DEFINITIONS[0];

  useEffect(() => {
    gameInputRef.current.isGameMode = isGameMode;
  }, [isGameMode]);

  useEffect(() => {
    gameInputRef.current.activeBotId = activeBotId;
  }, [activeBotId]);

  // Switch bot character
  const handleSelectPlayableBot = (botId: string) => {
    setActiveBotId(botId);
    const chosen = BOT_DEFINITIONS.find((b) => b.id === botId);
    if (chosen) {
      gameInputRef.current.playerPos.set(chosen.defaultPosition[0], 0.9, chosen.defaultPosition[2]);
      if (soundEnabled) playProceduralSound('switch');
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') gameInputRef.current.forward = true;
      if (key === 's' || key === 'arrowdown') gameInputRef.current.backward = true;
      if (key === 'a' || key === 'arrowleft') gameInputRef.current.left = true;
      if (key === 'd' || key === 'arrowright') gameInputRef.current.right = true;
      if (key === ' ' || key === 'spacebar') {
        e.preventDefault();
        if (gameInputRef.current.isGrounded) {
          gameInputRef.current.playerVelocity.y = 4.2;
          gameInputRef.current.isGrounded = false;
          if (soundEnabled) playProceduralSound('boost');
        }
      }
      if (key === 'e') {
        setSelectedBotForInteraction(activeBot);
        if (soundEnabled) playProceduralSound('interact');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'arrowup') gameInputRef.current.forward = false;
      if (key === 's' || key === 'arrowdown') gameInputRef.current.backward = false;
      if (key === 'a' || key === 'arrowleft') gameInputRef.current.left = false;
      if (key === 'd' || key === 'arrowright') gameInputRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeBot, soundEnabled]);

  // Interactive Options Execution Handlers
  const handleActionTriage = (bot: BotDefinition) => {
    if (soundEnabled) playProceduralSound('test');
    setXpPoints((prev) => prev + 100);
    setInteractionResultLog(`⚡ [${bot.name}] Generated defensive AST patch for Discord! Verified no null dereferences.`);
  };

  const handleActionApprove = (bot: BotDefinition) => {
    if (soundEnabled) playProceduralSound('approve');
    setXpPoints((prev) => prev + 250);
    setInteractionResultLog(`🛡️ [Human Approval] Sign-off granted by developer. Triggering atomic merge via Switch AI Gateway (+250 XP)!`);
  };

  const handleActionTestHarness = (bot: BotDefinition) => {
    if (soundEnabled) playProceduralSound('test');
    setXpPoints((prev) => prev + 50);
    setInteractionResultLog(`🧪 [Test Suite] Kotlin Coroutines 5/5 assertions PASSED in 42ms.`);
  };

  const handleActionDeploy = (bot: BotDefinition) => {
    if (soundEnabled) playProceduralSound('deploy');
    setXpPoints((prev) => prev + 200);
    setInteractionResultLog(`🚀 [Deploy] Successfully deployed container image to production with Cloud Firestore audit record.`);
  };

  // -----------------------------------------------------------------
  // Three.js Scene Setup & Loop
  // -----------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070a);
    scene.fog = new THREE.FogExp2(0x05070a, 0.032);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 9, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 3.4);
    keyLight.position.set(8, 14, 10);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 40;
      keyLight.shadow.camera.left = -16;
      keyLight.shadow.camera.right = 16;
      keyLight.shadow.camera.top = 16;
      keyLight.shadow.camera.bottom = -16;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(hemiLight);

    const rimLight = new THREE.PointLight(0x10b981, 4.0, 25);
    rimLight.position.set(-8, 5, -5);
    scene.add(rimLight);

    // Ground Plane with Procedural Grid
    const gridTexture = createProceduralGridTexture();
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      map: gridTexture,
      roughness: 0.8,
      metalness: 0.25,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // Arena Perimeter
    const arenaRing = new THREE.Mesh(
      new THREE.RingGeometry(18.8, 19.0, 64),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    );
    arenaRing.rotation.x = -Math.PI / 2;
    arenaRing.position.y = 0.02;
    scene.add(arenaRing);

    // Shadow Texture
    const shadowTex = createRadialShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(3.0, 3.0);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    // -------------------------------------------------------------
    // Procedural Assembly for All 4 Named Bots with Unique Aesthetics
    // -------------------------------------------------------------
    const botMeshesMap: Record<string, THREE.Group> = {};
    const botShadowsMap: Record<string, THREE.Mesh> = {};
    const flameMeshesMap: Record<string, THREE.Mesh> = {};

    BOT_DEFINITIONS.forEach((botDef) => {
      const botGroup = new THREE.Group();
      botGroup.position.set(botDef.defaultPosition[0], botDef.defaultPosition[1], botDef.defaultPosition[2]);

      const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.85 });
      const darkArmorMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.4, metalness: 0.7 });
      const glowingCoreMat = new THREE.MeshStandardMaterial({
        color: botDef.primaryColor,
        emissive: botDef.primaryColor,
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.9,
      });
      const accentMat = new THREE.MeshStandardMaterial({ color: botDef.accentColor, roughness: 0.2, metalness: 0.95 });
      const visorMat = new THREE.MeshStandardMaterial({
        color: botDef.primaryColor,
        emissive: botDef.primaryColor,
        emissiveIntensity: 3.5,
        roughness: 0.1,
      });

      // Thruster Base
      const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.35, 24), darkArmorMat);
      thruster.position.y = 0.4;
      thruster.castShadow = !isSoftwareGl;
      botGroup.add(thruster);

      // Pelvis Joint
      const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), accentMat);
      pelvis.position.y = 0.85;
      pelvis.castShadow = !isSoftwareGl;
      botGroup.add(pelvis);

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.1, 0.7), chassisMat);
      torso.position.y = 1.55;
      torso.castShadow = !isSoftwareGl;
      botGroup.add(torso);

      // Glowing Reactor Core
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), glowingCoreMat);
      core.position.set(0, 1.55, 0.32);
      botGroup.add(core);

      // Core Shielding Ring
      const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 12, 24), accentMat);
      coreRing.position.set(0, 1.55, 0.33);
      botGroup.add(coreRing);

      // Head & Visor
      const headG = new THREE.Group();
      headG.position.set(0, 2.45, 0);
      const skull = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.6), chassisMat);
      skull.castShadow = !isSoftwareGl;
      headG.add(skull);

      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.18, 0.1), visorMat);
      visor.position.set(0, 0.05, 0.32);
      headG.add(visor);

      // Bot-specific head attachments
      if (botDef.id === 'bot-kotlin-firebase') {
        // Twin Firebase Horns
        const hornGeo = new THREE.ConeGeometry(0.08, 0.35, 8);
        const hornL = new THREE.Mesh(hornGeo, accentMat);
        hornL.position.set(-0.25, 0.35, 0);
        hornL.rotation.z = -0.3;
        headG.add(hornL);

        const hornR = new THREE.Mesh(hornGeo, accentMat);
        hornR.position.set(0.25, 0.35, 0);
        hornR.rotation.z = 0.3;
        headG.add(hornR);
      } else if (botDef.id === 'bot-claude-code') {
        // Sensor Scanner Radar
        const radar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.05, 0.15, 16), accentMat);
        radar.position.set(0, 0.35, 0);
        headG.add(radar);
      } else if (botDef.id === 'bot-cursor') {
        // Quantum Visor Wings
        const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.1), glowingCoreMat);
        wingL.position.set(-0.4, 0.05, 0.2);
        headG.add(wingL);
        const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.1), glowingCoreMat);
        wingR.position.set(0.4, 0.05, 0.2);
        headG.add(wingR);
      }
      botGroup.add(headG);

      // Floating Manipulator Arms
      const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.7, 12), chassisMat);
      armL.position.set(-0.85, 1.3, 0);
      armL.rotation.z = 0.25;
      botGroup.add(armL);

      const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.7, 12), chassisMat);
      armR.position.set(0.85, 1.3, 0);
      armR.rotation.z = -0.25;
      botGroup.add(armR);

      // Energy Halo
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(0.65, 0.025, 16, 32),
        new THREE.MeshBasicMaterial({ color: botDef.primaryColor, transparent: true, opacity: 0.85 })
      );
      halo.rotation.x = Math.PI / 2;
      halo.position.y = 2.95;
      botGroup.add(halo);

      // Thruster Flame
      const flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.6, 16),
        new THREE.MeshBasicMaterial({ color: botDef.primaryColor, transparent: true, opacity: 0.8 })
      );
      flame.rotation.x = Math.PI;
      flame.position.y = 0.15;
      botGroup.add(flame);
      flameMeshesMap[botDef.id] = flame;

      // 3D Billboard Nameplate floating above bot
      const nameplate = createTextSprite(botDef.name, botDef.role, botDef.colorHex);
      nameplate.position.set(0, 3.8, 0);
      botGroup.add(nameplate);

      // Contact Shadow
      const bShadow = new THREE.Mesh(shadowGeo, shadowMat);
      bShadow.rotation.x = -Math.PI / 2;
      bShadow.position.set(botDef.defaultPosition[0], 0.025, botDef.defaultPosition[2]);
      scene.add(bShadow);

      scene.add(botGroup);
      botMeshesMap[botDef.id] = botGroup;
      botShadowsMap[botDef.id] = bShadow;
    });

    // Central Switch AI Neural Gateway Hub (Center Platform)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0, 0, 0);
    const hubBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2.4, 2.8, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 })
    );
    hubBase.position.y = 0.2;
    hubGroup.add(hubBase);

    const hubRing = new THREE.Mesh(
      new THREE.RingGeometry(2.4, 2.5, 48),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    hubRing.rotation.x = -Math.PI / 2;
    hubRing.position.y = 0.03;
    hubGroup.add(hubRing);

    const hubLabel = createTextSprite('SWITCH AI GATEWAY', 'Central Message Bus & Hub', '#34d399');
    hubLabel.position.set(0, 2.2, 0);
    hubLabel.scale.set(3.6, 1.1, 1);
    hubGroup.add(hubLabel);

    scene.add(hubGroup);

    // Spline Tubes connecting all bots to Central Hub
    const splineTubes: THREE.Mesh[] = [];
    BOT_DEFINITIONS.forEach((botDef) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(botDef.defaultPosition[0], 1.2, botDef.defaultPosition[2]),
        new THREE.Vector3(botDef.defaultPosition[0] * 0.5, 2.0, botDef.defaultPosition[2] * 0.5),
        new THREE.Vector3(0, 0.8, 0),
      ]);
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 32, 0.05, 8, false),
        new THREE.MeshStandardMaterial({
          color: botDef.primaryColor,
          emissive: botDef.primaryColor,
          emissiveIntensity: 1.2,
          transparent: true,
          opacity: 0.55,
        })
      );
      scene.add(tube);
      splineTubes.push(tube);
    });

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 35;
    controls.target.set(0, 1.5, 0);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const input = gameInputRef.current;
      const currentActiveId = input.activeBotId;

      // Update Playable Bot Kinematics
      if (input.isGameMode) {
        const moveSpeed = 6.4;
        const turnSpeed = 4.5;

        if (input.left) input.playerRotation += turnSpeed * delta;
        if (input.right) input.playerRotation -= turnSpeed * delta;

        const forwardDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), input.playerRotation);

        if (input.forward) {
          input.playerPos.addScaledVector(forwardDir, moveSpeed * delta);
        }
        if (input.backward) {
          input.playerPos.addScaledVector(forwardDir, -moveSpeed * 0.6 * delta);
        }

        // Perimeter bounds
        const distFromCenter = Math.hypot(input.playerPos.x, input.playerPos.z);
        if (distFromCenter > 18) {
          const angle = Math.atan2(input.playerPos.z, input.playerPos.x);
          input.playerPos.x = Math.cos(angle) * 18;
          input.playerPos.z = Math.sin(angle) * 18;
        }

        // Gravity & Jump
        input.playerVelocity.y -= 9.8 * delta;
        input.playerPos.y += input.playerVelocity.y * delta;

        if (input.playerPos.y <= 0.9) {
          input.playerPos.y = 0.9;
          input.playerVelocity.y = 0;
          input.isGrounded = true;
        }

        // Update active bot transform
        const activeBotMesh = botMeshesMap[currentActiveId];
        const activeBotShadow = botShadowsMap[currentActiveId];
        const activeFlame = flameMeshesMap[currentActiveId];

        if (activeBotMesh && activeBotShadow) {
          activeBotMesh.position.copy(input.playerPos);
          activeBotMesh.rotation.y = input.playerRotation;

          // Bobbing
          const hoverBob = Math.sin(elapsed * 4.5) * 0.06;
          activeBotMesh.position.y += hoverBob;

          // Shadow
          activeBotShadow.position.set(input.playerPos.x, 0.025, input.playerPos.z);
          const heightFactor = Math.max(0.3, 1 - (input.playerPos.y - 0.9) * 0.35);
          activeBotShadow.scale.set(heightFactor, heightFactor, 1);

          // Thruster flame scale
          const isMoving = input.forward || input.backward || !input.isGrounded;
          if (activeFlame) {
            activeFlame.scale.set(
              isMoving ? 1.4 : 0.8,
              isMoving ? 1.8 + Math.random() * 0.4 : 0.6,
              isMoving ? 1.4 : 0.8
            );
          }
        }

        // Third-person chase camera
        const targetCamPos = input.playerPos.clone().add(
          new THREE.Vector3(0, 4.2, 7.8).applyAxisAngle(new THREE.Vector3(0, 1, 0), input.playerRotation)
        );
        camera.position.lerp(targetCamPos, 1 - Math.exp(-4.5 * delta));
        controls.target.lerp(input.playerPos.clone().add(new THREE.Vector3(0, 1.4, 0)), 1 - Math.exp(-6.0 * delta));
      } else {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.8;
        controls.update();
      }

      // Idle hover animation on inactive bots
      BOT_DEFINITIONS.forEach((botDef) => {
        if (botDef.id !== currentActiveId) {
          const mesh = botMeshesMap[botDef.id];
          const shadow = botShadowsMap[botDef.id];
          if (mesh && shadow) {
            const bob = Math.sin(elapsed * 2.5 + botDef.defaultPosition[0]) * 0.1;
            mesh.position.y = 0.9 + bob;
            shadow.scale.setScalar(1 - bob * 0.5);
          }
        }
      });

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      gridTexture.dispose();
      shadowTex.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate]);

  return (
    <div className={`relative w-full ${isFullScreen ? 'h-screen fixed inset-0 z-50 bg-neutral-950' : 'h-[640px] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl'}`}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full select-none" />

      {/* Top Left: Active Bot Card & XP */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-auto">
        <div className="flex items-center gap-3 bg-neutral-950/90 border border-neutral-800 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-xl">
          <div
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20"
            style={{ backgroundColor: activeBot.colorHex }}
          />
          <div>
            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <span>{activeBot.name.toUpperCase()}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{xpPoints} XP</span>
              </span>
            </div>
            <div className="text-[11px] text-neutral-300 font-mono">
              Role: <span className="text-white font-medium">{activeBot.role}</span>
            </div>
          </div>
        </div>

        {/* Action Result Notification Banner */}
        {interactionResultLog && (
          <div className="px-3.5 py-2 rounded-xl bg-neutral-950/90 border border-emerald-500/40 text-xs font-mono text-emerald-300 max-w-lg shadow-lg flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-1">
            <span>{interactionResultLog}</span>
            <button onClick={() => setInteractionResultLog(null)} className="text-neutral-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Top Right: Mode & Audio Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-xl border transition-all ${
            soundEnabled ? 'bg-neutral-900 border-neutral-700 text-emerald-400' : 'bg-neutral-950 border-neutral-800 text-neutral-500'
          }`}
          title={soundEnabled ? 'Mute Procedural Audio' : 'Enable Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setIsGameMode(!isGameMode)}
          className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all flex items-center gap-1.5 ${
            isGameMode ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' : 'bg-neutral-900/80 border-neutral-800 text-neutral-400'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>{isGameMode ? 'WASD Pilot' : 'Orbit'}</span>
        </button>

        <button
          onClick={() => setSelectedBotForInteraction(activeBot)}
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interact [E]</span>
        </button>

        {onToggleFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Human Multi-Option Decision Terminal (Modal) */}
      {selectedBotForInteraction && (
        <div className="absolute inset-0 z-30 bg-neutral-950/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedBotForInteraction.colorHex }}
                >
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <span>{selectedBotForInteraction.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {selectedBotForInteraction.harness}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {selectedBotForInteraction.specialty}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBotForInteraction(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
              {selectedBotForInteraction.description}
            </p>

            {/* Code Snippet Preview */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agent Execution Routine:</span>
              </div>
              <pre className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 overflow-x-auto max-h-24">
                {selectedBotForInteraction.codeSnippet}
              </pre>
            </div>

            {/* 4 Interactive Option Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => handleActionTriage(selectedBotForInteraction)}
                className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-colors flex items-center gap-2.5"
              >
                <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">1. Run AST Triage</div>
                  <div className="text-[10px] text-neutral-400">Generate defensive fix (+100 XP)</div>
                </div>
              </button>

              <button
                onClick={() => handleActionApprove(selectedBotForInteraction)}
                className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-left transition-colors flex items-center gap-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-300">2. Human Sign-Off</div>
                  <div className="text-[10px] text-emerald-400">Approve & Merge (+250 XP)</div>
                </div>
              </button>

              <button
                onClick={() => handleActionTestHarness(selectedBotForInteraction)}
                className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-colors flex items-center gap-2.5"
              >
                <TestTube className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">3. Run Test Suite</div>
                  <div className="text-[10px] text-neutral-400">Validate Coroutines (+50 XP)</div>
                </div>
              </button>

              <button
                onClick={() => handleActionDeploy(selectedBotForInteraction)}
                className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-left transition-colors flex items-center gap-2.5"
              >
                <Send className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">4. Deploy Hotfix</div>
                  <div className="text-[10px] text-neutral-400">Release to Prod (+200 XP)</div>
                </div>
              </button>
            </div>

            {/* Bottom button: Pilot This Bot */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  handleSelectPlayableBot(selectedBotForInteraction.id);
                  setSelectedBotForInteraction(null);
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-white transition-colors flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-emerald-400" />
                <span>Take Direct Pilot Control of {selectedBotForInteraction.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock with Bot Switcher */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[900px] transition-all duration-300 pointer-events-auto ${
          isControlsOpen ? 'translate-y-0 opacity-100' : 'translate-y-[calc(100%-36px)] opacity-95'
        }`}
      >
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsOpen(!isControlsOpen)}
            className="px-4 py-1 text-[11px] font-mono font-medium rounded-t-lg bg-neutral-900/95 hover:bg-neutral-800 border-t border-x border-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1.5 shadow-lg"
          >
            {isControlsOpen ? (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hide Controls (Zen View)</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch Bots & Options</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Panel */}
        <div className="p-3 sm:p-4 rounded-2xl bg-neutral-950/95 border border-neutral-800 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Bot Roster Switcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="text-[11px] font-mono text-neutral-400 hidden lg:inline mr-1">Roster:</span>
            {BOT_DEFINITIONS.map((bot) => {
              const isActive = bot.id === activeBotId;
              return (
                <button
                  key={bot.id}
                  onClick={() => handleSelectPlayableBot(bot.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-neutral-800 text-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                  }`}
                  title={`Pilot ${bot.name} (${bot.harness})`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: bot.colorHex }}
                  />
                  <span className="font-semibold">{bot.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Triggers */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSelectedBotForInteraction(activeBot)}
              className="px-3.5 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Options Menu [E]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
