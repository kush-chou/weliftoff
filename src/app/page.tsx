"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Volume2,
  VolumeX,
  GitBranch,
  ShieldCheck,
  Terminal,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Lock,
  RefreshCw,
} from "lucide-react";

/* --- Ephemeral Acoustic Feedback Synthesizer (Native AudioContext < 80ms) --- */
class AcousticSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        const len = Math.ceil(this.ctx.sampleRate * 0.045);
        this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = Math.random() * 2 - 1;
        }
      }
    }
  }

  private detuneForCode(code: string): number {
    let h = 0;
    for (let i = 0; i < code.length; i++) {
      h = (h * 31 + code.charCodeAt(i)) | 0;
    }
    return 1 + ((Math.abs(h) % 13) - 6) * 0.01;
  }

  public keyDown(code: string = "KeyA", repeat: boolean = false) {
    if (!this.enabled || repeat) return;
    try {
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const detune = this.detuneForCode(code);
      const isStabilized =
        code === "Space" ||
        code === "Enter" ||
        code === "Backspace" ||
        code.includes("Shift");

      // 1. Tactile Leaf Transient (Filtered Noise Burst)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(
        (isStabilized ? 1800 : 2600) * detune,
        now
      );
      filter.Q.setValueAtTime(3.2, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.055, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.009);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.01);

      // 2. Switch Housing Bottom-Out "Thock"
      const dur = isStabilized ? 0.036 : 0.028;
      const osc = this.ctx.createOscillator();
      const oGain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime((isStabilized ? 130 : 185) * detune, now);
      osc.frequency.exponentialRampToValueAtTime(
        (isStabilized ? 44 : 62) * detune,
        now + dur
      );
      oGain.gain.setValueAtTime(0.065, now);
      oGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(oGain);
      oGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + dur);
    } catch {
      // Ignore autoplay restrictions prior to user gesture
    }
  }

  public keyUp(code: string = "KeyA") {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx || !this.noiseBuffer) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const detune = this.detuneForCode(code);
      const isStabilized =
        code === "Space" ||
        code === "Enter" ||
        code === "Backspace" ||
        code.includes("Shift");

      // 3. Top-Out Stem Rebound
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(
        (isStabilized ? 2300 : 3300) * detune,
        now
      );
      filter.Q.setValueAtTime(4.0, now);
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.024, now);
      nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);
      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.008);

      const osc = this.ctx.createOscillator();
      const oGain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(240 * detune, now);
      osc.frequency.exponentialRampToValueAtTime(110 * detune, now + 0.016);
      oGain.gain.setValueAtTime(0.028, now);
      oGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);
      osc.connect(oGain);
      oGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.016);
    } catch {
      // Ignore autoplay restrictions prior to user gesture
    }
  }

  public sweep(
    startFreq: number,
    endFreq: number,
    type: OscillatorType = "triangle",
    duration: number = 0.055
  ) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore browser autoplay restrictions prior to user gesture
    }
  }

  public click() {
    this.sweep(680, 880, "triangle", 0.035);
  }

  public commit() {
    this.sweep(520, 1040, "sine", 0.065);
  }

  public drift() {
    this.sweep(310, 140, "sawtooth", 0.075);
  }

  public restore() {
    this.sweep(440, 1320, "triangle", 0.075);
  }
}

const audio = new AcousticSynthesizer();

/* --- Data Structures Over Flags: Domain & Telemetry Registries --- */
type DagMode = "atomic" | "drift" | "reflog";
type InvariantKey = "foss" | "dpdp" | "commerce" | "custody";
type PhaseKey = "phase1" | "phase2";

interface DagTelemetry {
  headRef: string;
  entropyBits: string;
  rollbackBound: string;
  workingTreeStatus: string;
  springStiffness: number;
  turbulence: number;
  accentColor: string;
}

const DAG_TELEMETRY: Record<DagMode, DagTelemetry> = {
  atomic: {
    headRef: "HEAD -> main [SHA: f71a9e4]",
    entropyBits: "0.02 bits [BOUNDED]",
    rollbackBound: "0.0 ms [CLEAN WORKING TREE]",
    workingTreeStatus: "7/7 STATE CHECKPOINTS VERIFIED",
    springStiffness: 0.075,
    turbulence: 0,
    accentColor: "#10B981",
  },
  drift: {
    headRef: "DETACHED [UNTRACKED AST MUTATIONS]",
    entropyBits: "8.94 bits [UNBOUNDED DRIFT]",
    rollbackBound: "NON-DETERMINISTIC // UNBOUNDED",
    workingTreeStatus: "AST FRACTURE // SCHEMA COLLISION",
    springStiffness: 0.006,
    turbulence: 3.4,
    accentColor: "#EF4444",
  },
  reflog: {
    headRef: "REFLOG -> HEAD@{0} [8e4f1a2]",
    entropyBits: "0.00 bits [CONVERGED]",
    rollbackBound: "11.4 ms [DETERMINISTIC RESET]",
    workingTreeStatus: "STATE RESTORED VIA GIT REFLOG",
    springStiffness: 0.12,
    turbulence: 0,
    accentColor: "#FF4F00",
  },
};

interface ComplianceRecord {
  id: InvariantKey;
  code: string;
  title: string;
  metric: string;
  summary: string;
  architecturalMechanism: string;
  legalBound: string;
  verificationGate: string;
}

