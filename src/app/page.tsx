"use client";

import React, { useState } from "react";
import {
  Rocket,
  GitBranch,
  ShieldCheck,
  Smartphone,
  GraduationCap,
  Sparkles,
  Terminal,
  CheckCircle2,
  Code2,
  ExternalLink,
  Users,
  Award,
  ChevronRight,
  BookOpen,
  Send,
  Lock,
  HeartHandshake,
} from "lucide-react";

export default function HomePage() {
  const [selectedWeek, setSelectedWeek] = useState<1 | 2>(1);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-purple-950/80 border-b border-cyan-800/30 px-4 py-2.5 text-xs text-center text-cyan-200/90 font-medium tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Inaugural Cohort confirmed with <strong>Mayo College, Ajmer</strong></span>
          <span className="text-cyan-400/60 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Winter / Spring 2026/27 Bookings Open for Select Institutions</span>
        </span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090b10]/80 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="rocket">🚀</span>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg text-white">WeLiftoff</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 -mt-1 font-mono">by Substrata Labs</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#philosophy" className="hover:text-cyan-300 transition-colors">Philosophy</a>
            <a href="#curriculum" className="hover:text-cyan-300 transition-colors">14-Day Syllabus</a>
            <a href="#governance" className="hover:text-cyan-300 transition-colors">Proof of Work</a>
            <a href="#schools" className="hover:text-cyan-300 transition-colors">For Principals</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide transition shadow-lg shadow-cyan-500/20"
            >
              <span>Bring to Your School</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-500/15 via-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono mb-8">
            <Terminal className="w-3.5 h-3.5" />
            <span>On-Campus High School Engineering Residency</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            From <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-200">Zero Code</span> to Live on Google Play in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
              14 Days.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed mb-10">
            Not toy visual block builders. High school students learn terminal discipline, atomic git checkpoints, and directed agentic coding to design, build, open-source, and publish real Android applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#inquire"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm tracking-wide transition shadow-xl shadow-white/10 flex items-center justify-center gap-2"
            >
              <span>Request Cohort Prospectus</span>
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#curriculum"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] text-white font-medium text-sm transition flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Explore Day-by-Day Syllabus</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/[0.08] pt-10 text-left">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold text-white font-mono">14 Days</div>
              <div className="text-xs text-slate-400 mt-1">2 hours/day on-campus evening or club cadence</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold text-cyan-400 font-mono">Max 3</div>
              <div className="text-xs text-slate-400 mt-1">Students per build crew for complete accountability</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold text-emerald-400 font-mono">100% FOSS</div>
              <div className="text-xs text-slate-400 mt-1">Apache 2.0 open source, zero ads, zero data tracking</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="text-2xl font-bold text-blue-400 font-mono">Dual Store</div>
              <div className="text-xs text-slate-400 mt-1">Google Play distribution + F-Droid sovereign catalog</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Steering Thesis Section */}
      <section id="philosophy" className="py-20 border-t border-white/[0.06] bg-[#0c0e15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">The Core Pedagogical Thesis</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              Steering Before the Engine.
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed">
              Modern AI agents are rocket engines. But without version control discipline, they make hundreds of uncommitted changes until the app breaks and students can’t go back. We teach the steering wheel first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* The Problem & Solution Cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/30">
                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold mb-2">
                  <span>❌ The Prompt-and-Pray Trap</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Students dump huge prompts into web chatbots, paste blind code blocks into broken files, accumulate invisible syntax bugs, and hit dead ends they cannot undo.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/30">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-2">
                  <GitBranch className="w-4 h-4" />
                  <span>✅ The WeLiftoff Atomic Discipline</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  One prompt, one outcome, one atomic commit. Branch per experiment. Students learn <code className="text-emerald-300 font-mono">git restore</code>, <code className="text-emerald-300 font-mono">git reset</code>, and <code className="text-emerald-300 font-mono">git reflog</code> on Day 1 before touching any generative model.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-900/30">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-2">
                  <Award className="w-4 h-4" />
                  <span>🎓 Irrefutable Admissions Proof</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Colleges ignore generic completion certificates. But an authentic GitHub repository showing 80+ sequential atomic commits, pull requests, and commit rationale over 14 days is undeniable proof of engineering leadership.
                </p>
              </div>
            </div>

            {/* Terminal Mockup */}
            <div className="rounded-2xl border border-white/10 bg-[#06080c] p-4 shadow-2xl font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[11px] text-slate-400">terminal — bash</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <p className="text-slate-500"># Day 2: Students learn the atomic commit cadence</p>
                <p><span className="text-cyan-400">mayo-builder@macbook</span> <span className="text-purple-400">~/projects/habit-pulse</span> $ git status</p>
                <p className="text-emerald-400">On branch feat/local-storage-v1</p>
                <p>Changes to be committed:</p>
                <p className="text-emerald-300 pl-4">+ modified: src/domain/JournalEngine.kt</p>
                <p className="text-emerald-300 pl-4">+ new file: src/storage/SqliteDriver.kt</p>
                <p><span className="text-cyan-400">mayo-builder@macbook</span> <span className="text-purple-400">~/projects/habit-pulse</span> $ git commit -m &quot;feat(storage): wire room database with local-only schema&quot;</p>
                <p className="text-slate-400">[feat/local-storage-v1 8e4f1a2] feat(storage): wire room database with local-only schema</p>
                <p className="text-slate-400"> 2 files changed, 48 insertions(+)</p>
                <p><span className="text-cyan-400">mayo-builder@macbook</span> <span className="text-purple-400">~/projects/habit-pulse</span> $ git push origin feat/local-storage-v1</p>
                <p className="text-cyan-300">✓ Pull request created: github.com/mayo-cohort-26/habit-pulse/pull/4</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Non-Negotiable Rules */}
      <section className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Ethical & Legal Safeguards</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              The Four Non-Negotiables
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              We hold every student project to stringent privacy, legal, and software freedom invariants.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">100% Open Source</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Licensed under Apache 2.0 by default. Full code transparency on public GitHub, reviewable by university admissions officers worldwide.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Zero Ads & Commerce</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No third-party ad networks, no predatory in-app microtransactions, and no payout accounts needed for minors. Clean utility software only.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">DPDP & Minor Safe</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Local-first architecture. Apps collect zero personal data (no accounts, no tracking telemetry), satisfying the Indian DPDP Act and COPPA.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Student IP Sovereignty</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Published through Substrata Labs org profile to shield minors from legal overhead, with legal agreement for 100% app transfer when students turn 18.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14-Day Syllabus Section */}
      <section id="curriculum" className="py-20 border-t border-white/[0.06] bg-[#0c0e15]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Intensive 14-Day Roadmap</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
              From First Commit to Demo Day
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Structured into two focused 7-day phases, fitting seamlessly into evening prep or afternoon lab blocks.
            </p>

            <div className="inline-flex p-1 rounded-xl bg-white/[0.04] border border-white/10 mt-8">
              <button
                onClick={() => setSelectedWeek(1)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedWeek === 1
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Week 1: Core Architecture & AI Steering
              </button>
              <button
                onClick={() => setSelectedWeek(2)}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedWeek === 2
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Week 2: Play Store Packaging & Demo Day
              </button>
            </div>
          </div>

          {selectedWeek === 1 ? (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 1–2</div>
                <h4 className="text-base font-bold text-white mb-2">The Terminal & Git Steering</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Setting up Android Studio, ADB, and Git. Teaching the steering thesis: pre-commit hooks, atomic branching, and how to recover from broken AI code via Git reflog.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 3–4</div>
                <h4 className="text-base font-bold text-white mb-2">Directed Agentic Engineering</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Teams of 3 formulate their problem statements. Authoring structured specs and <code className="text-cyan-300">AGENTS.md</code> constraints. Building the initial functional skeleton on local emulators.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 5–6</div>
                <h4 className="text-base font-bold text-white mb-2">Local-First Persistence & UI/UX</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Implementing SQLite/Room local storage. Zero-network architectures: why on-device inference and local data guarantee privacy, lightning-fast response, and zero cloud hosting bills.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Day 7</div>
                <h4 className="text-base font-bold text-white mb-2">Mid-Point Code Review & Freeze</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Peer pull-request reviews between teams. Automated secret scanning to guarantee zero leaked credentials. Freezing core feature scope before publishing phase.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 8–9</div>
                <h4 className="text-base font-bold text-white mb-2">Asset Licensing & FOSS Compliance</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ensuring all app icons, fonts, and assets are permissively licensed (SIL Open Font, Material Symbols). Preparing reproducible Android App Bundles (AAB) with Google Play App Signing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 10–11</div>
                <h4 className="text-base font-bold text-white mb-2">Store Submissions & F-Droid Merge Requests</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Crafting Google Play store listings, privacy declarations, and content ratings under Substrata Labs org profile. Submitting metadata to the F-Droid sovereign open-source repository.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Days 12–13</div>
                <h4 className="text-base font-bold text-white mb-2">Build Logs & Screen Demonstration Video</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Each group produces an authentic 3-minute technical demo video explaining their architecture, hurdles overcome, and design decisions. Writing the comprehensive GitHub README.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-xs font-mono text-cyan-400 mb-1">Day 14</div>
                <h4 className="text-base font-bold text-white mb-2">Campus Demo Day & Exhibition</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Live on-stage showcase before the Principal, Housemasters, CS faculty, and peers. Hands-on APK testing and presentation of Substrata Labs Engineering Badges.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* For Principals & School Leadership */}
      <section id="schools" className="py-20 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Institutional Turnkey Model</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
                Built Specifically for Leading Boarding & IB Schools.
              </h2>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                We understand boarding school schedules, academic prep slots, and IT constraints. We handle the entire operational, legal, and mentorship burden.
              </p>

              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero School IT Burden</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Runs on student laptops or existing computer lab machines. Zero cloud hosting overhead or firewall modifications needed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Legal & Compliance Governance</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Registered Micro-Enterprise (Govt. of India Udyam: <code className="text-slate-300">UDYAM-RJ-37-0014993</code>). Parent co-signed developer agreements protect all student IP.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Tangible College Admissions Differentiator</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Students submit their live Google Play link, F-Droid listing, and public GitHub repository directly on their Common App and UCAS portfolios.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Founder Note Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Kushagra Choudhary</h4>
                  <p className="text-xs text-cyan-400">Founder, Substrata Labs · Mayo College Alumnus (&apos;22–&apos;23)</p>
                  <p className="text-[11px] text-slate-500">Creator of Soul Diary (Local AI Inference on Play Store)</p>
                </div>
              </div>
              <blockquote className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                &ldquo;When I was at Mayo, the gap wasn’t talent—it was knowing how to bridge raw curiosity with real-world developer tools. AI coding agents can either make students lazy copy-pasters or hyper-empowered architects. WeLiftoff exists to build the latter: disciplined young founders who ship real software to the world.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry & Lead Capture Form */}
      <section id="inquire" className="py-20 border-t border-white/[0.06] bg-[#0c0e15]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">Reserve a Cohort Slot</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            Bring WeLiftoff to Your Institution
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Inquire for on-campus residency dates, customized batch sizing (15–30 students), and complete syllabus documentation.
          </p>

          <div className="mt-10 p-8 rounded-3xl bg-[#080a0f] border border-white/[0.08] text-left">
            {inquirySubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Prospectus Request Received</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Thank you! We will reach out to you within 24 hours with our complete institutional prospectus and scheduling options.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInquirySubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Official Designation / Role</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Head of Computer Science / Principal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">School / Institution Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Welham Girls' / The Doon School / MCGS"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. hod_cs@institution.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Target Cohort & Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Approximate student count (Grades 9–12), preferred months (e.g. Jan–March 2027), or specific inquiries..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wide transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Request Cohort Information</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Prefer direct conversation? Reach us directly at{" "}
                  <a href="mailto:founders@substratalabs.in" className="text-cyan-400 hover:underline">
                    founders@substratalabs.in
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>🚀 WeLiftoff</span>
            <span>·</span>
            <span>A Substrata Labs Initiative</span>
          </div>

          <div className="text-[11px] text-slate-600">
            Government of India Registered MSME: <code className="text-slate-400">UDYAM-RJ-37-0014993</code>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="mailto:founders@substratalabs.in" className="hover:text-cyan-400 transition">Contact</a>
            <span>·</span>
            <a href="https://substratalabs.in" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Substrata Labs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
