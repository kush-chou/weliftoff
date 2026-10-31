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
  Layers,
  ArrowRight,
  AlertTriangle,
  XCircle,
  Workflow,
  GraduationCap,
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
    headRef: "MAIN -> PRODUCTION [7/7 MILESTONES]",
    entropyBits: "release-v1.0-signed.aab",
    rollbackBound: "GOOGLE PLAY TRACK 1 [READY]",
    workingTreeStatus: "7/7 STATE CHECKPOINTS VERIFIED",
    springStiffness: 0.075,
    turbulence: 0,
    accentColor: "#10B981",
  },
  drift: {
    headRef: "DRIFT DETECTED [BUILD ASSERTION FAILED]",
    entropyBits: "BUILD HALTED // UNTRACKED DRIFT",
    rollbackBound: "RECOVERY REQUIRED",
    workingTreeStatus: "AST FRACTURE // SCHEMA COLLISION",
    springStiffness: 0.006,
    turbulence: 3.4,
    accentColor: "#EF4444",
  },
  reflog: {
    headRef: "REFLOG RESTORE [11.4ms RECOVERY]",
    entropyBits: "release-v1.0-signed.aab (RESTORED)",
    rollbackBound: "GOOGLE PLAY TRACK 1 [RESTORED]",
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
    code: "[INV.04 // OWNERSHIP]",
    title: "Custodial IP Transfer at Age 18",
    metric: "100% STUDENT OWNERSHIP",
    summary:
      "Applications published under Substrata Labs during minority to satisfy Google Play testing requirements, with full legal assignment to the student at age 18.",
    architecturalMechanism:
      "Release signing keys maintained in protected GitHub Actions Environments using isolated upload keystores (upload-<slug>.jks).",
    legalBound:
      "Statutory founder agreement under Govt. of India MSME (UDYAM-RJ-37-0014993) guaranteeing 100% intellectual property ownership and irrevocable Apache-2.0 fork rights to all builders.",
    verificationGate:
      "Cryptographic SHA-256 signing fingerprint and In-App Identity Colophon Screen baked into graduation dossier.",
  },
];

type AudiencePerspective = "builder" | "executive";

interface SyllabusNode {
  dayRange: string;
  code: string;
  title: string;
  artifact: string;
  specification: string;
  verificationCmd: string;
  executiveTitle?: string;
  executiveArtifact?: string;
  executiveSpecification?: string;
  executiveVerification?: string;
}

const SYLLABUS_DAG: Record<PhaseKey, SyllabusNode[]> = {
  phase1: [
    {
      dayRange: "DAYS 01–02",
      code: "MILESTONE.01 // FOUNDATION",
      title: "Repository Architecture, Custom Domain & Toolchain",
      artifact: "Configured Repo + Spaceship Live Domain + ADB Pair",
      specification:
        "Structure a production repository that scales from day one. Provision a live custom domain via Spaceship with edge HTTPS in under 30 minutes, master atomic commit discipline, and pair physical test handsets over ADB.",
      verificationCmd: "spaceship domain status && git reflog -n 5 && adb devices",
      executiveTitle: "Production Infrastructure & Live Enterprise Domain",
      executiveArtifact: "Live HTTPS Custom Domain & Verified Dev Environment",
      executiveSpecification:
        "Establish enterprise engineering hygiene. Students independently provision an authentic custom domain with automated SSL encryption and configure local toolchains without school IT network burdens.",
      executiveVerification: "Audit Criterion: Independent Domain Verification & Physical Glass Handshake",
    },
    {
      dayRange: "DAYS 03–04",
      code: "MILESTONE.02 // SPECIFICATION",
      title: "System Architecture & State Modeling",
      artifact: "docs/spec.md + Deterministic UiState Container",
      specification:
        "Draft rock-solid technical specifications using AI agent workflows under a strict token budget. Model screen states deterministically to guarantee zero runtime crashes.",
      verificationCmd: "git status && ./gradlew compileDebugKotlin --console=plain",
      executiveTitle: "Computational Architecture & Formal Specification",
      executiveArtifact: "Formal System Architecture Spec & Crash-Resilient State Model",
      executiveSpecification:
        "Instill rigorous computational thinking. Students draft formal engineering specifications under token constraints, modeling provably crash-free finite state machines before assembling user interfaces.",
      executiveVerification: "Audit Criterion: Deterministic State Coverage & Zero Compilation Warnings",
    },
    {
      dayRange: "DAYS 05–06",
      code: "MILESTONE.03 // PERSISTENCE",
      title: "Local-First SQLite Engine (Room Database)",
      artifact: "Room @Entity + KSP @Dao + Offline Migrations",
      specification:
        "Architect local-first data storage that runs completely offline with zero network connectivity. Ensure user records never leave the physical handset under statutory DPDP Act bounds.",
      verificationCmd: "./gradlew testDebugUnitTest verifyZeroEgress",
      executiveTitle: "Statutory Child Data Safeguarding (DPDP Act §9)",
      executiveArtifact: "Local-First Encrypted Database · Zero Egress Architecture",
      executiveSpecification:
        "Enforce privacy-by-design ethics. All application data is stored in on-device encrypted SQLite databases with zero cloud egress, strictly complying with Section 9 of the DPDP Act 2023 for minor protection.",
      executiveVerification: "Audit Criterion: Automated Zero-Egress Network Isolation Gate (DPDP §9 Compliant)",
    },
    {
      dayRange: "DAY 07",
      code: "MILESTONE.04 // SCOPE LOCK",
      title: "Feature Freeze & Cross-Crew Code Audit",
      artifact: "Merged Main Branch + Physical Glass 60FPS Audit",
      specification:
        "Conduct peer code audits across cohort builders. Inspect 60 FPS UI rendering on physical glass using scrcpy and lock release scope for the shipping pipeline.",
      verificationCmd: "git ledger --last --agents-only",
      executiveTitle: "Peer Code Review & Hardware Performance QA",
      executiveArtifact: "Peer-Audited Release Branch & Verified 60 FPS Glass Metric",
      executiveSpecification:
        "Cultivate critical collaborative evaluation. Student crews cross-examine peer codebases, audit 60fps frame budgets on physical devices, and defend architectural invariants prior to release freeze.",
      executiveVerification: "Audit Criterion: Multi-Party Codebase Signoff & Frame Budget Audit",
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
      executiveTitle: "Cryptographic Authorship & In-App Provenance",
      executiveArtifact: "Signed Native Binary + Tamper-Proof Founder Colophon",
      executiveSpecification:
        "Implement industry design standards with edge-to-edge layout ergonomics. Embed an immutable digital signature identifying student co-founders, Git commit SHA, and licensing.",
      executiveVerification: "Audit Criterion: Cryptographic Keystore Verification & Material 3 Insets",
    },
    {
      dayRange: "DAYS 10–11",
      code: "MILESTONE.06 // PLAY STORE",
      title: "Google Play Store Publishing",
      artifact: "Track 1 Internal Sharing + Signed GitHub Release",
      specification:
        "Author compliant Store listings with zero-data disclosures. Build signed Android App Bundles (AAB) and deploy directly to Google Play Store internal testing tracks.",
      verificationCmd: "./gradlew uploadReleasePrivateBundle",
      executiveTitle: "Global App Store Distribution & Regulatory Compliance",
      executiveArtifact: "Live Google Play Track 1 Installation Link + Store Listing",
      executiveSpecification:
        "Navigate the global distribution pipeline. Students author compliant Store listings, provide zero-data safety disclosures, and deploy releases directly onto Google Play tracks.",
      executiveVerification: "Audit Criterion: Google Play Policy Compliance & Direct Device Sideload",
    },
    {
      dayRange: "DAYS 12–13",
      code: "MILESTONE.07 // INCIDENT DRILL",
      title: "Incident Recovery & Emergency Hotfix Drills",
      artifact: "Hotfix Pull Request + 10-Second Reflog Rollback",
      specification:
        "Simulate production regressions and execute instantaneous rollbacks via git reflog. Verify release pipelines and test assertions remain resilient under incident pressure.",
      verificationCmd: "gh pr status && ls -lh docs/architecture.md",
      executiveTitle: "Disaster Recovery & Algorithmic Resilience",
      executiveArtifact: "Verified Incident Recovery Log & 10-Second State Rollback",
      executiveSpecification:
        "Simulate high-pressure production anomalies. Founders diagnose breaking regressions and execute sub-second deterministic rollbacks using distributed version control forensics.",
      executiveVerification: "Audit Criterion: Recovery Time Objective < 15s via Version Control DAG",
    },
    {
      dayRange: "DAY 14",
      code: "MILESTONE.08 // DEMO DAY",
      title: "Founder Demo Day & MSME Incorporation",
      artifact: "Auditorium Defense + Govt. MSME Certificate",
      specification:
        "Live product defense before mentors, industry leaders, and peers. Attendees install the finished native app directly via QR codes and inspect the founder's live web URL, verifiable commit history, and Govt. of India Udyam MSME certificate.",
      verificationCmd: "sha256sum app-release-signed.apk && curl -I https://weliftoff.now",
      executiveTitle: "Public Defense & Govt. MSME Enterprise Recognition",
      executiveArtifact: "Auditorium Defense Dossier + Govt. MSME Enterprise Certificate",
      executiveSpecification:
        "Students orally defend their technical architecture before an auditorium panel of engineers and educators, graduating with an active Google Play app and an official Govt. of India Udyam MSME registration.",
      executiveVerification: "Audit Criterion: Live QR App Installation & Ministry of MSME Recognition",
    },
  ],
};