const COMPLIANCE_REGISTRY: ComplianceRecord[] = [
  {
    id: "foss",
    code: "[INV.01 // LICENSING]",
    title: "Apache-2.0 & Verifiable DAG",
    metric: "100% PUBLIC REPOSITORY",
    summary:
      "Complete source history, reproducible build configurations, and verified commit graphs published under the Apache-2.0 permissive license.",
    architecturalMechanism:
      "Public GitHub repository under github.com/substrata-labs documenting 60+ atomic commits with Confidence 1.0 git-ledger attribution trailers.",
    legalBound:
      "Permissive Apache-2.0 patent and copyright grant; all graphic assets and typefaces restricted to SIL OFL and Apache-2.0 Material Symbols.",
    verificationGate:
      "Automated git-ledger commit audit and SPDX license header check enforcing bisect-safe commit history prior to Day 7 freeze.",
  },
  {
    id: "dpdp",
    code: "[INV.02 // CHILD SAFEGUARDING]",
    title: "Zero-Egress & DPDP §9 Compliance",
    metric: "0 BYTES NETWORK EGRESS",
    summary:
      "Local-first SQLite/Room persistence. Application logic executes entirely on-device without remote accounts, cloud databases, or tracking telemetry.",
    architecturalMechanism:
      "Merged Android Manifest strips android.permission.INTERNET via tools:node='remove'. Build failure is enforced if network permissions are introduced.",
    legalBound:
      "Full compliance with Section 9 of the DPDP Act 2023. Student legal identities and boarding houses are excluded from public artifacts in favor of pseudonymized handles.",
    verificationGate:
      "Positive test: ./gradlew verifyZeroEgress passes on debug/release. Negative test: injected INTERNET permission halts compilation.",
  },
  {
    id: "commerce",
    code: "[INV.03 // MONETIZATION]",
    title: "Zero Commercial Surface",
    metric: "0 AD SDKS / 0 IAPS",
    summary:
      "Utility software engineered strictly for campus life. Complete omission of ad networks, in-app billing libraries, and commercial merchant SDKs.",
    architecturalMechanism:
      "Prohibits Google Play Billing Library, ad mediation frameworks, and proprietary tracking SDKs from libs.versions.toml.",
    legalBound:
      "Protects student minors and host institutions from commercial liabilities, merchant KYC, and financial compliance overhead.",
    verificationGate:
      "Gradle dependency tree inspection (./gradlew app:dependencies) confirming zero proprietary monetization binaries.",
  },
  {
    id: "custody",
    code: "[INV.04 // SOVEREIGNTY]",
    title: "Custodial IP Transfer at Age 18",
    metric: "100% STUDENT OWNERSHIP",
    summary:
      "Applications published under Substrata Labs during minority to satisfy Google Play testing requirements, with full legal assignment to the student at age 18.",
    architecturalMechanism:
      "Release signing keys maintained in protected GitHub Actions Environments using per-crew isolated upload keystores (upload-<slug>.jks).",
    legalBound:
      "Co-signed Parental & Institutional Custodial Agreement under Govt. of India MSME (UDYAM-RJ-37-0014993) granting irrevocable Apache-2.0 fork rights to both crew members.",
    verificationGate:
      "Cryptographic SHA-256 signing fingerprint and In-App Identity Colophon Screen baked into graduation dossier.",
  },
];

interface SyllabusNode {
  dayRange: string;
  code: string;
  title: string;
  artifact: string;
  specification: string;
  verificationCmd: string;
}

const SYLLABUS_DAG: Record<PhaseKey, SyllabusNode[]> = {
  phase1: [
    {
      dayRange: "DAYS 01–02",
      code: "NODE.01 // STATE STEERING",
      title: "Toolchain Provisioning & Terminal Mechanics",
      artifact: "Configured Toolchain + ADB Handset Pairing",
      specification:
        "Provision OpenJDK 17, Android CLI, Gradle wrapper, and local cache offline from USB. Establish working-tree hygiene, atomic commit discipline, and deterministic recovery via git restore and git reflog.",
      verificationCmd: "android --version && git reflog --oneline -n 5 && adb devices",
    },
    {
      dayRange: "DAYS 03–04",
      code: "NODE.02 // DOMAIN MODELING",
      title: "Architectural Specification (EGM)",
      artifact: "docs/spec.md + UiState<out T> Container",
      specification:
        "Author declarative requirements with full-context Elephant agents (/egm-draft), audit with stateless Goldfish reviewers (/egm-review), maintain 20,000 token budget, and model screen state using UiState<out T>.",
      verificationCmd: "agy-skills status --json && ./gradlew compileDebugKotlin --console=plain",
    },
    {
      dayRange: "DAYS 05–06",
      code: "NODE.03 // PERSISTENCE",
      title: "Local SQLite & Room Architecture",
      artifact: "Room @Entity + KSP @Dao + Schema Migrations",
      specification:
        "Implement offline-first data persistence using Room SQLite with KSP codegen. Enforce deterministic state transitions and verify zero network egress.",
      verificationCmd: "./gradlew testDebugUnitTest verifyZeroEgress",
    },
    {
      dayRange: "DAY 07",
      code: "NODE.04 // FEATURE FREEZE",
      title: "Pull Request Audit & Scope Lock",
      artifact: "Merged Main Branch + Physical Handset Audit",
      specification:
        "Conduct cross-crew pull request reviews using git-ledger. Audit 60fps UI performance and view hierarchies via android layout and scrcpy over USB.",
      verificationCmd: "git ledger --last --agents-only",
    },
  ],
  phase2: [
    {
      dayRange: "DAYS 08–09",
      code: "NODE.05 // REPRODUCIBLE BUILD",
      title: "Material 3 UI & In-App Colophon",
      artifact: "Signed Production APK + Identity Screen",
      specification:
        "Implement Material 3 tokens, edge-to-edge window insets, R8/ProGuard shrinking, and integrate the in-app Colophon Screen displaying student handles, commit SHA, and license.",
      verificationCmd: "./gradlew assembleRelease && android layout",
    },
    {
      dayRange: "DAYS 10–11",
      code: "NODE.06 // PLAY STORE DEPLOY",
      title: "Google Play Store Publishing",
      artifact: "Track 1 Internal Sharing + Track 3 FOSS APK",
      specification:
        "Author Store listings and zero-data safety declarations. Validate release bundles with bundletool, deploy Track 1 (Google Play Internal App Sharing), and publish Track 3 (GitHub Releases signed APK).",
      verificationCmd: "./gradlew uploadReleasePrivateBundle",
    },
    {
      dayRange: "DAYS 12–13",
      code: "NODE.07 // TECHNICAL DOSSIER",
      title: "System Documentation & Closed Testing",
      artifact: "Architecture README + Track 2 Closed Testing",
      specification:
        "Author clean-slate architectural documentation with system diagrams and build instructions. Submit Track 2 (Google Play Closed Testing) for pre-registered school domain accounts.",
      verificationCmd: "gh pr status && ls -lh docs/architecture.md",
    },
    {
      dayRange: "DAY 14",
      code: "NODE.08 // EXHIBITION",
      title: "On-Campus Demo Day & Defense",
      artifact: "Auditorium Presentation + Direct QR Installation",
      specification:
        "Technical defense before faculty, housemasters, and peers. Attendees install production binaries directly via Demo Day QR codes and inspect the crew's 60+ atomic commit DAG.",
      verificationCmd: "sha256sum app-release-signed.apk",
    },
  ],
};

