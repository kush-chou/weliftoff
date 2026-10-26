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
  Layers,
  Sparkles,
  Radio,
  FileCode2,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  XCircle,
  Workflow,
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
      code: "MILESTONE.01 // FOUNDATION",
      title: "Repository Architecture & Offline Toolchain",
      artifact: "Configured Workstation + Handset ADB Pair",
      specification:
        "Structure a production repository that scales from day one. Boot an offline toolchain directly from pre-seeded 64GB USB media, master atomic commit discipline, and pair physical test handsets over ADB.",
      verificationCmd: "android --version && git reflog --oneline -n 5 && adb devices",
    },
    {
      dayRange: "DAYS 03–04",
      code: "MILESTONE.02 // SPECIFICATION",
      title: "System Architecture & State Modeling",
      artifact: "docs/spec.md + Deterministic UiState Container",
      specification:
        "Draft rock-solid technical specifications using AI agent workflows under a strict 20,000 token budget. Model screen states deterministically to guarantee zero runtime crashes.",
      verificationCmd: "agy-skills status --json && ./gradlew compileDebugKotlin --console=plain",
    },
    {
      dayRange: "DAYS 05–06",
      code: "MILESTONE.03 // PERSISTENCE",
      title: "Local-First SQLite Engine (Room Database)",
      artifact: "Room @Entity + KSP @Dao + Offline Migrations",
      specification:
        "Architect local-first data storage that runs completely offline with zero network connectivity. Ensure user records never leave the physical handset under statutory DPDP Act bounds.",
      verificationCmd: "./gradlew testDebugUnitTest verifyZeroEgress",
    },
    {
      dayRange: "DAY 07",
      code: "MILESTONE.04 // SCOPE LOCK",
      title: "Feature Freeze & Cross-Crew Code Audit",
      artifact: "Merged Main Branch + Physical Glass 60FPS Audit",
      specification:
        "Conduct peer code audits across co-founder crews. Inspect 60 FPS UI rendering on physical glass using scrcpy and lock release scope for the shipping pipeline.",
      verificationCmd: "git ledger --last --agents-only",
    },
  ],
  phase2: [
    {
      dayRange: "DAYS 08–09",
      code: "MILESTONE.05 // PACKAGING",
      title: "Production Packaging & In-App Colophon",
      artifact: "Signed Production APK + Tamper-Proof Identity",
      specification:
        "Implement native Material 3 design tokens and edge-to-edge window insets. Embed a tamper-proof in-app Colophon Screen displaying founder handles, commit SHA, and open-source license.",
      verificationCmd: "./gradlew assembleRelease && android layout",
    },
    {
      dayRange: "DAYS 10–11",
      code: "MILESTONE.06 // PLAY STORE",
      title: "Google Play Store Publishing",
      artifact: "Track 1 Internal Sharing + Signed GitHub Release",
      specification:
        "Author compliant Store listings with zero-data disclosures. Build signed Android App Bundles (AAB) and deploy directly to Google Play Store internal testing tracks.",
      verificationCmd: "./gradlew uploadReleasePrivateBundle",
    },
    {
      dayRange: "DAYS 12–13",
      code: "MILESTONE.07 // INCIDENT DRILL",
      title: "Incident Recovery & Emergency Hotfix Drills",
      artifact: "Hotfix Pull Request + 10-Second Reflog Rollback",
      specification:
        "Simulate production regressions and execute instantaneous rollbacks via git reflog. Verify release pipelines and test assertions remain resilient under incident pressure.",
      verificationCmd: "gh pr status && ls -lh docs/architecture.md",
    },
    {
      dayRange: "DAY 14",
      code: "MILESTONE.08 // DEMO DAY",
      title: "Founder Demo Day & Public Installation",
      artifact: "Auditorium Defense + Direct QR Distribution",
      specification:
        "Live product defense before faculty, investors, parents, and peers. Attendees install the finished native app directly via QR codes and inspect the crew's 60+ atomic commit history.",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    const trimmedRole = formData.role.trim();
    const trimmedInst = formData.institution.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      errors.name = "Full name is required for institutional verification.";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!trimmedRole) {
      errors.role = "Official academic designation is required.";
    }

    if (!trimmedInst) {
      errors.institution = "Institution name is required.";
    }

    if (!trimmedEmail) {
      errors.email = "Institutional email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Enter a valid academic email address (e.g. office@school.edu.in).";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      audio.drift();
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    audio.commit();

    setTimeout(() => {
      setIsSubmitting(false);
      setInquirySubmitted(true);
      audio.restore();
    }, 550);
  };

  /* --- Mechanical Physics Engine: Git DAG & Working-Tree State Simulator --- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = Math.max(320, canvas.parentElement?.clientWidth || 860));
    let height = (canvas.height = Math.max(260, canvas.parentElement?.clientHeight || 460));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = Math.max(320, canvas.parentElement.clientWidth);
      height = canvas.height = Math.max(260, canvas.parentElement.clientHeight);
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
    const totalParticles = 110;

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

    const handlePointerAction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 6,
        alpha: 0.85,
        color: dagMode === "drift" ? "#EF4444" : "#FF4F00",
      });
      audio.click();
      particles.forEach((p) => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 160) {
          const force = ((160 - dist) / 160) * 14;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

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
      handlePointerAction(e.clientX, e.clientY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]!;
        handlePointerAction(t.clientX, t.clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0]!;
        const rect = canvas.getBoundingClientRect();
        pointer.x = t.clientX - rect.left;
        pointer.y = t.clientY - rect.top;
        pointer.active = true;
      }
    };
    const onTouchEnd = () => {
      pointer.active = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onTouchEnd, { passive: true });

    let tick = 0;
    const modeParams = DAG_TELEMETRY[dagMode];

    const render = () => {
      tick++;
      ctx.fillStyle = "#0B0C0E";
      ctx.fillRect(0, 0, width, height);

      // Architectural Blueprint Subtle Grid Lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridStep = 44;
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

      // Vignette glow in center
      const radGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        10,
        width * 0.5,
        height * 0.5,
        width * 0.6
      );
      radGrad.addColorStop(0, dagMode === "drift" ? "rgba(239, 68, 68, 0.05)" : "rgba(255, 79, 0, 0.04)");
      radGrad.addColorStop(1, "rgba(11, 12, 14, 0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, width, height);

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

      // Directed Graph Edges with Glow
      ctx.lineWidth = 1.8;
      ctx.strokeStyle =
        dagMode === "drift"
          ? "rgba(239, 68, 68, 0.45)"
          : "rgba(255, 79, 0, 0.65)";
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
          if (dist < 110 && dist > 0) {
            const push = ((110 - dist) / 110) * 4.2;
            p.vx += (dx / dist) * push;
            p.vy += (dy / dist) * push;
          }
        }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 25) {
          p.vx = (p.vx / speed) * 25;
          p.vy = (p.vy / speed) * 25;
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        const distToAnchor = Math.hypot(p.x - anchor.x, p.y - anchor.y);
        if (distToAnchor < 64) {
          ctx.strokeStyle =
            dagMode === "drift"
              ? "rgba(239, 68, 68, 0.22)"
              : "rgba(16, 185, 129, 0.28)";
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
        ctx.lineWidth = 1.8;
        ctx.fillRect(a.x - 7, a.y - 7, 14, 14);
        ctx.strokeRect(a.x - 7, a.y - 7, 14, 14);

        ctx.fillStyle =
          dagMode === "drift"
            ? "#EF4444"
            : idx === anchors.length - 1
              ? "#10B981"
              : "#FF4F00";
        ctx.fillRect(a.x - 2.5, a.y - 2.5, 5, 5);

        const tierOffset = isCompact
          ? idx % 2 === 0
            ? -24 - (idx % 4 === 0 ? 14 : 0)
            : 28 + (idx % 4 === 1 ? 14 : 0)
          : idx % 2 === 0
            ? -24
            : 30;
        const labelY = a.y + tierOffset;
        ctx.fillStyle = "#8E95A5";
        ctx.textAlign = "center";
        ctx.fillText(isCompact ? a.sha.slice(0, 5) : a.sha, a.x, labelY);
        ctx.fillStyle = "#F4F4F0";
        const compactLabel = a.label.split(":")[0] ?? a.label;
        ctx.fillText(
          isCompact ? compactLabel : a.label,
          a.x,
          labelY + (idx % 2 === 0 ? -12 : 12)
        );
      });

      // Active Shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s]!;
        sw.radius += 5.2;
        sw.alpha *= 0.93;
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = sw.alpha;
        ctx.lineWidth = 1.4;
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
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [dagMode]);

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F4F0] flex flex-col selection:bg-[#FF4F00] selection:text-[#0B0C0E]">
      {/* Top Metadata & Operations Status Bar */}
      <div className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-1.5 font-mono text-[10px] sm:text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-3 relative z-50">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-[#FF4F00] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] inline-block animate-pulse" />
            WELIFTOFF // RESIDENCY
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="hidden sm:inline text-[#F4F4F0] font-medium">
            INAUGURAL RESIDENCY: MAYO COLLEGE, AJMER
          </span>
          <span className="hidden lg:inline text-white/10">|</span>
          <span className="hidden lg:inline text-[#8E95A5]">
            14 DAYS // 28.0 DEDICATED LAB HOURS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#10B981] font-semibold text-[10px] sm:text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block led-indicator-emerald" />
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
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-white/10 bg-[#14171E] hover:border-white/30 text-[#8E95A5] hover:text-[#F4F4F0] transition-all cursor-pointer text-[10px]"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981] font-mono">SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8E95A5]" />
                <span className="text-[#8E95A5] font-mono">SFX: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Architectural Navigation Header */}
      <header className="hairline-b bg-[#0B0C0E]/85 backdrop-blur-xl px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-sm bg-[#161922] border border-white/10 flex items-center justify-center text-lg select-none shadow-sm shadow-black/40">
            🚀
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#F4F4F0] block leading-none">
              WELIFTOFF
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8E95A5] mt-0.5 block">
              Substrata Labs Engineering Residency
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-7 font-mono text-xs uppercase tracking-wider text-[#8E95A5]">
          <a
            href="#anti-tutorial"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1"
          >
            The Anti-Tutorial
          </a>
          <a
            href="#pairing"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1"
          >
            Founder Operating System
          </a>
          <a
            href="#invariants"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1"
          >
            Invariants
          </a>
          <a
            href="#syllabus"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1"
          >
            Founder Milestones
          </a>
          <a
            href="#institutional"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1"
          >
            Integration
          </a>
        </nav>

        <a
          href="#contract"
          onClick={() => audio.click()}
          className="btn-primary-tactile rounded-sm px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          Start Shipping <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Hero Viewport: Asymmetric 12-Column Split */}
      <section id="thesis" className="hairline-b bg-gradient-to-b from-[#0E1015] to-[#0B0C0E] relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[calc(100vh-85px)] lg:max-h-[740px]">
          {/* Left 4 Columns: Architectural Thesis Pane */}
          <div className="lg:col-span-4 p-5 sm:p-6 lg:py-5 lg:px-7 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between bg-[#0B0C0E]/70 backdrop-blur-sm space-y-3.5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#FF4F00]/10 border border-[#FF4F00]/25 text-[#FF6A1F] font-mono text-[9px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] led-indicator-amber" />
                FOR BUILDERS GOING FROM 0 TO 1
              </div>

              <h1 className="font-display text-fluid-hero font-bold text-[#F4F4F0] tracking-tight">
                Don&apos;t just learn to code.{" "}
                <span className="font-serif italic font-normal text-[#FF4F00] block mt-0.5">
                  Ship like a technical founder.
                </span>
              </h1>

              <p className="text-xs sm:text-[13px] text-[#8E95A5] leading-relaxed">
                Anyone can generate code today. The difference between a forgotten script and a real product is how you version, structure, and ship it. Master the engineering operating system used by fast-moving technical founders—from day-one repo to live Google Play software in 14 days.
              </p>
            </div>

            {/* Tabular Domain Bounds: Machined Specimen Plaque */}
            <div className="panel-machined rounded-sm p-3 font-mono text-[11px] space-y-1.5">
              <div className="flex items-center justify-between pb-1 hairline-b text-[9px] text-[#8E95A5] font-bold uppercase tracking-wider">
                <span>FOUNDER SPECIFICATION</span>
                <span className="text-[#10B981] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] led-indicator-emerald" />
                  PRODUCTION INVARIANTS
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 hairline-b gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">RUNTIME</span>
                <span className="font-semibold text-[#F4F4F0] text-right">
                  Native Android · Compose (Physical Glass)
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 hairline-b gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">DATA ENGINE</span>
                <span className="font-semibold px-1 py-0.2 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-right">
                  Encrypted Room SQLite · Zero Egress
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 hairline-b gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">INCIDENT SLA</span>
                <span className="font-semibold text-[#FF6A1F] text-right">
                  &lt; 12ms Deterministic Rollback [reflog]
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 hairline-b gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">PAIRING</span>
                <span className="font-semibold px-1 py-0.2 rounded-sm bg-[#FF4F00]/15 text-[#FF6A1F] border border-[#FF4F00]/30 text-right">
                  50/50 Dual-Author [crew-swap.sh]
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 hairline-b gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">RELEASE</span>
                <span className="font-semibold text-[#F4F4F0] text-right">
                  Signed App Bundle (AAB) &amp; Google Play Store
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5 gap-2">
                <span className="text-[#8E95A5] shrink-0 text-[10px]">IP OWNERSHIP</span>
                <span className="font-semibold text-[#10B981] text-right">
                  100% Founder-Owned Repo &amp; Release Keys
                </span>
              </div>
            </div>

            {/* Single Primary Interaction Contract */}
            <div className="pt-1">
              <a
                href="#contract"
                onClick={() => audio.commit()}
                className="btn-primary-tactile rounded-sm block w-full py-2.5 sm:py-3 text-center font-mono text-xs font-bold uppercase tracking-wider"
              >
                Claim Founder Seat [10 Crews] &rarr;
              </a>
              <span className="block text-center font-mono text-[9px] text-[#8E95A5] mt-1">
                Inaugural Residency · Mayo College, Ajmer · Ship Real Software
              </span>
            </div>
          </div>

          {/* Right 8 Columns: Git DAG State Convergence Engine */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#0B0C0E] relative overflow-hidden">
            {/* Control Header & Mechanical State Switchers */}
            <div className="hairline-b px-4 sm:px-6 py-2 bg-[#111317]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 font-mono text-xs relative z-10">
              <span className="text-[10px] text-[#8E95A5] uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                  style={{
                    backgroundColor: telemetry.accentColor,
                  }}
                />
                CANVAS TELEMETRY // GIT DAG STATE CONVERGENCE SIMULATOR
              </span>

              {/* Bounded Mechanical States */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    audio.commit();
                    setDagMode("atomic");
                  }}
                  className={`px-2.5 py-1 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "atomic"
                      ? "bg-[#10B981] text-[#0B0C0E] font-bold shadow-md shadow-[#10B981]/30 border border-[#10B981]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "atomic" ? "bg-[#0B0C0E]" : "bg-[#10B981]"
                    }`}
                  />
                  Atomic Commit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.drift();
                    setDagMode("drift");
                  }}
                  className={`px-2.5 py-1 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "drift"
                      ? "bg-[#EF4444] text-[#0B0C0E] font-bold shadow-md shadow-[#EF4444]/30 border border-[#EF4444]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "drift" ? "bg-[#0B0C0E]" : "bg-[#EF4444]"
                    }`}
                  />
                  Unbounded Drift
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.restore();
                    setDagMode("reflog");
                  }}
                  className={`px-2.5 py-1 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "reflog"
                      ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30 border border-[#FF4F00]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "reflog" ? "bg-[#0B0C0E]" : "bg-[#FF4F00]"
                    }`}
                  />
                  Reflog Restore
                </button>
              </div>
            </div>

            {/* Interactive Physics Canvas with Oscilloscope Reticles */}
            <div className="relative flex-1 min-h-[300px] lg:min-h-0 w-full overflow-hidden cursor-crosshair">
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute top-2 right-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute bottom-2 left-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute bottom-2 right-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                7 CANONICAL RELEASE MILESTONES (D01 &rarr; D14)
              </div>
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/75 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                INTERACTIVE CONVERGENCE: CLICK OR DRAG PARTICLES TO AUDIT RECOVERY
              </div>
            </div>

            {/* Telemetry Readout Console */}
            <div className="hairline-t px-4 sm:px-6 py-2 bg-[#111317]/95 backdrop-blur-sm font-mono text-[10px] sm:text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-4">
              <span className="text-[10px] text-[#8E95A5] uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                  style={{
                    backgroundColor: telemetry.accentColor,
                  }}
                />
                CANVAS TELEMETRY // GIT DAG STATE CONVERGENCE SIMULATOR
              </span>

              {/* Bounded Mechanical States */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    audio.commit();
                    setDagMode("atomic");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "atomic"
                      ? "bg-[#10B981] text-[#0B0C0E] font-bold shadow-md shadow-[#10B981]/30 border border-[#10B981]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "atomic" ? "bg-[#0B0C0E]" : "bg-[#10B981]"
                    }`}
                  />
                  Atomic Commit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.drift();
                    setDagMode("drift");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "drift"
                      ? "bg-[#EF4444] text-[#0B0C0E] font-bold shadow-md shadow-[#EF4444]/30 border border-[#EF4444]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "drift" ? "bg-[#0B0C0E]" : "bg-[#EF4444]"
                    }`}
                  />
                  Unbounded Drift
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.restore();
                    setDagMode("reflog");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-[10px] sm:text-[11px] font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    dagMode === "reflog"
                      ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30 border border-[#FF4F00]"
                      : "border border-white/10 bg-[#161820] text-[#F4F4F0] hover:border-white/30"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dagMode === "reflog" ? "bg-[#0B0C0E]" : "bg-[#FF4F00]"
                    }`}
                  />
                  Reflog Restore
                </button>
              </div>
            </div>

            {/* Interactive Physics Canvas with Oscilloscope Reticles */}
            <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] w-full overflow-hidden cursor-crosshair">
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute top-2 right-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute bottom-2 left-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>
              <div className="absolute bottom-2 right-2 text-white/20 font-mono text-[10px] pointer-events-none">+</div>

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                7 CANONICAL RELEASE MILESTONES (D01 &rarr; D14)
              </div>
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/75 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                INTERACTIVE CONVERGENCE: CLICK OR DRAG PARTICLES TO AUDIT RECOVERY
              </div>
            </div>

            {/* Telemetry Readout Console */}
            <div className="hairline-t px-4 sm:px-6 py-3 bg-[#111317]/95 backdrop-blur-sm font-mono text-[10px] sm:text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="text-[#8E95A5]">REF:</span>
                <strong
                  style={{ color: telemetry.accentColor }}
                  className="font-bold bg-[#0B0C0E] px-2 py-0.5 rounded-sm border border-white/10"
                >
                  {telemetry.headRef}
                </strong>
              </span>
              <span>
                STATE ENTROPY:{" "}
                <strong className="text-[#F4F4F0] bg-[#0B0C0E] px-2 py-0.5 rounded-sm border border-white/10">
                  {telemetry.entropyBits}
                </strong>
              </span>
              <span>
                RECOVERY BOUND:{" "}
                <strong className="text-[#10B981] bg-[#0B0C0E] px-2 py-0.5 rounded-sm border border-white/10">
                  {telemetry.rollbackBound}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Anti-Tutorial Pitch & Founder Comparison Matrix */}
      <section id="anti-tutorial" className="hairline-b bg-gradient-to-b from-[#0B0C0E] via-[#0E1015] to-[#0B0C0E]">
        <div className="max-w-6xl mx-auto p-6 sm:p-12 space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00]" />
              THE ANTI-TUTORIAL PITCH
            </div>
            <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
              Why 90% of side projects die in{" "}
              <code className="text-[#FF4F00] font-mono text-2xl sm:text-3xl bg-[#FF4F00]/10 px-2 py-0.5 rounded border border-[#FF4F00]/25">
                final_v2_new
              </code>{" "}
              folders.
            </h2>
            <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
              Prompting an app into existence is easy. Maintaining, versioning, and deploying software that doesn&apos;t shatter when real users touch it is what separates a hobbyist from a technical founder.
            </p>
          </div>

          {/* 3-Column Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40">
              <div className="w-9 h-9 rounded-sm bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F4F0]">
                The Vibe-Coder Trap
              </h3>
              <p className="text-xs text-[#8E95A5] leading-relaxed">
                You can prompt an app into existence in an afternoon, but the moment a feature breaks, you have no rollback strategy and are scared to touch your own codebase.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40">
              <div className="w-9 h-9 rounded-sm bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F4F0]">
                Tutorial Hell
              </h3>
              <p className="text-xs text-[#8E95A5] leading-relaxed">
                Courses teach syntax and isolated commands in a sterile sandbox, leaving you clueless on how to actually structure, version, and deploy a live product.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40">
              <div className="w-9 h-9 rounded-sm bg-[#8E95A5]/15 border border-white/15 flex items-center justify-center text-[#8E95A5]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F4F4F0]">
                Solo Amateurism
              </h3>
              <p className="text-xs text-[#8E95A5] leading-relaxed">
                You treat version control like a clumsy save button instead of a release pipeline, making it impossible to iterate fast or bring on co-founders later.
              </p>
            </div>
          </div>

          {/* High-Contrast Comparison Matrix Card */}
          <div className="rounded-sm border border-white/15 overflow-hidden shadow-2xl bg-[#0E1015]">
            <div className="p-4 sm:p-6 hairline-b bg-[#14171E] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <span className="text-[#F4F4F0] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#FF4F00]" />
                THE OPERATING SYSTEM: HOBBYIST VS. TECHNICAL FOUNDER
              </span>
              <span className="text-[11px] text-[#8E95A5]">
                DETERMINISTIC VERIFICATION INVARIANT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* The Hobbyist Column */}
              <div className="p-6 sm:p-8 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E]/90 space-y-5">
                <div className="flex items-center justify-between pb-3 hairline-b">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#EF4444] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    THE HOBBYIST
                  </span>
                  <span className="text-[10px] font-mono text-[#8E95A5]">
                    STUCK ON LOCALHOST
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#8E95A5]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-sm leading-none mt-0.5">&times;</span>
                    <span><strong>Codes on main:</strong> Zero branch isolation; breaking one experimental feature crashes the entire application.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-sm leading-none mt-0.5">&times;</span>
                    <span><strong>Scared to refactor:</strong> Has no atomic commit history or reflog checkpoints; terrified of regression.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-sm leading-none mt-0.5">&times;</span>
                    <span><strong>Projects die locally:</strong> Trapped on <code>localhost:3000</code> or simulator windows; never published to real users.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-sm leading-none mt-0.5">&times;</span>
                    <span><strong>Quits when messy:</strong> Abandons the codebase the moment merge conflicts or prompt drift overwhelms the folder.</span>
                  </li>
                </ul>
              </div>

              {/* The Technical Founder Column */}
              <div className="p-6 sm:p-8 bg-[#11141C] space-y-5 relative">
                <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#FF5E14] to-[#10B981]" />
                <div className="flex items-center justify-between pb-3 hairline-b border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] led-indicator-emerald" />
                    THE TECHNICAL FOUNDER
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold">
                    SHIPS TO PRODUCTION
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-[#F4F4F0]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Ships in isolated branches:</strong> Builds features in dedicated, bisect-safe slices without risking the core runtime.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Experiments aggressively:</strong> Backed by 10-second <code>git reflog</code> rollbacks; refactors fearlessly at high speed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Deploys every merge:</strong> Code flows automatically to live Android glass and signed Google Play Store tracks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong>Treats repo as an asset:</strong> Clean commit provenance, in-app colophons, and verified architectures that co-founders can build on.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pairing Topology & Verification Cadence */}
      <section id="pairing" className="hairline-b bg-gradient-to-b from-[#111317] to-[#0D0F13]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Separation of Steering{" "}
                <span className="font-serif italic font-normal text-[#FF4F00] block">
                  And Verification.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                Autonomous software synthesis requires strict separation between the implementer and the auditor.
                Builders operate in two-person founder crews with scheduled 45-minute seat rotations via <code className="text-[#FF6A1F]">crew-swap.sh</code>,
                rotating author credentials and commit templates to enforce 50/50 contribution parity across both co-founders.
              </p>
            </div>

            <div className="pt-6 hairline-t font-mono text-[11px] text-[#8E95A5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block led-indicator-emerald" />
              <span>CONFIDENCE 1.0 DUAL-AUTHOR GIT TRAILERS ENFORCED</span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
            {/* Primary Terminal 1 */}
            <div className="p-6 sm:p-8 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#FF6A1F] font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    TERMINAL 1 // FOUNDER A (SHIPPING ENGINE)
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-[#FF4F00]/15 text-[#FF6A1F] font-mono text-[9px] font-bold border border-[#FF4F00]/30">
                    HARDWARE TETHER
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Synthesis &amp; Hardware Tether
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Tethered to the physical Android handset over ADB. Executes Antigravity 2.0 code synthesis,
                  Gradle builds, and on-device runtime deployments under a 20,000 active token budget ceiling.
                </p>
              </div>

              {/* Machined Terminal Window */}
              <div className="rounded-sm border border-white/10 bg-[#0E1014] overflow-hidden shadow-lg shadow-black/60 font-mono text-[11px]">
                <div className="bg-[#151820] px-3 py-2 border-b border-white/10 flex items-center justify-between text-[10px] text-[#8E95A5]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
                    <span className="ml-2 text-[#F4F4F0] font-semibold">terminal-1: founder-a@launch-mvp (pixel-8a)</span>
                  </div>
                  <span className="text-[#10B981]">ONLINE</span>
                </div>
                <div className="p-4 space-y-2 text-[#8E95A5]">
                  <div className="text-[#FF6A1F] font-bold">
                    $ agy-skills status --json
                  </div>
                  <div className="text-[#F4F4F0] bg-[#07080A] p-2 rounded-sm border border-white/5 font-mono text-[10px]">
                    {'{ "budget_ceiling": 20000, "active_tokens": 4820, "status": "nominal" }'}
                  </div>
                  <div className="text-[#10B981] pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Token consumption within sovereign 20k cap
                  </div>
                  <div className="text-[#8E95A5] pt-1">
                    $ <span className="text-[#F4F4F0]">android run --release</span> &rarr; deploy native APK to connected hardware
                  </div>
                </div>
              </div>
            </div>

            {/* Auditor Station 2 */}
            <div className="p-6 sm:p-8 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5" />
                    TERMINAL 2 // FOUNDER B (VERIFICATION GATE)
                  </span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] font-mono text-[9px] font-bold border border-[#10B981]/30">
                    VERIFICATION GATE
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Verification &amp; Specification Gate
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Dedicated to architectural specification (docs/spec.md), read-only AST diff auditing
                  with git-ledger, scrcpy device mirroring, and compile-time zero-egress validation.
                </p>
              </div>

              {/* Machined Terminal Window */}
              <div className="rounded-sm border border-white/10 bg-[#0E1014] overflow-hidden shadow-lg shadow-black/60 font-mono text-[11px]">
                <div className="bg-[#151820] px-3 py-2 border-b border-white/10 flex items-center justify-between text-[10px] text-[#8E95A5]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
                    <span className="ml-2 text-[#F4F4F0] font-semibold">terminal-2: founder-b@launch-mvp (audit)</span>
                  </div>
                  <span className="text-[#10B981]">SYNCED</span>
                </div>
                <div className="p-4 space-y-2 text-[#8E95A5]">
                  <div className="text-[#10B981] font-bold">
                    $ git ledger --diff --md
                  </div>
                  <div className="text-[#F4F4F0] bg-[#07080A] p-2 rounded-sm border border-white/5 font-mono text-[10px] space-y-0.5">
                    <div>Agent: antigravity | Repo: launch-mvp</div>
                    <div>Founder-A: @handle-a | Founder-B: @handle-b</div>
                  </div>
                  <div className="text-[#10B981] pt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confidence 1.0 dual-founder attribution verified
                  </div>
                  <div className="text-[#8E95A5] pt-1">
                    $ <span className="text-[#F4F4F0]">./gradlew verifyZeroEgress</span> &rarr; network check PASS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereign Legal & Architectural Invariants */}
      <section id="invariants" className="hairline-b bg-[#0B0C0E]">
        <div className="p-6 sm:p-10 hairline-b flex flex-wrap items-end justify-between gap-4 bg-gradient-to-r from-[#12151B] to-[#0B0C0E]">
          <div className="space-y-2">
            <h2 className="font-display text-fluid-h3 font-bold text-[#F4F4F0] tracking-tight">
              Four Non-Negotiable Institutional Invariants
            </h2>
          </div>
          <p className="font-mono text-xs text-[#8E95A5] max-w-md leading-relaxed">
            Select an invariant below to inspect its architectural enforcement
            mechanism, statutory DPDP Act compliance, and automated test gate.
          </p>
        </div>

        {/* 4-Column Invariant Cards */}
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
                className={`p-6 sm:p-7 text-left ${
                  idx < 3 ? "lg:hairline-r" : ""
                } ${idx % 2 === 0 ? "md:hairline-r" : ""} hairline-b lg:hairline-b-0 cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-gradient-to-b from-[#181C24] to-[#12151C] shadow-inner shadow-white/5"
                    : "bg-[#0B0C0E] hover:bg-[#111318]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF5E14] to-[#FF9248] shadow-sm shadow-[#FF4F00]" />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isSelected ? "text-[#FF6A1F]" : "text-[#8E95A5]"
                      }`}
                    >
                      {item.code}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-sm bg-[#FF4F00] text-[#0B0C0E] font-bold text-[9px] shadow-sm">
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

                <div className="pt-5 mt-5 hairline-t font-mono text-[11px] text-[#10B981] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  BOUND: {item.metric}
                </div>
              </button>
            );
          })}
        </div>

        {/* Invariant Detail Dossier Panel */}
        <div className="p-6 sm:p-10 bg-[#111317] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-white/5">
          <div className="lg:col-span-4 space-y-2 hairline-b lg:hairline-b-0 lg:hairline-r pb-6 lg:pb-0 lg:pr-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF6A1F] font-bold block">
              ACTIVE SPECIFICATION // {activeInvariant.code}
            </span>
            <h4 className="font-display text-2xl font-bold text-[#F4F4F0]">
              {activeInvariant.title}
            </h4>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {activeInvariant.metric}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2 text-xs text-[#8E95A5] leading-relaxed">
            <span className="font-mono text-[10px] uppercase text-[#F4F4F0] font-bold block tracking-wider">
              ARCHITECTURAL ENFORCEMENT &amp; STATUTORY DPDP BOUNDARY
            </span>
            <p className="text-[#C4C8D4]">{activeInvariant.architecturalMechanism}</p>
            <p className="pt-1 text-[#8E95A5]">{activeInvariant.legalBound}</p>
          </div>

          <div className="lg:col-span-4 p-5 bg-[#0B0C0E] rounded-sm border border-white/10 space-y-2 font-mono text-xs shadow-md shadow-black/40">
            <span className="text-[10px] uppercase text-[#FF6A1F] font-bold block tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3 h-3" />
              DETERMINISTIC VERIFICATION GATE
            </span>
            <div className="bg-[#14171E] p-3 rounded-sm border border-white/5 text-[#F4F4F0] leading-relaxed">
              {activeInvariant.verificationGate}
            </div>
          </div>
        </div>
      </section>

      {/* 14-Day Execution DAG Syllabus */}
      <section id="syllabus" className="hairline-b bg-gradient-to-b from-[#0B0C0E] to-[#0E1015]">
        <div className="p-6 sm:p-10 hairline-b flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-[10px] font-bold uppercase tracking-wider">
              FOUNDER MILESTONES // 14-DAY DAG
            </div>
            <h2 className="font-display text-fluid-h3 font-bold text-[#F4F4F0] tracking-tight">
              From Empty Repo to Production Release in 14 Days
            </h2>
          </div>

          {/* 2 Bounded Phase Levers */}
          <div className="flex items-center gap-2 font-mono text-xs p-1 rounded-sm bg-[#12141A] border border-white/10">
            <button
              type="button"
              onClick={() => {
                audio.click();
                setActivePhase("phase1");
              }}
              className={`px-4 py-2 rounded-sm uppercase cursor-pointer transition-all ${
                activePhase === "phase1"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30"
                  : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
              }`}
            >
              Phase 1: Company Foundation (Days 01–07)
            </button>
            <button
              type="button"
              onClick={() => {
                audio.click();
                setActivePhase("phase2");
              }}
              className={`px-4 py-2 rounded-sm uppercase cursor-pointer transition-all ${
                activePhase === "phase2"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30"
                  : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
              }`}
            >
              Phase 2: The Shipping Pipeline (Days 08–14)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {SYLLABUS_DAG[activePhase].map((node, idx) => (
            <div
              key={node.code}
              className={`p-6 sm:p-7 ${
                idx < 3 ? "lg:hairline-r" : ""
              } hairline-b lg:hairline-b-0 flex flex-col justify-between space-y-6 bg-[#0B0C0E] hover:bg-[#111319] transition-colors relative group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-sm bg-[#FF4F00]/15 text-[#FF6A1F] border border-[#FF4F00]/30 font-bold">
                    {node.dayRange}
                  </span>
                  <span className="text-[#8E95A5]">{node.code}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[#F4F4F0] group-hover:text-[#FF6A1F] transition-colors">
                  {node.title}
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  {node.specification}
                </p>
              </div>

              <div className="space-y-2.5 pt-4 hairline-t font-mono text-[11px]">
                <div className="text-[#8E95A5]">
                  FOUNDER DELIVERABLE:{" "}
                  <strong className="text-[#F4F4F0] block font-semibold mt-0.5">{node.artifact}</strong>
                </div>
                <div className="p-2.5 bg-[#12151C] rounded-sm border border-white/10 text-[#10B981] overflow-x-auto text-[10px] whitespace-nowrap" title={node.verificationCmd}>
                  $ {node.verificationCmd}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Operations & Founder Dossier */}
      <section id="institutional" className="hairline-b bg-[#111317]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Operations Architecture */}
          <div className="lg:col-span-7 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Zero-Impact Campus Integration.
              </h2>
              <p className="text-sm text-[#8E95A5] leading-relaxed max-w-2xl">
                Engineered specifically for residential boarding schools and rigorous academic schedules.
                Substrata Labs operates directly within the 18:00–20:00 evening prep window,
                managing hardware reserves and statutory child safeguarding with zero campus IT burden.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2 shadow-sm">
                <div className="text-[#FF6A1F] font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FF4F00]" />
                  ZERO CAMPUS WI-FI BURDEN
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Toolchains install offline from pre-seeded 64GB USB media. Agent queries route via Substrata&apos;s autonomous cellular 5G uplink—zero campus Wi-Fi access or firewall reconfiguration required.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2 shadow-sm">
                <div className="text-[#10B981] font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#10B981]" />
                  EVENING PREP INTEGRATION
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Operates strictly within the 18:00–20:00 evening prep window, ensuring zero disruption to morning academic classes, sports fixtures, or mandatory dorm call timings.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2 shadow-sm">
                <div className="text-[#10B981] font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  HARDWARE CONTINGENCY RESERVE
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Workstations pair iOS builders with Android-owning co-founders across the 10 crews. Substrata Labs provides an on-site hardware reserve: reference Android test handsets and certified high-speed cables.
                </p>
              </div>

              <div className="p-4 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2 shadow-sm">
                <div className="text-[#F4F4F0] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF4F00]" />
                  ADMISSIONS CREDENTIAL PORTFOLIO
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Graduates cite verifiable engineering deliverables—live Google Play listings, signed GitHub release APKs, in-app build fingerprints, and 60+ commit histories—directly in Common App and UCAS supplements.
                </p>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Principal Instructor & Founder Dossier */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between font-mono text-[10px] text-[#8E95A5] hairline-b pb-3">
                <span className="text-[#FF6A1F] font-bold tracking-wider">
                  DIRECTOR DOSSIER // SUBSTRATA LABS
                </span>
                <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#F4F4F0]">
                  ALUMNUS: MAYO COLLEGE (&apos;22–&apos;23)
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-extrabold text-[#F4F4F0]">
                  Kushagra Choudhary
                </h3>
                <p className="font-mono text-xs text-[#10B981] mt-1 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Founder, Substrata Labs · Architect of Sol (On-Device LLM on Google Play)
                </p>
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#F4F4F0] leading-snug pl-4 border-l-2 border-[#FF4F00] bg-gradient-to-r from-[#FF4F00]/5 to-transparent py-2">
                &ldquo;When I was at Mayo College, the bottleneck was never raw
                curiosity—it was access to production engineering toolchains.
                WeLiftoff trains young builders to command version control,
                local-first persistence, and reproducible release pipelines so they
                ship durable software before graduating high school.&rdquo;
              </blockquote>
            </div>

            <div className="pt-4 hairline-t font-mono text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-2">
              <span className="text-[#F4F4F0]">INAUGURAL PARTNER: MAYO COLLEGE, AJMER</span>
              <a
                href="https://substratalabs.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF6A1F] hover:text-[#FFA066] transition-colors inline-flex items-center gap-1 font-semibold"
              >
                substratalabs.org <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Reservation Terminal */}
      <section id="contract" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#0B0C0E] via-[#0E1015] to-[#0B0C0E] relative">
        <div className="max-w-2xl mx-auto panel-machined rounded-sm p-6 sm:p-10 shadow-2xl shadow-black/80">
          <div className="space-y-2.5 mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FF4F00]/10 border border-[#FF4F00]/25 text-[#FF6A1F] font-mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] led-indicator-amber" />
              10 CREWS · 20 SEATS · SHIP PRODUCTION SOFTWARE
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F4F0] tracking-tight">
              Stop sitting on localhost. Ship your first product today.
            </h2>
            <p className="font-mono text-xs text-[#8E95A5] leading-relaxed">
              Reserve your two-person founder crew for the 14-day on-campus engineering residency at Mayo College.
              Receive the executive prospectus, hardware pairing checklist, and parental assent documentation.
            </p>

            {/* Tuition Breakdown Card */}
            <div className="mt-4 p-3.5 rounded-sm bg-[#0A0C0E] border border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-[#8E95A5] block text-[10px] uppercase">CATALOG TUITION</span>
                <span className="text-[#F4F4F0] font-bold text-sm">₹95,000</span>{" "}
                <span className="text-[#8E95A5]">($1,125 USD)</span>
              </div>
              <div className="text-right">
                <span className="text-[#FF6A1F] block text-[10px] uppercase font-bold flex items-center gap-1 justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00]" />
                  PILOT RESIDENCY RATE (MAYO COLLEGE)
                </span>
                <span className="text-[#10B981] font-bold text-sm">₹49,000–₹55,000</span>{" "}
                <span className="text-[#8E95A5]">($580–$650 USD)</span>
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
                className={`py-2.5 px-3 rounded-sm text-left cursor-pointer transition-all flex items-center justify-between ${
                  cohortWindow === slot
                    ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30 border border-[#FFA066]/40"
                    : "border border-white/10 bg-[#0E1015] text-[#F4F4F0] hover:border-white/30"
                }`}
              >
                <span>{slot}</span>
                {cohortWindow === slot && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0B0C0E]" />
                )}
              </button>
            ))}
          </div>

          {inquirySubmitted ? (
            <div className="p-6 bg-[#0B0C0E] rounded-sm border border-[#10B981]/40 font-mono text-xs space-y-3">
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
                className="btn-tactile rounded-sm px-4 py-2 text-[11px] uppercase cursor-pointer"
              >
                Reset Intake Terminal
              </button>
            </div>
          ) : (
            <form
              noValidate
              onKeyDown={(e) => audio.keyDown(e.code, e.repeat)}
              onKeyUp={(e) => audio.keyUp(e.code)}
              onSubmit={handleFormSubmit}
              className="space-y-4 font-mono text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="intake-name" className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    FULL NAME *
                  </label>
                  <input
                    id="intake-name"
                    type="text"
                    maxLength={100}
                    aria-invalid={!!formErrors.name}
                    aria-describedby={formErrors.name ? "name-error" : undefined}
                    placeholder="Dr. / Principal / Head of Department"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-base sm:text-xs font-sans placeholder:text-[#555A68] ${
                      formErrors.name ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                    }`}
                  />
                  {formErrors.name && (
                    <span id="name-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-[10px] mt-1.5 block">
                      ! {formErrors.name}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="intake-role" className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    OFFICIAL DESIGNATION *
                  </label>
                  <input
                    id="intake-role"
                    type="text"
                    maxLength={100}
                    aria-invalid={!!formErrors.role}
                    aria-describedby={formErrors.role ? "role-error" : undefined}
                    placeholder="Principal / HOD CS / Housemaster"
                    value={formData.role}
                    onChange={(e) => {
                      setFormData({ ...formData, role: e.target.value });
                      if (formErrors.role) setFormErrors({ ...formErrors, role: undefined });
                    }}
                    className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-base sm:text-xs font-sans placeholder:text-[#555A68] ${
                      formErrors.role ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                    }`}
                  />
                  {formErrors.role && (
                    <span id="role-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-[10px] mt-1.5 block">
                      ! {formErrors.role}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="intake-institution" className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    INSTITUTION NAME *
                  </label>
                  <input
                    id="intake-institution"
                    type="text"
                    maxLength={120}
                    aria-invalid={!!formErrors.institution}
                    aria-describedby={formErrors.institution ? "institution-error" : undefined}
                    placeholder="e.g. Mayo College, Ajmer"
                    value={formData.institution}
                    onChange={(e) => {
                      setFormData({ ...formData, institution: e.target.value });
                      if (formErrors.institution) setFormErrors({ ...formErrors, institution: undefined });
                    }}
                    className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-base sm:text-xs font-sans placeholder:text-[#555A68] ${
                      formErrors.institution ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                    }`}
                  />
                  {formErrors.institution && (
                    <span id="institution-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-[10px] mt-1.5 block">
                      ! {formErrors.institution}
                    </span>
                  )}
                </div>
                <div>
                  <label htmlFor="intake-email" className="block uppercase text-[10px] text-[#8E95A5] mb-1.5 font-bold">
                    INSTITUTIONAL EMAIL *
                  </label>
                  <input
                    id="intake-email"
                    type="email"
                    maxLength={120}
                    aria-invalid={!!formErrors.email}
                    aria-describedby={formErrors.email ? "email-error" : undefined}
                    placeholder="office@institution.edu.in"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-base sm:text-xs font-sans placeholder:text-[#555A68] ${
                      formErrors.email ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                    }`}
                  />
                  {formErrors.email && (
                    <span id="email-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-[10px] mt-1.5 block">
                      ! {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="intake-notes" className="block uppercase text-[10px] text-[#8E95A5] font-bold">
                    LAB CONSTRAINTS &amp; SCHEDULING PARAMETERS
                  </label>
                  <span className="text-[10px] text-[#555A68] font-mono">
                    {formData.notes.length}/1000
                  </span>
                </div>
                <textarea
                  id="intake-notes"
                  rows={3}
                  maxLength={1000}
                  placeholder="Target cohort window, laboratory constraints, or evening prep timing (18:00–20:00)..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="input-machined w-full px-3.5 py-2.5 rounded-sm text-base sm:text-xs font-sans placeholder:text-[#555A68]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-tactile rounded-sm w-full py-4 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF4F00]/25 disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#0B0C0E] border-t-transparent rounded-full animate-spin" />
                    <span>TRANSMITTING FOUNDER CREW RESERVATION...</span>
                  </>
                ) : (
                  <span>Claim Founder Cohort Seat [{cohortWindow.toUpperCase()}] &rarr;</span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Architectural Footer */}
      <footer className="hairline-t bg-[#0B0C0E] py-10 px-4 sm:px-8 font-mono text-xs text-[#8E95A5]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base select-none">
              🚀
            </span>
            <span className="text-[#F4F4F0] font-bold">WELIFTOFF.NOW</span>
            <span className="text-white/20">{"//"}</span>
            <span>SUBSTRATA LABS</span>
          </div>

          <div className="text-[11px]">
            GOVT. OF INDIA MSME:{" "}
            <code className="text-[#F4F4F0] bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
              UDYAM-RJ-37-0014993
            </code>
          </div>

          <div className="flex items-center gap-5 text-[11px]">
            <a
              href="mailto:founders@substratalabs.in"
              className="hover:text-[#FF6A1F] transition-colors"
            >
              founders@substratalabs.in
            </a>
            <a
              href="https://substratalabs.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#FF6A1F] transition-colors inline-flex items-center gap-1"
            >
              substratalabs.org <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