export default function WeLiftoffPage() {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audiencePerspective, setAudiencePerspective] =
    useState<AudiencePerspective>("builder");
  const [dagMode, setDagMode] = useState<DagMode>("atomic");
  const [activeInvariantId, setActiveInvariantId] =
    useState<InvariantKey>("foss");
  const [activePhase, setActivePhase] = useState<PhaseKey>("phase1");
  const [cohortWindow, setCohortWindow] = useState("Winter 2026 Online Cohort (Cross-Campus)");
  const [intakeMode, setIntakeMode] = useState<"crew" | "institutional">("crew");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  const [crewData, setCrewData] = useState({
    studentName: "",
    schoolOrCity: "",
    grade: "",
    coFounder: "",
    parentWhatsApp: "",
    notes: "",
  });
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors: Record<string, string> = {};

    if (intakeMode === "crew") {
      const trimmedName = crewData.studentName.trim();
      const trimmedSchool = crewData.schoolOrCity.trim();
      const trimmedGrade = crewData.grade.trim();
      const trimmedPhone = crewData.parentWhatsApp.trim();

      if (!trimmedName) {
        errors.studentName = "Founder name is required.";
      } else if (trimmedName.length < 2) {
        errors.studentName = "Name must be at least 2 characters.";
      }

      if (!trimmedSchool) {
        errors.schoolOrCity = "Institution/College & City is required.";
      }

      if (!trimmedGrade) {
        errors.grade = "Background / Role is required.";
      }

      if (!trimmedPhone) {
        errors.parentWhatsApp = "WhatsApp contact number is required.";
      } else if (!/^[0-9+\s\-()]{10,18}$/.test(trimmedPhone)) {
        errors.parentWhatsApp = "Enter a valid phone number (at least 10 digits).";
      }
    } else {
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
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      audio.drift();
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    audio.commit();

    try {
      const payload = {
        mode: intakeMode,
        cohortWindow,
        data: intakeMode === "crew" ? crewData : formData,
      };

      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        setSubmissionId(json.id || `WL-${Date.now().toString(36).toUpperCase()}`);
      } else {
        setSubmissionId(`WL-${Date.now().toString(36).toUpperCase()}`);
      }
    } catch {
      setSubmissionId(`WL-${Date.now().toString(36).toUpperCase()}`);
    } finally {
      setIsSubmitting(false);
      setInquirySubmitted(true);
      audio.restore();
    }
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
      <div className="hairline-b bg-[#0B0C0E] px-4 sm:px-8 py-2 font-mono text-xs text-[#8E95A5] flex items-center justify-between gap-3 relative z-50">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-[#F4F4F0] font-medium truncate text-xs">
            ONLINE COHORTS · OFFLINE WORKSHOPS · BOOTCAMPS
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="flex items-center gap-1.5 text-[#10B981] font-semibold text-xs whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block led-indicator-emerald" />
            ADMISSIONS OPEN <span className="hidden sm:inline">// SEATS AVAILABLE</span>
          </span>
          <button
            onClick={toggleAudio}
            title={
              audioEnabled
                ? "Mute Mechanical Keyswitch Audio"
                : "Enable Mechanical Keyswitch Audio"
            }
            aria-label="Toggle acoustic feedback"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-white/10 bg-[#14171E] hover:border-white/30 text-[#8E95A5] hover:text-[#F4F4F0] transition-all cursor-pointer text-xs shrink-0"
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
      <header className="hairline-b bg-[#0B0C0E]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6 lg:gap-10 sticky top-0 z-40">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-sm bg-[#161922] border border-white/10 flex items-center justify-center text-lg select-none shadow-sm shadow-black/40">
            🚀
          </div>
          <div>
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-[#F4F4F0] block leading-none">
              WELIFTOFF
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#8E95A5] mt-0.5 block">
              Substrata Labs
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-4 lg:gap-6 xl:gap-8 font-mono text-xs uppercase tracking-wider text-[#8E95A5] whitespace-nowrap">
          <a
            href="#anti-tutorial"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1 whitespace-nowrap"
          >
            {audiencePerspective === "builder" ? "Ideate" : "Imagine"}
          </a>
          <a
            href="#pairing"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1 whitespace-nowrap"
          >
            Build
          </a>
          <a
            href="#invariants"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1 whitespace-nowrap"
          >
            Test
          </a>
          <a
            href="#syllabus"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1 whitespace-nowrap"
          >
            Launch
          </a>
          <a
            href="#institutional"
            onClick={() => audio.click()}
            className="hover:text-[#FF4F00] transition-colors py-1 whitespace-nowrap"
          >
            {audiencePerspective === "builder" ? "Iterate" : "Loop"}
          </a>
        </nav>

        <a
          href="#contract"
          onClick={() => audio.click()}
          className="btn-primary-tactile rounded-sm px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 whitespace-nowrap"
        >
          Apply for Seat <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </header>

      {/* Hero Viewport: Asymmetric 12-Column Split */}
      <section id="thesis" className="hairline-b bg-gradient-to-b from-[#0E1015] to-[#0B0C0E] relative lg:min-h-[calc(100vh-85px)] flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[calc(100vh-85px)] w-full">
          {/* Left 5 Columns: Architectural Thesis Pane */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between bg-[#0B0C0E]/70 backdrop-blur-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FF4F00]/10 border border-[#FF4F00]/25 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F00] led-indicator-amber" />
                  {audiencePerspective === "builder"
                    ? "TECHNICAL ACCELERATOR // ZERO TO ONE"
                    : "INSTITUTIONAL ACCREDITATION // ADMISSIONS MOAT"}
                </div>
                <div className="flex items-center p-0.5 bg-[#12141A] rounded-sm border border-white/10 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      audio.click();
                      setAudiencePerspective("builder");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                      audiencePerspective === "builder"
                        ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-sm shadow-[#FF4F00]/20"
                        : "text-[#8E95A5] hover:text-[#F4F4F0]"
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Builder</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      audio.click();
                      setAudiencePerspective("executive");
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                      audiencePerspective === "executive"
                        ? "bg-[#10B981] text-[#0B0C0E] font-bold shadow-sm shadow-[#10B981]/20"
                        : "text-[#8E95A5] hover:text-[#F4F4F0]"
                    }`}
                  >
                    <GraduationCap className="w-3 h-3" />
                    <span>Academic</span>
                  </button>
                </div>
              </div>

              <h1 className="font-display text-fluid-hero font-bold text-[#F4F4F0] tracking-tight">
                {audiencePerspective === "builder" ? (
                  <>
                    Don&apos;t just learn to code.{" "}
                    <span className="font-serif italic font-normal text-[#FF4F00] block mt-1">
                      Ship like a technical founder.
                    </span>
                  </>
                ) : (
                  <>
                    Beyond superficial tutorials.{" "}
                    <span className="font-serif italic font-normal text-[#FF4F00] block mt-1">
                      Verified founder credentials for global admissions.
                    </span>
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
                {audiencePerspective === "builder"
                  ? "Anyone can generate code in an afternoon. The difference between an abandoned side project and a real founder credential is shipping native software that real users can install on their devices. Master the production toolchain used to structure, test, and publish native apps to Google Play."
                  : "Top university admissions boards (Common App, UCAS, Ivy League) discount toy web exercises and unverified certificates. WeLiftoff yields non-falsifiable proof of execution: a published Google Play app on physical glass, statutory minor data protection under Section 9 of the DPDP Act 2023, and an official Govt. of India Udyam MSME registration."}
              </p>
            </div>

            {/* Tabular Domain Bounds: Machined Specimen Plaque */}
            <div className="panel-machined rounded-sm p-4 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 hairline-b text-xs text-[#8E95A5] font-bold uppercase tracking-wider">
                <span>
                  {audiencePerspective === "builder"
                    ? "FOUNDER SPECIFICATION"
                    : "INSTITUTIONAL & ACADEMIC AUDIT"}
                </span>
                <span className="text-[#10B981] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] led-indicator-emerald" />
                  {audiencePerspective === "builder"
                    ? "SHIPPED ARTIFACTS"
                    : "ACCREDITED OUTCOMES"}
                </span>
              </div>
              {audiencePerspective === "builder" ? (
                <>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">TARGET RUNTIME</span>
                    <span className="font-semibold text-[#F4F4F0] text-right text-xs">
                      Native Android · Compose (Physical Glass)
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">APP STORE RELEASE</span>
                    <span className="font-semibold px-1.5 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-right text-xs">
                      Signed AAB &amp; Google Play Internal Track
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">LOCAL PERSISTENCE</span>
                    <span className="font-semibold text-[#F4F4F0] text-right text-xs">
                      Encrypted Room SQLite · Zero Server Egress
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">CUSTOM DOMAIN</span>
                    <span className="font-semibold text-[#FF6A1F] text-right text-xs">
                      Live Spaceship HTTPS Domain &lt; 30m
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">EMERGENCY ROLLBACK</span>
                    <span className="font-semibold text-[#10B981] text-right text-xs">
                      &lt; 12ms Deterministic Recovery [reflog]
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">IP &amp; REPO OWNERSHIP</span>
                    <span className="font-semibold text-[#10B981] text-right text-xs">
                      100% Student-Owned Code, Keys &amp; Commits
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">ADMISSIONS PORTFOLIO</span>
                    <span className="font-semibold text-[#F4F4F0] text-right text-xs">
                      Tier-1 Common App &amp; UCAS Activity Evidence
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">STATUTORY SAFEGUARDING</span>
                    <span className="font-semibold px-1.5 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-right text-xs">
                      DPDP Act 2023 §9 · Zero Network Egress
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">LEGAL ENTITY</span>
                    <span className="font-semibold text-[#F4F4F0] text-right text-xs">
                      Govt. of India Udyam MSME Sole Proprietorship
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">PHYSICAL RIGOR</span>
                    <span className="font-semibold text-[#FF6A1F] text-right text-xs">
                      Tested on Physical Handsets · Zero School IT Burden
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 hairline-b gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">ALGORITHMIC RESILIENCE</span>
                    <span className="font-semibold text-[#10B981] text-right text-xs">
                      Incident Recovery Drills &amp; Peer Code Defense
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 gap-3">
                    <span className="text-[#8E95A5] shrink-0 text-xs">IP ASSIGNMENT</span>
                    <span className="font-semibold text-[#10B981] text-right text-xs">
                      100% Student Custody at Age 18 (Irrevocable)
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Single Primary Interaction Contract */}
            <div className="pt-2">
              <a
                href="#contract"
                onClick={() => audio.commit()}
                className="btn-primary-tactile rounded-sm block w-full py-3.5 text-center font-mono text-xs sm:text-sm font-bold uppercase tracking-wider"
              >
                {audiencePerspective === "builder"
                  ? "Apply for Founder Seat →"
                  : "Request Institutional & Cohort Prospectus →"}
              </a>
              <span className="block text-center font-mono text-xs text-[#8E95A5] mt-2">
                {audiencePerspective === "builder"
                  ? "Build Real Software · Ship to Google Play"
                  : "Statutory Child Safeguarding · Verifiable Admissions Portfolio"}
              </span>
            </div>
          </div>

          {/* Right 7 Columns: Git DAG State Convergence Engine */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#0B0C0E] relative overflow-hidden">
            {/* Control Header & Mechanical State Switchers */}
            <div className="hairline-b px-4 sm:px-6 py-2.5 bg-[#111317]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 font-mono text-xs relative z-10">
              <span className="text-xs text-[#8E95A5] uppercase tracking-wider flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                  style={{
                    backgroundColor: telemetry.accentColor,
                  }}
                />
                SHIPPING PIPELINE // FROM EMPTY REPO TO GOOGLE PLAY
              </span>

              {/* Bounded Mechanical States */}
              <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    audio.commit();
                    setDagMode("atomic");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-xs font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
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
                  Production Path
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.drift();
                    setDagMode("drift");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-xs font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
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
                  Simulate Bug
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.restore();
                    setDagMode("reflog");
                  }}
                  className={`px-3 py-1.5 rounded-sm text-center text-xs font-mono uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
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
                  10s Rollback
                </button>
              </div>
            </div>

            {/* Interactive Physics Canvas with Oscilloscope Reticles */}
            <div className="relative flex-1 min-h-[380px] lg:min-h-0 w-full overflow-hidden cursor-crosshair">
              {/* Corner crosshairs */}
              <div className="absolute top-2 left-2 text-white/20 font-mono text-xs pointer-events-none">+</div>
              <div className="absolute top-2 right-2 text-white/20 font-mono text-xs pointer-events-none">+</div>
              <div className="absolute bottom-2 left-2 text-white/20 font-mono text-xs pointer-events-none">+</div>
              <div className="absolute bottom-2 right-2 text-white/20 font-mono text-xs pointer-events-none">+</div>

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full touch-pan-y"
              />
              <div className="absolute top-3 left-4 pointer-events-none font-mono text-xs text-[#8E95A5] bg-[#0B0C0E]/85 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                7 CANONICAL RELEASE MILESTONES // ZERO-TO-ONE
              </div>
              <div className="absolute bottom-3 left-4 pointer-events-none font-mono text-xs text-[#8E95A5] bg-[#0B0C0E]/75 backdrop-blur-sm px-2.5 py-1 rounded-sm border border-white/10">
                INTERACTIVE CONVERGENCE: CLICK OR DRAG NODES TO AUDIT RECOVERY
              </div>
            </div>

            {/* Telemetry Readout Console */}
            <div className="hairline-t px-4 sm:px-6 py-3 bg-[#111317]/95 backdrop-blur-sm font-mono text-xs text-[#8E95A5] flex flex-wrap items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <span className="text-[#8E95A5]">PIPELINE:</span>
                <strong
                  style={{ color: telemetry.accentColor }}
                  className="font-bold bg-[#0B0C0E] px-2.5 py-1 rounded-sm border border-white/10"
                >
                  {telemetry.headRef}
                </strong>
              </span>
              <span>
                ARTIFACT:{" "}
                <strong className="text-[#F4F4F0] bg-[#0B0C0E] px-2.5 py-1 rounded-sm border border-white/10 font-bold">
                  {telemetry.entropyBits}
                </strong>
              </span>
              <span>
                STATUS:{" "}
                <strong className="text-[#10B981] bg-[#0B0C0E] px-2.5 py-1 rounded-sm border border-white/10 font-bold">
                  {telemetry.rollbackBound}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Anti-Tutorial Pitch & Founder Comparison Matrix */}
      <section id="anti-tutorial" className="hairline-b bg-gradient-to-b from-[#0B0C0E] via-[#0E1015] to-[#0B0C0E] min-h-[100dvh] flex flex-col justify-center py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-8 lg:space-y-10">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
              ANTITUTORIAL PITCH
            </div>
            <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
              Why 90% of side projects die in{" "}
              <code className="text-[#FF4F00] font-mono text-2xl sm:text-3xl bg-[#FF4F00]/10 px-2 py-0.5 rounded border border-[#FF4F00]/25">
                final_v2_new
              </code>{" "}
              folders.
            </h2>
            <p className="text-base text-[#8E95A5] leading-relaxed">
              Prompting an app into existence is easy. Maintaining, versioning, and deploying software that doesn&apos;t shatter when real users touch it is what separates a hobbyist from a technical founder.
            </p>
          </div>

          {/* 3-Column Pain Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40 card-tactile">
              <div className="w-10 h-10 rounded-sm bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                The Vibe-Coder Trap
              </h3>
              <p className="text-sm text-[#8E95A5] leading-relaxed">
                You can prompt an app into existence in an afternoon, but the moment a feature breaks, you have no rollback strategy and are scared to touch your own codebase.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40 card-tactile">
              <div className="w-10 h-10 rounded-sm bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                Tutorial Hell
              </h3>
              <p className="text-sm text-[#8E95A5] leading-relaxed">
                Courses teach syntax and isolated commands in a sterile sandbox, leaving you clueless on how to actually structure, version, and deploy a live product.
              </p>
            </div>

            <div className="p-6 rounded-sm bg-[#111317] border border-white/10 space-y-3 shadow-md shadow-black/40 card-tactile">
              <div className="w-10 h-10 rounded-sm bg-[#8E95A5]/15 border border-white/15 flex items-center justify-center text-[#8E95A5]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                Solo Amateurism
              </h3>
              <p className="text-sm text-[#8E95A5] leading-relaxed">
                You treat version control like a clumsy save button instead of a release pipeline, making it impossible to iterate fast or bring on co-founders later.
              </p>
            </div>
          </div>

          {/* High-Contrast Comparison Matrix Card */}
          <div className="rounded-sm border border-white/15 overflow-hidden shadow-2xl bg-[#0E1015]">
            <div className="p-4 sm:p-5 hairline-b bg-[#14171E] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <span className="text-[#F4F4F0] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#FF4F00]" />
                THE FOUNDER STANDARD: HOBBYIST VS. TECHNICAL FOUNDER
              </span>
              <span className="text-xs text-[#8E95A5]">
                DETERMINISTIC VERIFICATION INVARIANT
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* The Hobbyist Column */}
              <div className="p-6 sm:p-7 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E]/90 space-y-4">
                <div className="flex items-center justify-between pb-3 hairline-b">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#EF4444] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    THE HOBBYIST
                  </span>
                  <span className="text-xs font-mono text-[#8E95A5]">
                    STUCK ON LOCALHOST
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-[#8E95A5]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-base leading-none mt-0.5">&times;</span>
                    <span><strong className="text-[#C4C8D4]">Codes on main:</strong> Zero branch isolation; breaking one experimental feature crashes the entire application.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-base leading-none mt-0.5">&times;</span>
                    <span><strong className="text-[#C4C8D4]">Scared to refactor:</strong> Has no atomic commit history or reflog checkpoints; terrified of regression.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-base leading-none mt-0.5">&times;</span>
                    <span><strong className="text-[#C4C8D4]">Projects die locally:</strong> Trapped on <code>localhost:3000</code> or simulator windows; never published to real users.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#EF4444] font-mono text-base leading-none mt-0.5">&times;</span>
                    <span><strong className="text-[#C4C8D4]">Quits when messy:</strong> Abandons the codebase the moment merge conflicts or prompt drift overwhelms the folder.</span>
                  </li>
                </ul>
              </div>

              {/* The Technical Founder Column */}
              <div className="p-6 sm:p-7 bg-[#11141C] space-y-4 relative">
                <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-[#FF5E14] to-[#10B981]" />
                <div className="flex items-center justify-between pb-3 hairline-b border-white/10">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] led-indicator-emerald" />
                    THE TECHNICAL FOUNDER
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold">
                    SHIPS TO PRODUCTION
                  </span>
                </div>

                <ul className="space-y-3 text-sm text-[#F4F4F0]">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong className="text-[#10B981]">Ships in isolated branches:</strong> Builds features in dedicated, bisect-safe slices without risking the core runtime.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong className="text-[#10B981]">Experiments aggressively:</strong> Backed by 10-second <code>git reflog</code> rollbacks; refactors fearlessly at high speed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong className="text-[#10B981]">Deploys every merge:</strong> Code flows automatically to live Android glass and signed Google Play Store tracks.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                    <span><strong className="text-[#10B981]">Treats repo as an asset:</strong> Clean commit provenance, in-app colophons, and verified architectures that co-founders can build on.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pairing Topology & Verification Cadence */}
      <section id="pairing" className="hairline-b bg-gradient-to-b from-[#111317] to-[#0D0F13] min-h-[100dvh] flex flex-col justify-center py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 rounded-sm overflow-hidden bg-[#0B0C0E]">
            <div className="lg:col-span-4 p-6 sm:p-8 lg:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-6 bg-[#0E1015]">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FF4F00]/10 border border-[#FF4F00]/25 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
                  EXECUTION DISCIPLINE // SEPARATION OF CONCERNS
                </div>
                <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                  Separation of Steering{" "}
                  <span className="font-serif italic font-normal text-[#FF4F00] block mt-1">
                    And Verification.
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#8E95A5] leading-relaxed">
                  Autonomous software synthesis requires strict separation between the implementer and the auditor.
                  Whether building solo or in co-founder pairs, founders maintain strict discipline: alternating between generative code synthesis and deterministic verification, with clean Git commit provenance and peer review.
                </p>
              </div>

              <div className="pt-6 hairline-t font-mono text-xs text-[#8E95A5] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block led-indicator-emerald" />
                <span>CONFIDENCE 1.0 DUAL-AUTHOR GIT TRAILERS ENFORCED</span>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2">
              {/* Primary Terminal 1 */}
              <div className="p-6 sm:p-8 hairline-b md:hairline-b-0 md:hairline-r bg-[#0B0C0E] flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#FF6A1F] font-bold flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" />
                      TERMINAL 1 // FOUNDER A (SHIPPING ENGINE)
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-[#FF4F00]/15 text-[#FF6A1F] font-mono text-xs font-bold border border-[#FF4F00]/30">
                      HARDWARE TETHER
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                    Synthesis &amp; Hardware Tether
                  </h3>
                  <p className="text-sm text-[#8E95A5] leading-relaxed">
                    Tethered to the physical Android handset over ADB and live edge deployment. Coordinates automated builds,
                    Spaceship custom domain routing, and on-device runtime execution.
                  </p>
                </div>

                {/* Machined Terminal Window */}
                <div className="rounded-sm border border-white/10 bg-[#0E1014] overflow-hidden shadow-lg shadow-black/60 font-mono text-xs">
                  <div className="bg-[#151820] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-[#8E95A5]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
                      <span className="ml-2 text-[#F4F4F0] font-semibold">terminal-1: founder-a@launch-mvp (pixel-8a)</span>
                    </div>
                    <span className="text-[#10B981] font-bold">ONLINE</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-[#8E95A5]">
                    <div className="text-[#FF6A1F] font-bold">
                      $ spaceship domain purchase &amp;&amp; vercel --prod
                    </div>
                    <div className="text-[#F4F4F0] bg-[#07080A] p-2.5 rounded-sm border border-white/5 font-mono text-xs">
                      {'{ "domain": "app.weliftoff.space", "edge_ssl": "active", "latency": "14ms" }'}
                    </div>
                    <div className="text-[#10B981] pt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Live HTTPS custom domain active in under 30 minutes
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
                    <span className="font-mono text-xs uppercase tracking-wider text-[#10B981] font-bold flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4" />
                      TERMINAL 2 // FOUNDER B (VERIFICATION GATE)
                    </span>
                    <span className="px-2 py-0.5 rounded-sm bg-[#10B981]/15 text-[#10B981] font-mono text-xs font-bold border border-[#10B981]/30">
                      VERIFICATION GATE
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                    Verification &amp; Specification Gate
                  </h3>
                  <p className="text-sm text-[#8E95A5] leading-relaxed">
                    Dedicated to architectural specification (docs/spec.md), read-only AST diff auditing
                    with git-ledger, scrcpy device mirroring, and compile-time zero-egress validation.
                  </p>
                </div>

                {/* Machined Terminal Window */}
                <div className="rounded-sm border border-white/10 bg-[#0E1014] overflow-hidden shadow-lg shadow-black/60 font-mono text-xs">
                  <div className="bg-[#151820] px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-[#8E95A5]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block" />
                      <span className="ml-2 text-[#F4F4F0] font-semibold">terminal-2: founder-b@launch-mvp (audit)</span>
                    </div>
                    <span className="text-[#10B981] font-bold">SYNCED</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-[#8E95A5]">
                    <div className="text-[#10B981] font-bold">
                      $ git ledger --diff --md
                    </div>
                    <div className="text-[#F4F4F0] bg-[#07080A] p-2.5 rounded-sm border border-white/5 font-mono text-xs space-y-1">
                      <div>Agent: antigravity | Repo: launch-mvp</div>
                      <div>Founder-A: @handle-a | Founder-B: @handle-b</div>
                    </div>
                    <div className="text-[#10B981] pt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
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
        </div>
      </section>

      {/* Statutory Legal & Architectural Invariants */}
      <section id="invariants" className="hairline-b bg-[#0B0C0E] min-h-[100dvh] flex flex-col justify-center py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-6">
          <div className="p-6 sm:p-8 hairline-b flex flex-wrap items-end justify-between gap-4 bg-gradient-to-r from-[#12151B] to-[#0B0C0E] rounded-sm border border-white/10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
                STATUTORY COMPLIANCE &amp; ARCHITECTURAL GATES
              </div>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                Four Non-Negotiable Institutional Invariants
              </h2>
            </div>
            <p className="font-mono text-xs sm:text-sm text-[#8E95A5] max-w-lg leading-relaxed">
              Select an invariant below to inspect its architectural enforcement
              mechanism, statutory DPDP Act compliance, and automated test gate.
            </p>
          </div>

          {/* 4-Column Invariant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/10 rounded-sm overflow-hidden bg-[#0B0C0E]">
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
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span
                        className={`font-bold uppercase tracking-wider ${
                          isSelected ? "text-[#FF6A1F]" : "text-[#8E95A5]"
                        }`}
                      >
                        {item.code}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-sm bg-[#FF4F00] text-[#0B0C0E] font-bold text-xs shadow-sm">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#F4F4F0]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#8E95A5] leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 hairline-t font-mono text-xs text-[#10B981] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    BOUND: {item.metric}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Invariant Detail Dossier Panel */}
          <div className="p-6 sm:p-8 bg-[#111317] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-sm border border-white/10 shadow-lg shadow-black/50">
            <div className="lg:col-span-4 space-y-2.5 hairline-b lg:hairline-b-0 lg:hairline-r pb-6 lg:pb-0 lg:pr-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A1F] font-bold block">
                ACTIVE SPECIFICATION // {activeInvariant.code}
              </span>
              <h4 className="font-display text-2xl font-bold text-[#F4F4F0]">
                {activeInvariant.title}
              </h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                {activeInvariant.metric}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-2 text-sm text-[#8E95A5] leading-relaxed">
              <span className="font-mono text-xs uppercase text-[#F4F4F0] font-bold block tracking-wider">
                ARCHITECTURAL ENFORCEMENT &amp; STATUTORY DPDP BOUNDARY
              </span>
              <p className="text-[#C4C8D4] leading-relaxed">{activeInvariant.architecturalMechanism}</p>
              <p className="pt-1 text-[#8E95A5] leading-relaxed">{activeInvariant.legalBound}</p>
            </div>

            <div className="lg:col-span-4 p-5 bg-[#0B0C0E] rounded-sm border border-white/10 space-y-2.5 font-mono text-xs shadow-md shadow-black/40">
              <span className="text-xs uppercase text-[#FF6A1F] font-bold block tracking-wider flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                DETERMINISTIC VERIFICATION GATE
              </span>
              <div className="bg-[#14171E] p-3.5 rounded-sm border border-white/5 text-[#F4F4F0] leading-relaxed text-xs">
                {activeInvariant.verificationGate}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14-Day Execution DAG Syllabus */}
      <section id="syllabus" className="hairline-b bg-gradient-to-b from-[#0B0C0E] to-[#0E1015] min-h-[100dvh] flex flex-col justify-center py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full space-y-8">
          <div className="p-6 sm:p-8 hairline-b flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#12151B] to-[#0B0C0E] rounded-sm border border-white/10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
                {audiencePerspective === "builder"
                  ? "FOUNDER MILESTONES // RELEASE ROADMAP"
                  : "ACADEMIC & STATUTORY ROADMAP // ADMISSIONS ACCREDITATION"}
              </div>
              <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                {audiencePerspective === "builder"
                  ? "From Empty Repo to Production Release on Google Play"
                  : "14-Day Verified Engineering Curriculum & Child Safeguarding Milestones"}
              </h2>
            </div>

            {/* Bounded Perspective & Phase Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Perspective Lens Switcher */}
              <div className="flex items-center p-0.5 bg-[#12141A] rounded-sm border border-white/10 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => {
                    audio.click();
                    setAudiencePerspective("builder");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                    audiencePerspective === "builder"
                      ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/20"
                      : "text-[#8E95A5] hover:text-[#F4F4F0]"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Builder Spec</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.click();
                    setAudiencePerspective("executive");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                    audiencePerspective === "executive"
                      ? "bg-[#10B981] text-[#0B0C0E] font-bold shadow-md shadow-[#10B981]/20"
                      : "text-[#8E95A5] hover:text-[#F4F4F0]"
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Academic Audit</span>
                </button>
              </div>

              {/* 2 Bounded Phase Levers */}
              <div className="flex items-center gap-1 font-mono text-xs p-1 rounded-sm bg-[#12141A] border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    audio.click();
                    setActivePhase("phase1");
                  }}
                  className={`px-4 py-2 rounded-sm uppercase cursor-pointer transition-all ${
                    activePhase === "phase1"
                      ? "bg-white/15 text-[#F4F4F0] font-bold"
                      : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
                  }`}
                >
                  Phase 1: Architecture
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.click();
                    setActivePhase("phase2");
                  }}
                  className={`px-4 py-2 rounded-sm uppercase cursor-pointer transition-all ${
                    activePhase === "phase2"
                      ? "bg-white/15 text-[#F4F4F0] font-bold"
                      : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
                  }`}
                >
                  Phase 2: Shipping
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/10 rounded-sm overflow-hidden bg-[#0B0C0E]">
            {SYLLABUS_DAG[activePhase].map((node, idx) => (
              <div
                key={node.code}
                className={`p-6 sm:p-7 ${
                  idx < 3 ? "lg:hairline-r" : ""
                } hairline-b lg:hairline-b-0 flex flex-col justify-between space-y-6 bg-[#0B0C0E] hover:bg-[#111319] transition-colors relative group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 rounded-sm bg-[#FF4F00]/15 text-[#FF6A1F] border border-[#FF4F00]/30 font-bold">
                      {node.dayRange}
                    </span>
                    <span className="text-[#8E95A5]">{node.code}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#F4F4F0] group-hover:text-[#FF6A1F] transition-colors">
                    {audiencePerspective === "executive" && node.executiveTitle
                      ? node.executiveTitle
                      : node.title}
                  </h3>
                  <p className="text-sm text-[#8E95A5] leading-relaxed">
                    {audiencePerspective === "executive" && node.executiveSpecification
                      ? node.executiveSpecification
                      : node.specification}
                  </p>
                </div>

                <div className="space-y-2.5 pt-5 hairline-t font-mono text-xs">
                  <div className="text-[#8E95A5]">
                    {audiencePerspective === "builder" ? "FOUNDER DELIVERABLE:" : "ACADEMIC ARTIFACT:"}{" "}
                    <strong className="text-[#F4F4F0] block font-semibold mt-1 text-xs sm:text-sm">
                      {audiencePerspective === "executive" && node.executiveArtifact
                        ? node.executiveArtifact
                        : node.artifact}
                    </strong>
                  </div>
                  <div
                    className={`p-2.5 bg-[#12151C] rounded-sm border border-white/10 overflow-x-auto text-xs whitespace-nowrap ${
                      audiencePerspective === "builder" ? "text-[#10B981]" : "text-[#38BDF8]"
                    }`}
                    title={
                      audiencePerspective === "executive" && node.executiveVerification
                        ? node.executiveVerification
                        : node.verificationCmd
                    }
                  >
                    {audiencePerspective === "builder"
                      ? `$ ${node.verificationCmd}`
                      : `✓ ${node.executiveVerification}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Operations & Founder Dossier */}
      <section id="institutional" className="hairline-b bg-[#111317] min-h-[100dvh] flex flex-col justify-center py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 border border-white/10 rounded-sm overflow-hidden bg-[#0B0C0E]">
            {/* Left 7 Columns: Operations Architecture */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between space-y-8 bg-[#0E1015]">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-white/5 border border-white/10 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#FF4F00]" />
                  ONLINE COHORTS &amp; OFFLINE WORKSHOPS
                </div>
                <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
                  Zero Bureaucracy. Production Delivery.
                </h2>
                <p className="text-base text-[#8E95A5] leading-relaxed max-w-2xl">
                  Engineered to operate independently of school administration gatekeeping.
                  Substrata Labs runs across high-density weekend workshops, online cohorts,
                  and intensive on-campus bootcamps—with zero institutional IT overhead.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-5 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2.5 shadow-sm">
                  <div className="text-[#FF6A1F] font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <Terminal className="w-4 h-4 text-[#FF4F00]" />
                    HARDWARE INVARIANT
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                    Toolchains run deterministically on low-spec Windows, Linux, and macOS hardware. Lightweight headless compilation requires no high-end rigs or expensive cloud accounts.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2.5 shadow-sm">
                  <div className="text-[#10B981] font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <Layers className="w-4 h-4 text-[#10B981]" />
                    MULTI-FORMAT DELIVERY
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                    Choose between high-density 2-day weekend workshops, online cohorts, or intensive on-campus bootcamps.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2.5 shadow-sm">
                  <div className="text-[#10B981] font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    100% IP OWNERSHIP &amp; GOVT MSME
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                    Founders graduate with an official Govt. of India Udyam MSME Sole Proprietorship, 100% intellectual property ownership, and private signing keys.
                  </p>
                </div>

                <div className="p-5 rounded-sm bg-[#0B0C0E] border border-white/10 space-y-2.5 shadow-sm">
                  <div className="text-[#F4F4F0] font-bold flex items-center gap-2 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#FF4F00]" />
                    ADMISSIONS CREDENTIAL PORTFOLIO
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
                    Graduates cite verifiable deliverables—live HTTPS domains, signed Google Play listings, and atomic commit histories—directly in Common App and UCAS portfolios.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Principal Instructor & Founder Dossier */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 bg-[#0B0C0E] flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono text-xs text-[#8E95A5] hairline-b pb-3">
                  <span className="text-[#FF6A1F] font-bold tracking-wider">
                    DIRECTOR DOSSIER // SUBSTRATA LABS
                  </span>
                  <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#F4F4F0]">
                    PROVEN SHIPPING CREDENTIAL
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-2xl font-extrabold text-[#F4F4F0]">
                    Kushagra Choudhary
                  </h3>
                  <p className="font-mono text-xs sm:text-sm text-[#10B981] mt-1 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Architect of Sol (On-Device AI on Google Play) · Founder, Substrata Labs
                  </p>
                </div>

                <blockquote className="font-serif italic text-lg sm:text-xl text-[#F4F4F0] leading-snug pl-4 border-l-2 border-[#FF4F00] bg-gradient-to-r from-[#FF4F00]/5 to-transparent py-3">
                  &ldquo;Anyone can generate code in a local folder today. The real bottleneck is knowing how to structure, test, and package software so it doesn&apos;t break when real users touch it. WeLiftoff trains builders to command production toolchains—from git architecture to signed Google Play releases—so they graduate with non-falsifiable proof of execution.&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 hairline-t font-mono text-xs text-[#8E95A5] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[#F4F4F0] font-semibold">DELIVERY: ONLINE · REGIONAL NCR · INBOUND CAMPUS</span>
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
        </div>
      </section>

      {/* Founder Crew & Institutional Reservation Terminal */}
      <section id="contract" className="py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-[#0B0C0E] via-[#0E1015] to-[#0B0C0E] relative min-h-[100dvh] flex flex-col justify-center">
        <div className="max-w-3xl mx-auto panel-machined rounded-sm p-6 sm:p-10 shadow-2xl shadow-black/80 w-full space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#FF4F00]/10 border border-[#FF4F00]/25 text-[#FF6A1F] font-mono text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF4F00] led-indicator-amber" />
              ADMISSIONS OPEN · SHIP REAL PRODUCTION SOFTWARE
            </div>
            <h2 className="font-display text-fluid-h2 font-bold text-[#F4F4F0] tracking-tight">
              Stop sitting on localhost. Build &amp; ship real software.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#8E95A5] leading-relaxed">
              Reserve your seat in the founder bootcamp. Build a real native Android app, configure local-first persistence, and launch on Google Play.
            </p>

            {/* Tuition Breakdown Card */}
            <div className="p-4 rounded-sm bg-[#0A0C0E] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div>
                <span className="text-[#8E95A5] block text-xs uppercase">WEEKEND WORKSHOP</span>
                <span className="text-[#F4F4F0] font-bold text-base">₹14,999</span>{" "}
                <span className="text-[#8E95A5] block text-[11px] mt-0.5">2-Day Hands-on Founder Sprint</span>
              </div>
              <div>
                <span className="text-[#FF6A1F] block text-xs uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4F00]" />
                  ONLINE BOOTCAMP
                </span>
                <span className="text-[#10B981] font-bold text-base">₹55,000</span>{" "}
                <span className="text-[#8E95A5] block text-[11px] mt-0.5">Early Rate · Catalog: ₹75,000</span>
              </div>
              <div>
                <span className="text-[#8E95A5] block text-xs uppercase">CAMPUS BOOTCAMP</span>
                <span className="text-[#F4F4F0] font-bold text-base">₹95,000</span>{" "}
                <span className="text-[#8E95A5] block text-[11px] mt-0.5">Inbound Institutional Track</span>
              </div>
            </div>
          </div>

          {/* Dual-Path Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 font-mono text-xs p-1 rounded-sm bg-[#12141A] border border-white/10">
            <button
              type="button"
              onClick={() => {
                audio.click();
                setIntakeMode("crew");
                setFormErrors({});
              }}
              className={`py-2.5 px-3 rounded-sm uppercase cursor-pointer transition-all text-center flex items-center justify-center gap-2 ${
                intakeMode === "crew"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30"
                  : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Apply for Founder Seat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                audio.click();
                setIntakeMode("institutional");
                setFormErrors({});
              }}
              className={`py-2.5 px-3 rounded-sm uppercase cursor-pointer transition-all text-center flex items-center justify-center gap-2 ${
                intakeMode === "institutional"
                  ? "bg-[#FF4F00] text-[#0B0C0E] font-bold shadow-md shadow-[#FF4F00]/30"
                  : "bg-transparent text-[#8E95A5] hover:text-[#F4F4F0]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Campus Inquiry</span>
            </button>
          </div>

          {/* Cohort Window Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {[
              "Winter 2026 Online Founder Bootcamp",
              "Offline Weekend Workshop (Delhi-NCR)",
              "Spring 2027 Online Founder Bootcamp",
              "Institutional Campus Bootcamp Inquiry",
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
                  <CheckCircle2 className="w-4 h-4 text-[#0B0C0E]" />
                )}
              </button>
            ))}
          </div>

          {inquirySubmitted ? (
            <div className="p-6 bg-[#0B0C0E] rounded-sm border border-[#10B981]/40 font-mono text-xs sm:text-sm space-y-3">
              <div className="text-[#10B981] font-bold text-sm sm:text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                {intakeMode === "crew"
                  ? `FOUNDER APPLICATION TRANSMITTED [${cohortWindow.toUpperCase()}]`
                  : `INSTITUTIONAL INQUIRY TRANSMITTED [${cohortWindow.toUpperCase()}]`}
              </div>
              {intakeMode === "crew" ? (
                <p className="text-[#8E95A5] leading-relaxed">
                  Founder application logged for{" "}
                  <strong className="text-[#F4F4F0]">
                    {crewData.studentName || "Applicant"}
                  </strong>{" "}
                  ({crewData.schoolOrCity || "Independent Applicant"}) {submissionId ? <span>[Ref: <code className="text-[#10B981] font-mono">{submissionId}</code>]</span> : null}. Substrata Labs will verify the cohort window and send the onboarding kit and schedule via WhatsApp to{" "}
                  <strong className="text-[#F4F4F0]">{crewData.parentWhatsApp || "your registered contact"}</strong>{" "}
                  within 24 hours.
                </p>
              ) : (
                <p className="text-[#8E95A5] leading-relaxed">
                  Institutional inquiry registered for{" "}
                  <strong className="text-[#F4F4F0]">
                    {formData.institution || "your institution"}
                  </strong>{" "}
                  ({formData.name}) {submissionId ? <span>[Ref: <code className="text-[#10B981] font-mono">{submissionId}</code>]</span> : null}. Substrata Labs will provide the executive proposal, hardware pairing manifest, and institutional clearance documentation within 24 hours.
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  audio.click();
                  setInquirySubmitted(false);
                }}
                className="btn-tactile rounded-sm px-4 py-2 text-xs uppercase cursor-pointer"
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
              className="space-y-4 font-mono text-xs sm:text-sm"
            >
              {intakeMode === "crew" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="crew-studentName" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                        APPLICANT / FOUNDER NAME *
                      </label>
                      <input
                        id="crew-studentName"
                        type="text"
                        maxLength={100}
                        aria-invalid={!!formErrors.studentName}
                        aria-describedby={formErrors.studentName ? "studentName-error" : undefined}
                        placeholder="e.g. Kushagra Choudhary"
                        value={crewData.studentName}
                        onChange={(e) => {
                          setCrewData({ ...crewData, studentName: e.target.value });
                          if (formErrors.studentName) setFormErrors({ ...formErrors, studentName: undefined });
                        }}
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.studentName ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.studentName && (
                        <span id="studentName-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.studentName}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="crew-schoolOrCity" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                        COLLEGE / INSTITUTION &amp; CITY *
                      </label>
                      <input
                        id="crew-schoolOrCity"
                        type="text"
                        maxLength={100}
                        aria-invalid={!!formErrors.schoolOrCity}
                        aria-describedby={formErrors.schoolOrCity ? "schoolOrCity-error" : undefined}
                        placeholder="e.g. IIT Delhi / Delhi-NCR / Bengaluru"
                        value={crewData.schoolOrCity}
                        onChange={(e) => {
                          setCrewData({ ...crewData, schoolOrCity: e.target.value });
                          if (formErrors.schoolOrCity) setFormErrors({ ...formErrors, schoolOrCity: undefined });
                        }}
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.schoolOrCity ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.schoolOrCity && (
                        <span id="schoolOrCity-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.schoolOrCity}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="crew-grade" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                        BACKGROUND / ROLE *
                      </label>
                      <input
                        id="crew-grade"
                        type="text"
                        maxLength={100}
                        aria-invalid={!!formErrors.grade}
                        aria-describedby={formErrors.grade ? "grade-error" : undefined}
                        placeholder="e.g. CS Undergrad / Builder / Working Engineer"
                        value={crewData.grade}
                        onChange={(e) => {
                          setCrewData({ ...crewData, grade: e.target.value });
                          if (formErrors.grade) setFormErrors({ ...formErrors, grade: undefined });
                        }}
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.grade ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.grade && (
                        <span id="grade-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.grade}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="crew-coFounder" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                        CO-FOUNDER (OPTIONAL)
                      </label>
                      <input
                        id="crew-coFounder"
                        type="text"
                        maxLength={100}
                        placeholder="Name of paired builder (or leave blank if solo)"
                        value={crewData.coFounder}
                        onChange={(e) => setCrewData({ ...crewData, coFounder: e.target.value })}
                        className="input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="crew-parentWhatsApp" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                      WHATSAPP CONTACT * <span className="text-[#555A68] font-normal">(For onboarding; guardian contact if under 18)</span>
                    </label>
                    <input
                      id="crew-parentWhatsApp"
                      type="tel"
                      maxLength={20}
                      aria-invalid={!!formErrors.parentWhatsApp}
                      aria-describedby={formErrors.parentWhatsApp ? "parentWhatsApp-error" : undefined}
                      placeholder="+91 98290 XXXXX"
                      value={crewData.parentWhatsApp}
                      onChange={(e) => {
                        setCrewData({ ...crewData, parentWhatsApp: e.target.value });
                        if (formErrors.parentWhatsApp) setFormErrors({ ...formErrors, parentWhatsApp: undefined });
                      }}
                      className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                        formErrors.parentWhatsApp ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                      }`}
                    />
                    {formErrors.parentWhatsApp && (
                      <span id="parentWhatsApp-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                        ! {formErrors.parentWhatsApp}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="crew-notes" className="block uppercase text-xs text-[#8E95A5] font-bold">
                        TARGET ANDROID APP CONCEPT / PROBLEM STATEMENT
                      </label>
                      <span className="text-xs text-[#555A68] font-mono">
                        {crewData.notes.length}/1000
                      </span>
                    </div>
                    <textarea
                      id="crew-notes"
                      rows={3}
                      maxLength={1000}
                      placeholder="What real native Android app do you want to build and ship to Google Play? (e.g. on-device AI copilot, local-first encrypted notes, sensor toolkit, developer utility...)"
                      value={crewData.notes}
                      onChange={(e) => setCrewData({ ...crewData, notes: e.target.value })}
                      className="input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="intake-name" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
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
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.name ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <span id="name-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="intake-role" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
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
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.role ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.role && (
                        <span id="role-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="intake-institution" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
                        INSTITUTION NAME *
                      </label>
                      <input
                        id="intake-institution"
                        type="text"
                        maxLength={120}
                        aria-invalid={!!formErrors.institution}
                        aria-describedby={formErrors.institution ? "institution-error" : undefined}
                        placeholder="e.g. Modern School, New Delhi / DPS / Step by Step"
                        value={formData.institution}
                        onChange={(e) => {
                          setFormData({ ...formData, institution: e.target.value });
                          if (formErrors.institution) setFormErrors({ ...formErrors, institution: undefined });
                        }}
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.institution ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.institution && (
                        <span id="institution-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.institution}
                        </span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="intake-email" className="block uppercase text-xs text-[#8E95A5] mb-1.5 font-bold">
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
                        className={`input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68] ${
                          formErrors.email ? "border-[#EF4444] focus:border-[#EF4444]" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <span id="email-error" role="alert" aria-live="polite" className="text-[#EF4444] font-mono text-xs mt-1.5 block">
                          ! {formErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="intake-notes" className="block uppercase text-xs text-[#8E95A5] font-bold">
                        LAB CONSTRAINTS &amp; SCHEDULING PARAMETERS
                      </label>
                      <span className="text-xs text-[#555A68] font-mono">
                        {formData.notes.length}/1000
                      </span>
                    </div>
                    <textarea
                      id="intake-notes"
                      rows={3}
                      maxLength={1000}
                      placeholder="Target cohort window, laboratory constraints, or student batch size..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="input-machined w-full px-3.5 py-2.5 rounded-sm text-sm font-sans placeholder:text-[#555A68]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary-tactile rounded-sm w-full py-4 font-mono text-sm font-bold uppercase tracking-wider cursor-pointer shadow-lg shadow-[#FF4F00]/25 disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0B0C0E] border-t-transparent rounded-full animate-spin" />
                    <span>
                      {intakeMode === "crew"
                        ? "TRANSMITTING FOUNDER CREW REGISTRATION..."
                        : "TRANSMITTING INSTITUTIONAL INQUIRY..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {intakeMode === "crew"
                      ? `Claim Founder Crew Seat [${cohortWindow.split(" ")[0]} Cohort] →`
                      : `Request Institutional Pilot Dossier [${cohortWindow.split(" ")[0]} Cohort] →`}
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Architectural Footer */}
      <footer className="hairline-t bg-[#0B0C0E] py-10 px-4 sm:px-8 font-mono text-xs sm:text-sm text-[#8E95A5]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-lg select-none">
              🚀
            </span>
            <span className="text-[#F4F4F0] font-bold">WELIFTOFF.NOW</span>
            <span className="text-white/20">{"//"}</span>
            <span>SUBSTRATA LABS</span>
          </div>

          <div className="text-xs">
            GOVT. OF INDIA MSME:{" "}
            <code className="text-[#F4F4F0] bg-white/5 px-2 py-0.5 rounded-sm border border-white/10">
              UDYAM-RJ-37-0014993
            </code>
          </div>

          <div className="flex items-center gap-5 text-xs sm:text-sm">
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
              substratalabs.org <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