export default function WeLiftoffPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [dagMode, setDagMode] = useState<DagMode>("atomic");
  const [activeInvariantId, setActiveInvariantId] =
    useState<InvariantKey>("foss");
  const [activePhase, setActivePhase] = useState<PhaseKey>("phase1");
  const [cohortWindow, setCohortWindow] = useState("Winter 2026 Residency (Mayo College Pilot)");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    institution: "",
    email: "",
    notes: "",
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const telemetry = DAG_TELEMETRY[dagMode];
  const activeInvariant =
    COMPLIANCE_REGISTRY.find((c) => c.id === activeInvariantId) ??
    COMPLIANCE_REGISTRY[0]!;

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audio.enabled = next;
    if (next) audio.commit();
  };

  /* --- Mechanical Physics Engine: Git DAG & Working-Tree State Simulator --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 860);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 460);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    const dagShas = [
      "a10f4c2",
      "b48e91d",
      "c39b0d1",
      "d72a6e8",
      "e05c3f9",
      "8e4f1a2",
      "f71a9e4",
    ];
    const dagLabels = [
      "D01:usb-boot",
      "D03:spec-lock",
      "D05:room-dao",
      "D07:freeze",
      "D09:m3-colophon",
      "D11:tri-track",
      "D14:demo-day",
    ];

    interface DeltaParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      anchorIdx: number;
      orbitOffsetAngle: number;
      orbitRadius: number;
      angularVelocity: number;
      size: number;
    }

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      color: string;
    }

    const particles: DeltaParticle[] = [];
    const shockwaves: Shockwave[] = [];
    const totalParticles = 98;

    for (let i = 0; i < totalParticles; i++) {
      const anchorIdx = i % dagShas.length;
      const angle = (i / totalParticles) * Math.PI * 2;
      const radius = 14 + (i % 4) * 9;
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 180,
        y: height * 0.5 + (Math.random() - 0.5) * 140,
        vx: 0,
        vy: 0,
        anchorIdx,
        orbitOffsetAngle: angle,
        orbitRadius: radius,
        angularVelocity: (i % 2 === 0 ? 1 : -1) * (0.008 + (i % 5) * 0.002),
        size: 1.6 + (i % 3) * 0.7,
      });
    }

    if (dagMode === "reflog") {
      shockwaves.push({
        x: width * 0.5,
        y: height * 0.5,
        radius: 10,
        alpha: 0.9,
        color: "#FF4F00",
      });
    } else if (dagMode === "drift") {
      shockwaves.push({
        x: width * 0.5,
        y: height * 0.5,
        radius: 10,
        alpha: 0.85,
        color: "#EF4444",
      });
    }

    const pointer = { x: -1000, y: -1000, active: false };
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onMouseLeave = () => {
      pointer.active = false;
    };
    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 6,
        alpha: 0.85,
        color: "#FF4F00",
      });
      audio.click();
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 160) {
          const force = ((160 - dist) / 160) * 13;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);

    let tick = 0;
    const modeParams = DAG_TELEMETRY[dagMode];

    const render = () => {
      tick++;
      ctx.fillStyle = "#0B0C0E";
      ctx.fillRect(0, 0, width, height);

      // Architectural Blueprint Grid
      ctx.strokeStyle = "#161920";
      ctx.lineWidth = 1;
      const gridStep = 48;
      ctx.beginPath();
      for (let gx = 0; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy < height; gy += gridStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      // Canonical 7-Node Git Commit DAG Spine Coordinates
      const padX = Math.max(54, width * 0.09);
      const usableW = width - padX * 2;
      const centerY = height * 0.5;
      const anchors = dagShas.map((sha, idx) => {
        const frac = idx / (dagShas.length - 1);
        const ax = padX + frac * usableW;
        const ay =
          centerY +
          Math.sin(frac * Math.PI * 2 + tick * 0.012) *
            (dagMode === "drift" ? 44 : 18);
        return { x: ax, y: ay, sha, label: dagLabels[idx]! };
      });

      // Directed Graph Edges
      ctx.lineWidth = 1.5;
      ctx.strokeStyle =
        dagMode === "drift"
          ? "rgba(239, 68, 68, 0.35)"
          : "rgba(255, 79, 0, 0.55)";
      ctx.beginPath();
      for (let i = 0; i < anchors.length - 1; i++) {
        const curr = anchors[i]!;
        const next = anchors[i + 1]!;
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(next.x, next.y);
      }
      ctx.stroke();

      // Kinetic Working-Tree Particles
      particles.forEach((p, idx) => {
        p.orbitOffsetAngle += p.angularVelocity;
        const anchor = anchors[p.anchorIdx]!;
        const radiusMultiplier = dagMode === "drift" ? 3.4 : 1.0;
        const targetX =
          anchor.x +
          Math.cos(p.orbitOffsetAngle) * p.orbitRadius * radiusMultiplier;
        const targetY =
          anchor.y +
          Math.sin(p.orbitOffsetAngle) * p.orbitRadius * radiusMultiplier;

        p.vx += (targetX - p.x) * modeParams.springStiffness;
        p.vy += (targetY - p.y) * modeParams.springStiffness;

        if (modeParams.turbulence > 0) {
          p.vx +=
            Math.sin(tick * 0.09 + idx * 1.7) * modeParams.turbulence * 0.35;
          p.vy +=
            Math.cos(tick * 0.08 + idx * 2.3) * modeParams.turbulence * 0.35;
        }

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 105 && dist > 0) {
            const push = ((105 - dist) / 105) * 3.8;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        const distToAnchor = Math.hypot(p.x - anchor.x, p.y - anchor.y);
        if (distToAnchor < 64) {
          ctx.strokeStyle =
            dagMode === "drift"
              ? "rgba(239, 68, 68, 0.18)"
              : "rgba(16, 185, 129, 0.22)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(anchor.x, anchor.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        ctx.fillStyle =
          dagMode === "drift"
            ? idx % 2 === 0
              ? "#EF4444"
              : "#F59E0B"
            : idx % 3 === 0
              ? "#10B981"
              : "#F4F4F0";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Canonical Commit Anchor Nodes & Stage Labels
      const isCompact = width < 640;
      ctx.font = isCompact
        ? '9px "JetBrains Mono", monospace'
        : '10px "JetBrains Mono", monospace';
      anchors.forEach((a, idx) => {
        ctx.fillStyle = "#0B0C0E";
        ctx.strokeStyle =
          dagMode === "drift"
            ? "#EF4444"
            : idx === anchors.length - 1
              ? "#10B981"
              : "#FF4F00";
        ctx.lineWidth = 1.5;
        ctx.fillRect(a.x - 6, a.y - 6, 12, 12);
        ctx.strokeRect(a.x - 6, a.y - 6, 12, 12);

        ctx.fillStyle =
          dagMode === "drift"
            ? "#EF4444"
            : idx === anchors.length - 1
              ? "#10B981"
              : "#FF4F00";
        ctx.fillRect(a.x - 2, a.y - 2, 4, 4);

        const tierOffset = isCompact
          ? idx % 2 === 0
            ? -24 - (idx % 4 === 0 ? 14 : 0)
            : 28 + (idx % 4 === 1 ? 14 : 0)
          : idx % 2 === 0
            ? -22
            : 28;
        const labelY = a.y + tierOffset;
        ctx.fillStyle = "#8E95A5";
        ctx.textAlign = "center";
        ctx.fillText(isCompact ? a.sha.slice(0, 5) : a.sha, a.x, labelY);
        ctx.fillStyle = "#F4F4F0";
        const compactLabel = a.label.split(":")[0] ?? a.label;
        ctx.fillText(
          isCompact ? compactLabel : a.label,
          a.x,
          labelY + (idx % 2 === 0 ? -11 : 11)
        );
      });

      // Active Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s]!;
        sw.radius += 5.2;
        sw.alpha *= 0.93;
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        if (sw.alpha < 0.03) {
          shockwaves.splice(s, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mousedown", onMouseDown);
    };
  }, [dagMode]);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F4F0] flex flex-col selection:bg-[#FF4F00] selection:text-[#0B0C0E]">
      {/* Top Metadata Bar */}
      <div className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-2 font-mono text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#FF4F00] font-bold tracking-wider">
            WELIFTOFF // 0&rarr;1
          </span>
          <span className="hidden sm:inline text-[#3A3F4B]">|</span>
          <span className="hidden sm:inline text-[#F4F4F0]">
            INAUGURAL RESIDENCY: MAYO COLLEGE, AJMER
          </span>
          <span className="hidden lg:inline text-[#3A3F4B]">|</span>
          <span className="hidden lg:inline">
            14 DAYS // 28.0 LAB HOURS
          </span>
          <span className="hidden xl:inline text-[#3A3F4B]">|</span>
          <span className="hidden xl:inline">
            MSME: UDYAM-RJ-37-0014993
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-1.5 h-1.5 bg-[#10B981] inline-block" />
            ADMISSIONS OPEN // 10 CREWS (20 SEATS)
          </span>
          <button
            onClick={toggleAudio}
            title={
              audioEnabled
                ? "Mute Mechanical Keyswitch Audio"
                : "Enable Mechanical Keyswitch Audio"
            }
            aria-label="Toggle acoustic feedback"
            className="p-1 text-[#8E95A5] hover:text-[#F4F4F0] transition-colors cursor-pointer"
          >
            {audioEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Architectural Navigation */}
      <header className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-[#0B0C0E]/90">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF4F00] text-[#0B0C0E] flex items-center justify-center font-mono font-bold text-xs tracking-tighter">
            0&rarr;1
          </div>
          <div>
            <span className="font-display text-xl font-extrabold tracking-tight text-[#F4F4F0] block leading-none">
              WELIFTOFF
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8E95A5]">
              Substrata Labs Engineering Residency
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-7 font-mono text-xs uppercase tracking-wider text-[#8E95A5]">
          <a
            href="#thesis"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [01] Thesis
          </a>
          <a
            href="#pairing"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [02] Pairing Topology
          </a>
          <a
            href="#invariants"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [03] System Invariants
          </a>
          <a
            href="#syllabus"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [04] 14-Day DAG
          </a>
          <a
            href="#institutional"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [05] Operations
          </a>
        </nav>

        <a
          href="#contract"
          onClick={() => audio.click()}
          className="btn-primary-tactile px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider"
        >
          Reserve Cohort &rarr;
        </a>
      </header>

      {/* Hero Viewport: Asymmetric 12-Column Split */}
      <section id="thesis" className="hairline-b">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Left 4 Columns: Architectural Thesis Pane */}
          <div className="lg:col-span-4 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between bg-[#0B0C0E] space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
                SEC.01 // ON-CAMPUS ENGINEERING RESIDENCY
              </span>

              <h1 className="font-display text-fluid-hero font-bold text-[#F4F4F0] tracking-tight">
                Zero to Signed APK.{" "}
                <span className="font-serif italic font-normal text-[#FF4F00] block mt-1">
                  In 14 Deterministic Days.
                </span>
              </h1>

              <p className="text-sm text-[#8E95A5] leading-relaxed">
                High school engineers architect, verify, and ship production Android software
                using Antigravity 2.0 and the Elephant-Goldfish Model. Every cohort delivers
                verifiable open-source repositories, in-app cryptographic build colophons,
                and signed binaries published to Google Play and GitHub Releases.
              </p>
            </div>

            {/* Tabular Domain Bounds */}
            <div className="space-y-2.5 pt-4 hairline-t font-mono text-xs">
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">EXECUTION BOUND</span>
                <span className="font-semibold text-[#F4F4F0]">
                  14 Days · 28.0 Dedicated Lab Hours
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">COHORT TOPOLOGY</span>
                <span className="font-semibold text-[#FF4F00]">
                  10 Two-Student Crews (20 Seats)
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">AGENTIC RUNTIME</span>
                <span className="font-semibold text-[#F4F4F0]">
                  Antigravity 2.0 · Elephant-Goldfish Model
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">PERSISTENCE BOUND</span>
                <span className="font-semibold text-[#10B981]">
                  SQLite / Room · Zero Network Egress
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">DISTRIBUTION</span>
                <span className="font-semibold text-[#F4F4F0]">
                  Google Play (Internal &amp; Closed) · GitHub
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8E95A5]">PROVENANCE</span>
                <span className="font-semibold text-[#F4F4F0]">
                  In-App Colophon · 60+ Commit DAG (Apache-2.0)
                </span>
              </div>
            </div>

            {/* Single Primary Interaction Contract */}
            <div className="pt-2">
              <a
                href="#contract"
                onClick={() => audio.commit()}
                className="btn-primary-tactile block w-full py-3.5 text-center font-mono text-xs font-bold uppercase tracking-wider"
              >
                Request Institutional Prospectus &rarr;
              </a>
            </div>
          </div>

          {/* Right 8 Columns: Git DAG State Convergence Engine */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#0B0C0E] relative">
            {/* Control Header */}
            <div className="hairline-b px-4 sm:px-6 py-3 bg-[#111317] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-[10px] text-[#8E95A5] uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block"
                  style={{ backgroundColor: telemetry.accentColor }}
                />
                CANVAS TELEMETRY // GIT DAG STATE CONVERGENCE ENGINE
              </span>

              {/* Bounded Mechanical States */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    audio.commit();
                    setDagMode("atomic");
                  }}
                  className={`px-2.5 py-1 text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                    dagMode === "atomic"
                      ? "bg-[#10B981] text-[#0B0C0E] font-bold"
                      : "border border-[#3A3F4B] bg-[#0B0C0E] text-[#F4F4F0] hover:border-[#F4F4F0]"
                  }`}
                >
                  [01] Atomic Commit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.drift();
                    setDagMode("drift");
                  }}
                  className={`px-2.5 py-1 text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                    dagMode === "drift"
                      ? "bg-[#EF4444] text-[#0B0C0E] font-bold"
                      : "border border-[#3A3F4B] bg-[#0B0C0E] text-[#F4F4F0] hover:border-[#F4F4F0]"
                  }`}
                >
                  [02] Unbounded Drift
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.restore();
                    setDagMode("reflog");
                  }}
                  className={`px-2.5 py-1 text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                    dagMode === "reflog"
                      ? "bg-[#FF4F00] text-[#0B0C0E] font-bold"
                      : "border border-[#3A3F4B] bg-[#0B0C0E] text-[#F4F4F0] hover:border-[#F4F4F0]"
                  }`}
                >
                  [03] Reflog Restore
                </button>
              </div>
            </div>

            {/* Interactive Physics Canvas */}
            <div className="relative flex-1 min-h-[390px] sm:min-h-[460px] w-full overflow-hidden cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/90 px-2 py-1 hairline-all">
                STATE TOPOLOGY: 7 CANONICAL RELEASE CHECKPOINTS (D01 &rarr; D14)
              </div>
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5]">
                PHYSICS AUDIT: PERTURB WORKING-TREE PARTICLES TO OBSERVE CONVERGENCE DYNAMICS
              </div>
            </div>

            {/* Telemetry Readout */}
            <div className="hairline-t px-4 sm:px-6 py-2.5 bg-[#111317] font-mono text-[10px] sm:text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-4">
              <span>
                REF:{" "}
                <strong
                  style={{ color: telemetry.accentColor }}
                  className="font-bold"
                >
                  {telemetry.headRef}
                </strong>
              </span>
              <span>
                STATE ENTROPY:{" "}
                <strong className="text-[#F4F4F0]">
                  {telemetry.entropyBits}
                </strong>
              </span>
              <span>
                RECOVERY BOUND:{" "}
                <strong className="text-[#10B981]">
                  {telemetry.rollbackBound}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEC.02: Pairing Topology & Verification Cadence */}
      <section id="pairing" className="hairline-b bg-[#111317]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
                SEC.02 // DUAL-WORKSTATION PAIRING TOPOLOGY
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Separation of Steering{" "}
                <span className="font-serif italic font-normal text-[#FF4F00] block">
                  And Verification.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                Autonomous software construction requires strict separation of execution and auditing.
                Each crew operates a paired workstation topology with continuous role rotation across
                feature slices during the scheduled 18:00–20:00 laboratory session.
              </p>
            </div>

            <div className="pt-6 font-mono text-[11px] text-[#8E95A5] space-y-2">
              <div className="text-[#F4F4F0] font-bold flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#FF4F00]" />
                DETERMINISTIC SEAT ROTATION (crew-swap.sh):
              </div>
              <p className="leading-relaxed">
                Roles rotate across feature slices via <code className="text-[#FF4F00]">bash scripts/crew-swap.sh</code>.
                Local Git configuration, author credentials, and commit templates rotate deterministically,
                guaranteeing balanced contribution parity across both student handles.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
            {/* Primary Terminal */}
            <div className="p-6 sm:p-8 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF4F00] font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  TERMINAL 1 // PRIMARY WORKSTATION
                </span>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Synthesis &amp; Hardware Tether
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Tethered to the physical Android handset over ADB. Executes Antigravity 2.0 code synthesis,
                  Gradle builds, and on-device runtime deployments under a 20,000 active token budget ceiling.
                </p>
              </div>

              <div className="p-4 bg-[#111317] hairline-all font-mono text-[11px] space-y-1.5 text-[#8E95A5]">
                <div className="text-[#FF4F00] font-bold">
                  $ agy-skills status --json
                </div>
                <div>{'{ "budget_ceiling": 20000, "active_tokens": 4820, "status": "nominal" }'}</div>
                <div className="text-[#10B981] pt-1">
                  ✓ Token consumption within sovereign 20k cap
                </div>
                <div className="text-[#F4F4F0]">
                  $ android run &rarr; deploy native APK to connected hardware
                </div>
              </div>
            </div>

            {/* Auditor Station */}
            <div className="p-6 sm:p-8 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  TERMINAL 2 // AUDITOR STATION
                </span>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Verification &amp; Specification Gate
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Dedicated to architectural specification (docs/spec.md), read-only AST diff auditing
                  with git-ledger, scrcpy device mirroring, and compile-time zero-egress validation.
                </p>
              </div>

              <div className="p-4 bg-[#111317] hairline-all font-mono text-[11px] space-y-1.5 text-[#8E95A5]">
                <div className="text-[#10B981] font-bold">
                  $ git ledger --diff --md
                </div>
                <div>Agent: antigravity | Model: gemini-2.5-pro</div>
                <div>Prompted-by: dev-handle-a | Audited-by: dev-handle-b</div>
                <div className="text-[#10B981] pt-1">
                  ✓ Confidence 1.0 commit attribution verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEC.03: Sovereign Legal & Architectural Invariants */}
      <section id="invariants" className="hairline-b">
        <div className="p-6 sm:p-8 hairline-b flex flex-wrap items-end justify-between gap-4 bg-[#0B0C0E]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
              SEC.03 // COMPLIANCE &amp; SOVEREIGNTY MATRIX
            </span>
            <h2 className="font-display text-fluid-h3 font-bold text-[#F4F4F0] tracking-tight mt-1">
              Four Non-Negotiable Production Invariants
            </h2>
          </div>
          <p className="font-mono text-xs text-[#8E95A5] max-w-md">
            Select any invariant below to inspect its architectural enforcement
            mechanism, statutory DPDP boundary, and deterministic verification gate.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 hairline-b">
          {COMPLIANCE_REGISTRY.map((item, idx) => {
            const isSelected = item.id === activeInvariantId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  audio.click();
                  setActiveInvariantId(item.id);
                }}
                className={`p-6 text-left ${
                  idx < 3 ? "lg:hairline-r" : ""
                } ${idx % 2 === 0 ? "md:hairline-r lg:border-r-[#262930]" : ""} hairline-b lg:hairline-b-0 cursor-pointer transition-colors flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#15181E]"
                    : "bg-[#0B0C0E] hover:bg-[#111317]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isSelected ? "text-[#FF4F00]" : "text-[#8E95A5]"
                      }`}
                    >
                      {item.code}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 bg-[#FF4F00] text-[#0B0C0E] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8E95A5] leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 hairline-t font-mono text-[11px] text-[#10B981] font-semibold">
                  BOUND: {item.metric}
                </div>
              </button>
            );
          })}
        </div>

        {/* Invariant Detail Dossier */}
        <div className="p-6 sm:p-8 bg-[#111317] grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-4 space-y-1 hairline-b lg:hairline-b-0 lg:hairline-r pb-4 lg:pb-0 lg:pr-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
              ACTIVE SPECIFICATION // {activeInvariant.code}
            </span>
            <h4 className="font-display text-2xl font-bold text-[#F4F4F0]">
              {activeInvariant.title}
            </h4>
            <p className="font-mono text-xs text-[#10B981] pt-1">
              {activeInvariant.metric}
            </p>
          </div>

          <div className="lg:col-span-4 space-y-1 text-xs text-[#8E95A5] leading-relaxed">
            <span className="font-mono text-[10px] uppercase text-[#F4F4F0] font-bold block">
              ARCHITECTURAL ENFORCEMENT
            </span>
            <p>{activeInvariant.architecturalMechanism}</p>
            <p className="pt-1 text-[#8E95A5]">{activeInvariant.legalBound}</p>
          </div>

          <div className="lg:col-span-4 p-4 bg-[#0B0C0E] hairline-all space-y-1.5 font-mono text-xs">
            <span className="text-[10px] uppercase text-[#FF4F00] font-bold block">
              DETERMINISTIC VERIFICATION GATE
            </span>
            <p className="text-[#F4F4F0] leading-relaxed">
              {activeInvariant.verificationGate}
            </p>
          </div>
        </div>
      </section>

      {/* SEC.04: 14-Day Execution DAG Syllabus */}
      <section id="syllabus" className="hairline-b bg-[#0B0C0E]">
        <div className="p-6 sm:p-8 hairline-b flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
              SEC.04 // 14-DAY EXECUTION DAG
            </span>
            <h2 className="font-display text-fluid-h3 font-bold text-[#F4F4F0] tracking-tight mt-1">
              Curriculum State Transitions (28.0 Lab Hours)
            </h2>
          </div>

          {/* 2 Bounded Phase Levers */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                audio.click();
                setActivePhase("phase1");
              }}
              className={`px-4 py-2 uppercase cursor-pointer transition-colors ${
                activePhase === "phase1"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold"
                  : "border border-[#3A3F4B] bg-[#111317] text-[#F4F4F0] hover:border-[#F4F4F0]"
              }`}
            >
              [PHASE 01] Days 01–07: Core &amp; Spec Steering
            </button>
            <button
              type="button"
              onClick={() => {
                audio.click();
                setActivePhase("phase2");
              }}
              className={`px-4 py-2 uppercase cursor-pointer transition-colors ${
                activePhase === "phase2"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold"
                  : "border border-[#3A3F4B] bg-[#111317] text-[#F4F4F0] hover:border-[#F4F4F0]"
              }`}
            >
              [PHASE 02] Days 08–14: Hardening &amp; Demo Day
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {SYLLABUS_DAG[activePhase].map((node, idx) => (
            <div
              key={node.code}
              className={`p-6 ${
                idx < 3 ? "lg:hairline-r" : ""
              } hairline-b lg:hairline-b-0 flex flex-col justify-between space-y-6 bg-[#0B0C0E]`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-[#FF4F00] font-bold">
                    {node.dayRange}
                  </span>
                  <span className="text-[#8E95A5]">{node.code}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#F4F4F0]">
                  {node.title}
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  {node.specification}
                </p>
              </div>

              <div className="space-y-2 pt-4 hairline-t font-mono text-[11px]">
                <div className="text-[#8E95A5]">
                  DELIVERABLE:{" "}
                  <strong className="text-[#F4F4F0]">{node.artifact}</strong>
                </div>
                <div className="p-2 bg-[#111317] hairline-all text-[#10B981] truncate" title={node.verificationCmd}>
                  $ {node.verificationCmd}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEC.05: Institutional Operations & Founder Dossier */}
      <section id="institutional" className="hairline-b bg-[#111317]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Operations Architecture */}
          <div className="lg:col-span-7 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
                SEC.05 // INSTITUTIONAL DEPLOYMENT MODEL
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Zero-Impact Campus Integration.
              </h2>
              <p className="text-sm text-[#8E95A5] leading-relaxed max-w-2xl">
                Engineered for residential boarding schools and rigorous academic schedules.
                Substrata Labs manages developer credentials, hardware contingency buffers,
                and compliance auditing with zero campus IT overhead.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#FF4F00] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  [OPS.01] ZERO CAMPUS NETWORK OVERHEAD
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Toolchains install offline from pre-seeded 64GB USB media. Model steering traffic routes via Substrata&apos;s autonomous cellular 5G uplink, requiring zero campus Wi-Fi access or firewall reconfiguration.
                </p>
              </div>

              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#10B981] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  [OPS.02] HARDWARE PAIRING CONTINGENCY
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Workstations pair iOS students with Android-owning co-founders across the 10 crews. Substrata Labs provides an on-site hardware reserve: reference Android test handsets and certified high-speed cables.
                </p>
              </div>

              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#10B981] font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  [OPS.03] DPDP §9 CHILD SAFEGUARDING
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Compliant with Section 9 of the DPDP Act 2023. Student legal identities and boarding houses remain private institutional records; public version control utilizes sanitized developer handles with co-signed parental assent.
                </p>
              </div>

              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#F4F4F0] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                  [OPS.04] ADMISSIONS CREDENTIAL VALUE
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Graduates cite verifiable engineering deliverables—live Google Play listings, signed GitHub release APKs, in-app build fingerprints, and 60+ commit DAGs—directly in Common App and UCAS supplements.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Principal Instructor & Founder Dossier */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#8E95A5] hairline-b pb-3">
                <span className="text-[#FF4F00] font-bold">
                  DIRECTOR DOSSIER // SUBSTRATA LABS
                </span>
                <span>ALUMNUS: MAYO COLLEGE (&apos;22–&apos;23)</span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-extrabold text-[#F4F4F0]">
                  Kushagra Choudhary
                </h3>
                <p className="font-mono text-xs text-[#10B981] mt-0.5">
                  Founder, Substrata Labs · Architect of Sol (On-Device LLM on Google Play)
                </p>
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#F4F4F0] leading-snug hairline-l pl-4 border-l-[#FF4F00]">
                &ldquo;When I was at Mayo College, the bottleneck was never raw
                curiosity—it was access to production engineering toolchains.
                WeLiftoff trains young builders to command version control,
                local-first persistence, and reproducible release pipelines so they
                ship durable software before graduating high school.&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 hairline-t font-mono text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-2">
              <span>INAUGURAL PARTNER: MAYO COLLEGE, AJMER</span>
              <a
                href="https://substratalabs.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4F00] hover:underline inline-flex items-center gap-1"
              >
                substratalabs.org <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SEC.06: Institutional Reservation Terminal */}
      <section id="contract" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0C0E]">
        <div className="max-w-2xl mx-auto hairline-all bg-[#111317] p-6 sm:p-10">
          <div className="space-y-2 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
              SEC.06 // INSTITUTIONAL RESERVATION TERMINAL
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F4F0] tracking-tight">
              Reserve an On-Campus Cohort Window
            </h2>
            <p className="font-mono text-xs text-[#8E95A5]">
              Select an academic residency window (10 two-student crews / 20 builders) to receive
              the institutional proposal, curriculum field manual, and parental assent documentation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 font-mono text-[11px] text-[#8E95A5]">
              <div>
                <span className="text-[#F4F4F0] font-bold">CATALOG TUITION:</span>{" "}
                ₹95,000 ($1,125 USD)
              </div>
              <div>
                <span className="text-[#FF4F00] font-bold">PILOT RESIDENCY RATE:</span>{" "}
                ₹49,000–₹55,000 ($580–$650 USD)
              </div>
            </div>
          </div>

          {/* Cohort Window Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 font-mono text-[11px]">
            {[
              "Winter 2026 Residency (Mayo College Pilot)",
              "Spring 2027 Residency",
              "Summer 2027 Intensive",
              "Institutional Briefing",
            ].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  audio.click();
                  setCohortWindow(slot);
                }}
                className={`py-2 px-3 text-left cursor-pointer transition-colors ${
                  cohortWindow === slot
                    ? "bg-[#FF4F00] text-[#0B0C0E] font-bold"
                    : "border border-[#3A3F4B] bg-[#0B0C0E] text-[#F4F4F0] hover:border-[#F4F4F0]"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {inquirySubmitted ? (
            <div className="p-6 bg-[#0B0C0E] hairline-all font-mono text-xs space-y-3">
              <div className="text-[#10B981] font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                RESERVATION TRANSMISSION LOGGED [{cohortWindow.toUpperCase()}]
              </div>
              <p className="text-[#8E95A5] leading-relaxed">
                Dossier request registered for{" "}
                <strong className="text-[#F4F4F0]">
                  {formData.institution || "your institution"}
                </strong>
                . Substrata Labs will provide the executive proposal, hardware pairing manifest,
                and DPDP Act 2023 assent documentation within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  audio.click();
                  setInquirySubmitted(false);
                }}
                className="btn-tactile px-4 py-2 text-[11px] uppercase cursor-pointer"
              >
                Reset Intake Terminal
              </button>
            </div>
          ) : (
            <form
              onKeyDown={(e) => audio.keyDown(e.code, e.repeat)}
              onKeyUp={(e) => audio.keyUp(e.code)}
              onSubmit={(e) => {
                e.preventDefault();
                audio.commit();
                setInquirySubmitted(true);
              }}
              className="space-y-4 font-mono text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    FULL NAME *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Dr. / Principal / Head of Department"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-[#3A3F4B] text-[#F4F4F0] text-xs focus:outline-none focus:border-[#FF4F00] font-sans"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    OFFICIAL DESIGNATION *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Principal / HOD Computer Science / Housemaster"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-[#3A3F4B] text-[#F4F4F0] text-xs focus:outline-none focus:border-[#FF4F00] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    INSTITUTION NAME *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Institution Name (e.g. Mayo College, Ajmer)"
                    value={formData.institution}
                    onChange={(e) =>
                      setFormData({ ...formData, institution: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-[#3A3F4B] text-[#F4F4F0] text-xs focus:outline-none focus:border-[#FF4F00] font-sans"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    INSTITUTIONAL EMAIL *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="office@institution.edu.in"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-[#3A3F4B] text-[#F4F4F0] text-xs focus:outline-none focus:border-[#FF4F00] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                  LAB CONSTRAINTS &amp; PARAMETERS
                </label>
                <textarea
                  rows={3}
                  placeholder="Target cohort window, laboratory constraints, or scheduling requirements..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-[#3A3F4B] text-[#F4F4F0] text-xs focus:outline-none focus:border-[#FF4F00] font-sans"
                />
              </div>

              <button
                type="submit"
                className="btn-primary-tactile w-full py-3.5 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Transmit Dossier Request [{cohortWindow.toUpperCase()}] &rarr;
              </button>

              <div className="pt-3 hairline-t flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#8E95A5]">
                <span>DISPATCH: FOUNDERS@SUBSTRATALABS.IN</span>
                <span>STATUTORY MSME GOVERNANCE (UDYAM-RJ-37-0014993)</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Architectural Footer */}
      <footer className="hairline-t bg-[#0B0C0E] py-10 px-4 sm:px-8 font-mono text-xs text-[#8E95A5]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-[#FF4F00] text-[#0B0C0E] font-bold">
              0&rarr;1
            </span>
            <span className="text-[#F4F4F0] font-bold">WELIFTOFF.NOW</span>
            <span>{"//"}</span>
            <span>SUBSTRATA LABS</span>
          </div>

          <div className="text-[11px]">
            GOVT. OF INDIA MSME:{" "}
            <code className="text-[#F4F4F0]">UDYAM-RJ-37-0014993</code>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <a
              href="mailto:founders@substratalabs.in"
              className="hover:text-[#FF4F00] transition-colors"
            >
              founders@substratalabs.in
            </a>
            <a
              href="https://substratalabs.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FF4F00] transition-colors"
            >
              substratalabs.org
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
