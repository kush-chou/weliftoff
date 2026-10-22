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
  AlertTriangle,
} from "lucide-react";

/* --- Ephemeral Acoustic Feedback Synthesizer (Native AudioContext < 80ms) --- */
class AcousticSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
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
    rollbackBound: "0.0 ms [CLEAN TREE]",
    workingTreeStatus: "7/7 DAG CHECKPOINTS VERIFIED",
    springStiffness: 0.075,
    turbulence: 0,
    accentColor: "#10B981",
  },
  drift: {
    headRef: "DETACHED [142 UNSTAGED DELTAS]",
    entropyBits: "8.94 bits [UNBOUNDED DRIFT]",
    rollbackBound: "UNRECOVERABLE WITHOUT GIT",
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
    code: "[INV.01 // LICENSE]",
    title: "Apache-2.0 Open Source",
    metric: "100% PUBLIC REPOSITORY",
    summary:
      "Every student application is published with complete source history, build scripts, and deterministic commit attribution under Apache-2.0.",
    architecturalMechanism:
      "Public GitHub repository containing 80+ sequential atomic commits, pull-request diffs, and reproducible Gradle wrapper configurations.",
    legalBound:
      "Permissive Apache-2.0 patent and copyright grant; all graphic assets and typefaces restricted to SIL OFL and Apache-2.0 Material Symbols.",
    verificationGate:
      "Automated SPDX license header check + F-Droid upstream inclusion lint (`fdroid scanner`) prior to Day 10 freeze.",
  },
  {
    id: "dpdp",
    code: "[INV.02 // PRIVACY]",
    title: "Zero-Egress Persistence",
    metric: "0 BYTES NETWORK EGRESS",
    summary:
      "Strict local-first architecture. Student applications execute entirely on-device using SQLite/Room without user accounts or cloud telemetry.",
    architecturalMechanism:
      "Android Manifest strips `android.permission.INTERNET` wherever domain logic permits, enforcing local SQLite/Room persistence and on-device execution.",
    legalBound:
      "Full compliance with the Indian Digital Personal Data Protection (DPDP) Act 2023 and COPPA by eliminating personal data collection at the root.",
    verificationGate:
      "Static manifest permission audit and network packet inspection verifying zero third-party analytics SDKs.",
  },
  {
    id: "commerce",
    code: "[INV.03 // MONETIZATION]",
    title: "Zero Commercial Surface",
    metric: "0 AD SDKS / 0 IAPS",
    summary:
      "Pure utility software. No ad networks, no in-app billing SDKs, and no commercial merchant hooks required for minor builders.",
    architecturalMechanism:
      "Excludes Google Play Billing Library and proprietary ad mediation dependencies from `libs.versions.toml`.",
    legalBound:
      "Insulates high school minors and host institutions from commercial tax liabilities, payment gateway KYC, and predatory retention patterns.",
    verificationGate:
      "Gradle dependency tree inspection (`./gradlew app:dependencies`) confirming zero proprietary monetization binaries.",
  },
  {
    id: "custody",
    code: "[INV.04 // SOVEREIGNTY]",
    title: "Custodial IP Transfer",
    metric: "100% STUDENT OWNERSHIP",
    summary:
      "Published under the verified Substrata Labs organization account during minority, with binding legal transfer to the student at age 18.",
    architecturalMechanism:
      "Google Play App Signing keys and F-Droid metadata maintained in an escrowed organizational keyring mapped to the student crew.",
    legalBound:
      "Co-signed Institutional & Parental Custodial Agreement under Govt. of India MSME (`UDYAM-RJ-37-0014993`) guaranteeing unencumbered IP assignment.",
    verificationGate:
      "Cryptographic SHA-256 signing certificate fingerprint recorded in the cohort ledger and student graduation dossier.",
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
      title: "Terminal Discipline & Git DAG Mechanics",
      artifact: "Configured ADB + Git Hook Pipeline",
      specification:
        "Configure Android Studio, SDK platform-tools, and Git. Master working-tree staging, atomic commit granularity, branching (`git switch -c`), and deterministic recovery from broken state via `git restore` and `git reflog` before invoking any generative model.",
      verificationCmd: "git reflog --oneline -n 5 && adb devices",
    },
    {
      dayRange: "DAYS 03–04",
      code: "NODE.02 // DOMAIN MODELING",
      title: "Constrained Agentic Synthesis",
      artifact: "AGENTS.md + Kotlin Domain Skeleton",
      specification:
        "3-student build crews define bounded problem statements and author strict `AGENTS.md` architectural invariants. Direct AI coding assistants to synthesize one isolated vertical slice per commit.",
      verificationCmd: "./gradlew compileDebugKotlin --console=plain",
    },
    {
      dayRange: "DAYS 05–06",
      code: "NODE.03 // PERSISTENCE",
      title: "Zero-Egress SQLite & Room Storage",
      artifact: "Local DAO + Deterministic Schema Migration",
      specification:
        "Implement offline-first state persistence using Android Room / SQLite. Design deterministic data structures so edge cases dissolve without defensive UI flags or remote server dependencies.",
      verificationCmd: "./gradlew testDebugUnitTest",
    },
    {
      dayRange: "DAY 07",
      code: "NODE.04 // FEATURE FREEZE",
      title: "Peer Pull-Request Audit & Scope Lock",
      artifact: "Merged Main Branch + Secret Scan Pass",
      specification:
        "Cross-crew code review enforcing diff readability, zero hardcoded credentials, and 60fps UI responsiveness on physical Android test targets. Lock core feature scope prior to packaging.",
      verificationCmd: "git log --graph --oneline --decorate",
    },
  ],
  phase2: [
    {
      dayRange: "DAYS 08–09",
      code: "NODE.05 // REPRODUCIBLE BUILD",
      title: "FOSS Asset Audit & Signed AAB Packaging",
      artifact: "Signed Release `.aab` & `.apk` Binaries",
      specification:
        "Verify permissive licensing across all vector icons and fonts. Configure R8/ProGuard shrinking and deterministic release signing keys to produce production Android App Bundles.",
      verificationCmd: "./gradlew bundleRelease assembleRelease",
    },
    {
      dayRange: "DAYS 10–11",
      code: "NODE.06 // DUAL DISTRIBUTION",
      title: "Google Play Console & F-Droid Submission",
      artifact: "Play Store Production Track + F-Droid MR",
      specification:
        "Author technical store listings, DPDP/COPPA zero-data declarations, and IELTS-grade release notes. Submit signed AAB to Google Play and open upstream recipe merge request on F-Droid.",
      verificationCmd: "fdroid lint org.substratalabs.cohort.app",
    },
    {
      dayRange: "DAYS 12–13",
      code: "NODE.07 // TECHNICAL DOSSIER",
      title: "Clean-Slate README & Architecture Walkthrough",
      artifact: "3-Min Technical Screencast + Spec Docs",
      specification:
        "Produce a clean-slate architectural `README.md` with system diagrams, latency/storage bounds, and build instructions, paired with a 3-minute engineering walkthrough video for admissions portfolios.",
      verificationCmd: "gh pr status && ls -lh docs/architecture.md",
    },
    {
      dayRange: "DAY 14",
      code: "NODE.08 // EXHIBITION",
      title: "On-Campus Demo Day & APK Verification",
      artifact: "Live QR Installation + Commit Ledger",
      specification:
        "Live technical defense before the Principal, Housemasters, CS Faculty, and student body. Attendees install the signed APK directly onto physical devices and inspect the crew's 14-day Git commit graph.",
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
  const [cohortWindow, setCohortWindow] = useState("Winter 2026 Cohort");
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
      "D01:git-init",
      "D03:spec-lock",
      "D05:room-dao",
      "D07:pr-freeze",
      "D09:aab-sign",
      "D11:fdroid-mr",
      "D14:release",
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

      // Architectural 48px Blueprint Grid
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

      // Compute Canonical 7-Node Git Commit DAG Spine Coordinates
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

      // Draw Directed Acyclic Graph Edges
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

      // Update & Draw Kinetic Working-Tree Particles
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

        // Spring-damper attraction to parent commit node
        p.vx += (targetX - p.x) * modeParams.springStiffness;
        p.vy += (targetY - p.y) * modeParams.springStiffness;

        // Unbounded prompt turbulence when in drift mode
        if (modeParams.turbulence > 0) {
          p.vx +=
            Math.sin(tick * 0.09 + idx * 1.7) * modeParams.turbulence * 0.35;
          p.vy +=
            Math.cos(tick * 0.08 + idx * 2.3) * modeParams.turbulence * 0.35;
        }

        // Pointer kinetic repulsion
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

        // Draw tether line from particle to its commit node
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

      // Draw Canonical Commit Anchor Nodes & Tabular SHA Labels
      const isCompact = width < 640;
      ctx.font = isCompact
        ? '9px "JetBrains Mono", monospace'
        : '10px "JetBrains Mono", monospace';
      anchors.forEach((a, idx) => {
        // Outer mechanical square frame
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

        // Inner core dot
        ctx.fillStyle =
          dagMode === "drift"
            ? "#EF4444"
            : idx === anchors.length - 1
              ? "#10B981"
              : "#FF4F00";
        ctx.fillRect(a.x - 2, a.y - 2, 4, 4);

        // SHA & Stage Label (alternating 3-tier vertical stagger on mobile for zero collision)
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

      // Render Active Shockwaves
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
    <div className="min-h-screen bg-[#0B0C0E] text-[#F4F4F0] flex flex-col">
      {/* Top Tabular Invariant Bar */}
      <div className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-2 font-mono text-[11px] text-[#8E95A5] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-[#FF4F00] font-bold tracking-wider">
            WELIFTOFF // 0&rarr;1
          </span>
          <span className="hidden sm:inline text-[#3A3F4B]">|</span>
          <span className="hidden sm:inline">
            INAUGURAL COHORT: MAYO COLLEGE, AJMER
          </span>
          <span className="hidden lg:inline text-[#3A3F4B]">|</span>
          <span className="hidden lg:inline">
            MSME REG: UDYAM-RJ-37-0014993
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-1.5 h-1.5 bg-[#10B981] inline-block" />
            2026/27 INSTITUTIONAL SLOTS OPEN
          </span>
          <button
            onClick={toggleAudio}
            title={
              audioEnabled
                ? "Mute Acoustic Feedback"
                : "Enable Acoustic Feedback"
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
      <header className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-4 flex items-center justify-between">
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
            [01] State Thesis
          </a>
          <a
            href="#invariants"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [02] Invariants
          </a>
          <a
            href="#syllabus"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [03] 14-Day DAG
          </a>
          <a
            href="#institutional"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors"
          >
            [04] Institutional
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

      {/* Hero Viewport: Asymmetric 12-Column Split (4-Col Thesis vs 8-Col Interactive Physics Canvas) */}
      <section id="thesis" className="hairline-b">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Left 4 Columns: Static Architectural Thesis Pane */}
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
                High school builders master terminal execution, atomic Git commit
                graphs, and zero-egress SQLite/Room persistence to architect,
                open-source, and ship production Android applications to Google
                Play and F-Droid.
              </p>
            </div>

            {/* Tabular Domain Bounds */}
            <div className="space-y-2.5 pt-4 hairline-t font-mono text-xs">
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">EXECUTION WINDOW</span>
                <span className="font-semibold text-[#F4F4F0]">
                  14 Days (28.0 Lab Hours)
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">CREW TOPOLOGY</span>
                <span className="font-semibold text-[#FF4F00]">
                  Max 3 Builders / Repo
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">PERSISTENCE BOUND</span>
                <span className="font-semibold text-[#10B981]">
                  SQLite / Room (0 B Egress)
                </span>
              </div>
              <div className="flex justify-between py-1 hairline-b">
                <span className="text-[#8E95A5]">DISTRIBUTION</span>
                <span className="font-semibold text-[#F4F4F0]">
                  Google Play AAB + F-Droid
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8E95A5]">SOURCE LICENSE</span>
                <span className="font-semibold text-[#F4F4F0]">
                  Apache-2.0 Permissive FOSS
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

          {/* Right 8 Columns: Interactive Git DAG & State Convergence Physics Canvas */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-[#0B0C0E] relative">
            {/* Mechanical Control Header */}
            <div className="hairline-b px-4 sm:px-6 py-3 bg-[#111317] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-[10px] text-[#8E95A5] uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2 h-2 inline-block"
                  style={{ backgroundColor: telemetry.accentColor }}
                />
                PROOF OF WORK // GIT DAG STATE CONVERGENCE SIMULATOR
              </span>

              {/* 3 Bounded Mechanical Verbs */}
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

            {/* Interactive HTML5 Canvas */}
            <div className="relative flex-1 min-h-[390px] sm:min-h-[460px] w-full overflow-hidden cursor-crosshair">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5] bg-[#0B0C0E]/90 px-2 py-1 hairline-all">
                DAG SPINE: 7 DETERMINISTIC RELEASE CHECKPOINTS (D01 &rarr; D14)
              </div>
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-[10px] text-[#8E95A5]">
                KINETIC INPUT: CLICK OR HOVER TO PERTURB WORKING-TREE AST NODES
              </div>
            </div>

            {/* Live Dynamic Telemetry Readout */}
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

      {/* SEC.02: Pedagogical State Governance (Steering Before Synthesis) */}
      <section className="hairline-b bg-[#111317]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
                SEC.02 // DETERMINISTIC VERSION CONTROL
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                State Control{" "}
                <span className="font-serif italic font-normal text-[#FF4F00] block">
                  Before Code Synthesis.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                Unconstrained generative models mutate dozens of files
                simultaneously until compilation fails and novices cannot
                recover. We enforce deterministic Git state invariants on Day 1
                before any AI assistant is invoked.
              </p>
            </div>

            <div className="pt-6 font-mono text-[11px] text-[#8E95A5] space-y-1.5">
              <div className="text-[#F4F4F0] font-bold">
                ADMISSIONS VERIFICATION LEDGER:
              </div>
              <p>
                University admissions committees discount generic completion
                certificates. An authentic public GitHub commit graph containing
                80+ atomic commits, pull-request reviews, and signed binary
                hashes provides cryptographic proof of authorship.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
            {/* Failure Mode */}
            <div className="p-6 sm:p-8 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#EF4444] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  FAILURE MODE // UNBOUNDED GENERATION
                </span>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Monolithic Prompt Drift
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  Issuing underspecified prompts across an entire repository
                  accumulates silent schema collisions, broken Gradle imports,
                  and non-bisectable regressions across unstaged files.
                </p>
              </div>

              <div className="p-4 bg-[#111317] hairline-all font-mono text-[11px] space-y-1.5 text-[#8E95A5]">
                <div className="text-[#EF4444] font-bold">
                  $ git status --short
                </div>
                <div> M app/src/main/AndroidManifest.xml</div>
                <div> M app/src/main/java/ui/MainActivity.kt</div>
                <div>?? app/src/main/java/net/CloudSyncTemp.kt</div>
                <div className="text-[#EF4444] pt-1">
                  ERROR: 14 unresolved references. Zero restore checkpoints.
                </div>
              </div>
            </div>

            {/* WeLiftoff Invariant */}
            <div className="p-6 sm:p-8 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  WELIFTOFF INVARIANT // ATOMIC DAG CADENCE
                </span>
                <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                  Single-Slice Mutation &amp; Bisect Gate
                </h3>
                <p className="text-xs text-[#8E95A5] leading-relaxed">
                  One domain specification, one verified compilation, one atomic
                  commit. Every experiment is isolated on a feature branch with
                  instantaneous rollback via{" "}
                  <code className="text-[#10B981] font-mono">git restore</code>{" "}
                  and{" "}
                  <code className="text-[#10B981] font-mono">git reflog</code>.
                </p>
              </div>

              <div className="p-4 bg-[#111317] hairline-all font-mono text-[11px] space-y-1.5 text-[#8E95A5]">
                <div className="text-[#10B981] font-bold">
                  $ git commit -m &quot;feat(dao): bind Room SQLite journal
                  schema&quot;
                </div>
                <div>[feat/local-dao 8e4f1a2] 2 files changed, 48 insertions(+)</div>
                <div className="text-[#F4F4F0]">
                  $ ./gradlew testDebugUnitTest &rarr; PASS (1.4s)
                </div>
                <div className="text-[#FF4F00] pt-1">
                  ✓ Verified PR #4 merged to main [SHA: f71a9e4]
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
            mechanism and verification gate.
          </p>
        </div>

        {/* 4-Column Hairline Grid */}
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

        {/* Interactive Compliance Dossier Readout Bar */}
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
              [PHASE 01] Days 01–07: Core &amp; Git Steering
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
              [PHASE 02] Days 08–14: Signing &amp; Demo Day
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
                <div className="p-2 bg-[#111317] hairline-all text-[#10B981] truncate">
                  $ {node.verificationCmd}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEC.05: Institutional Turnkey Model & Founder Dossier (7-Col / 5-Col Asymmetric Split) */}
      <section id="institutional" className="hairline-b bg-[#111317]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 7 Columns: Institutional Operations Specification */}
          <div className="lg:col-span-7 p-6 sm:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-8">
            <div className="space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
                SEC.05 // INSTITUTIONAL TURNKEY DEPLOYMENT
              </span>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Engineered for Boarding &amp; IB Schedules.
              </h2>
              <p className="text-sm text-[#8E95A5] leading-relaxed max-w-2xl">
                Designed around boarding school evening prep slots and afternoon
                activity blocks. Substrata Labs absorbs 100% of the developer
                account provisioning, compliance auditing, and release signing
                overhead.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#FF4F00] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  [OPS.01] ZERO IT BURDEN
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Executes on student laptops or standard computer lab stations.
                  Zero cloud server bills or campus firewall reconfigurations.
                </p>
              </div>

              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#10B981] font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  [OPS.02] MSME GOVERNANCE
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Registered Govt. of India Micro-Enterprise (
                  <code className="text-[#F4F4F0] font-mono">
                    UDYAM-RJ-37-0014993
                  </code>
                  ). Co-signed parental IP custody contracts.
                </p>
              </div>

              <div className="p-4 bg-[#0B0C0E] hairline-all space-y-2">
                <div className="text-[#F4F4F0] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#FF4F00]" />
                  [OPS.03] COMMON APP / UCAS
                </div>
                <p className="font-sans text-xs text-[#8E95A5] leading-relaxed">
                  Graduates cite live Google Play URLs, F-Droid packages, and
                  verified GitHub commit graphs directly in university
                  portfolios.
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
                  Founder, Substrata Labs · Architect of Sol (On-Device LLM on
                  Google Play)
                </p>
              </div>

              <blockquote className="font-serif italic text-lg sm:text-xl text-[#F4F4F0] leading-snug hairline-l pl-4 border-l-[#FF4F00]">
                &ldquo;When I was at Mayo College, the bottleneck was never raw
                curiosity—it was access to production engineering toolchains.
                WeLiftoff trains young builders to command version control,
                local-first storage, and reproducible release pipelines so they
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

      {/* SEC.06: Single Interaction Contract (Institutional Cohort Reservation Terminal) */}
      <section id="contract" className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0B0C0E]">
        <div className="max-w-2xl mx-auto hairline-all bg-[#111317] p-6 sm:p-10">
          <div className="space-y-2 mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF4F00] font-bold block">
              SEC.06 // INSTITUTIONAL INTERACTION CONTRACT
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F4F0] tracking-tight">
              Reserve an On-Campus Cohort Slot
            </h2>
            <p className="font-mono text-xs text-[#8E95A5]">
              Configure target academic window (15–30 students, Grades 9–12) to
              receive the institutional prospectus, syllabus DAG, and legal
              custody templates.
            </p>
          </div>

          {/* Bounded Mechanical Levers: Cohort Window Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-6 font-mono text-[11px]">
            {[
              "Winter 2026 Cohort",
              "Spring 2027 Cohort",
              "Summer Intensive",
              "Faculty Briefing",
            ].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  audio.click();
                  setCohortWindow(slot);
                }}
                className={`py-2 px-2 text-center cursor-pointer transition-colors ${
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
              <div className="text-[#10B981] font-bold text-sm">
                ✓ PROSPECTUS TRANSMISSION QUEUED [{cohortWindow.toUpperCase()}]
              </div>
              <p className="text-[#8E95A5] leading-relaxed">
                Institutional dossier request logged for{" "}
                <strong className="text-[#F4F4F0]">
                  {formData.institution || "your institution"}
                </strong>
                . Substrata Labs will respond within 24 hours with scheduling
                blocks and parent-student IP governance documentation.
              </p>
              <button
                type="button"
                onClick={() => {
                  audio.click();
                  setInquirySubmitted(false);
                }}
                className="btn-tactile px-4 py-2 text-[11px] uppercase"
              >
                Reset Intake Terminal
              </button>
            </div>
          ) : (
            <form
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
                    placeholder="Dr. / Principal / Head of Dept."
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
                    placeholder="Principal / HOD Computer Science"
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
                    placeholder="e.g. Mayo College / The Doon School"
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
                  COHORT PARAMETERS &amp; LAB CONSTRAINTS
                </label>
                <textarea
                  rows={3}
                  placeholder="Target batch size (15–30 students), preferred dates, or boarding prep slot constraints..."
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
                <span>DIRECT DISPATCH: FOUNDERS@SUBSTRATALABS.IN</span>
                <span>ZERO MARKETING TELEMETRY</span>
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
            <span>//</span>
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
