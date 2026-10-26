# WeLiftoff: Go-To-Market Strategy & Institutional Pilot Architecture

* **Author:** Kushagra Choudhary (@kush-chou)
* **Date:** 2026-10-26
* **Status:** Ideation & Multi-Lens Review Complete

---

## Overview

WeLiftoff (`weliftoff.now`) is a 14-day residential engineering residency that trains high school students to become technical founders by building and publishing real Android applications to the Google Play Store under Substrata Labs (MSME: `UDYAM-RJ-37-0014993`).

The entry strategy uses a complimentary 45-minute live Zoom masterclass for Senior Houses (Grades 9–12) at Mayo College, Ajmer. The session demonstrates how modern AI-assisted engineering tools (Claude Code, Antigravity 2.0, Android CLI) can be governed using the Elephant-Goldfish Model (EGM) to ship verified, crash-free mobile applications rather than abandoned toy prototypes. 

The masterclass acts as the primary acquisition wedge to fill an inaugural 20-seat residency cohort (10 two-person founder crews) at a pilot rate of ₹49,000–₹55,000 per student (~₹9.8–₹11.0 Lakhs total revenue).

---

## Analysis

Evaluating the strategy across six specialized review lenses revealed critical operational, legal, and conversion vulnerabilities that must be addressed before delivering the masterclass:

### 1. Governance & Trademark Invariants (`egm-structural`)
* **Unratified Partner Claims:** The live landing page (`weliftoff.now`) publicly displays `"INAUGURAL PARTNER: MAYO COLLEGE, AJMER"` and `"Winter 2026 Residency (Mayo College Pilot)"`. Premier residential institutions guard their trademarks strictly. If school leadership reviews the site before a formal agreement or Memorandum of Understanding is signed, this unratified claim creates immediate friction.
* **Minor Protection & DPDP Compliance:** Participating students are minors (ages 14–18). Indian Digital Personal Data Protection (DPDP) Act 2023 regulations require verifiable parental consent. All student applications must include custodial parental sign-off before collecting identifying details or tuition.

### 2. Funnel Mechanics & Conversion Ergonomics (`egm-design`)
* **Landing Page Persona Mismatch:** The hero and syllabus speak directly to ambitious teenage builders ("Vibe-Coder Trap", "final_v2_new folders", terminal DAG simulator). However, the reservation form (`#contract`) requests institutional credentials (`"Dr. / Principal / Head of Department"`, `"office@institution.edu.in"`). Students who want to apply after the Zoom call cannot complete an enterprise procurement form.
* **Separation of Intake Paths:** The intake flow must be split into two discrete surfaces:
  1. **Student Crew Application:** Student Name, House, Grade, technical interests, co-founder handle, and Parent WhatsApp number.
  2. **Institutional Dossier Request:** Dedicated path for school administrators requesting hardware pairing specifications and curriculum manifests.

### 3. Developer Account & Infrastructure Topology (`egm-codebase-details`)
* **Publisher Account Isolation:** Personal developer accounts on Google Play require 20 testers for 14 days before production access. As an enterprise entity, Substrata Labs operates an organizational Google Play Console backed by MSME `UDYAM-RJ-37-0014993`. Student apps must be published strictly under the Substrata Labs organization account to isolate student code experiments from the founder's personal account and prevent policy contagion.
* **Offline Campus Resilience:** Boarding school firewalls frequently block SSH, ADB pairing ports, or remote Gradle package downloads. The Day-1 physical toolchain (64GB pre-seeded USB drives containing Android SDK 35, Command Line Tools, pre-cached Gradle dependencies, and local model weights) is essential for on-campus execution.

### 4. Commercial Economics & Positioning (`egm-zoom-out`)
* **Alumni Founder Leverage:** Near-peer credibility is high: an alumnus who has already published an on-device language model app (*Sol*) to Google Play has immediate technical trust with students that older corporate trainers lack.
* **Purchasing Power:** In an institution where annual tuition exceeds ₹10–14 Lakhs, a ₹50,000 residency fee is accessible to parents if framed as a concrete, verifiable distinction on US Common App and UK UCAS university applications (public GitHub repository with 60+ atomic commits, live Play Store URL, and signed APK).

### 5. Pedagogy & Masterclass Sequencing (`egm-implementation-readiness` & `egm-comprehension`)
* **Cognitive Scope Control:** 45 minutes cannot cover EGM, atomic Git commits, reflog recovery, on-device AI architecture, and company incorporation. Attempting all five will dilute the presentation.
* **The 45-Minute Delivery Arc:**
  * `00:00–07:00` — **The Vibe-Coder Trap:** Why prompting code without version control breaks, demonstrated via a live 10-second `git reflog` restore.
  * `07:00–18:00` — **The Founder OS:** Using Elephant-Goldfish Model (EGM) to force AI agents to stress-test architecture before touching code.
  * `18:00–32:00` — **Live Glass Proof:** Physical device tether via ADB showing *Sol* (on-device AI) running offline with zero server egress.
  * `32:00–40:00` — **The 14-Day Roadmap:** Walking through the 8 milestones from empty directory to Google Play.
  * `40:00–45:00` — **Crew Application Drop:** Limited QR code application for 10 founder crews (closes in 72 hours).

---

## Goals vs. Non-Goals

### In-Scope Goals
* **Live Site Alignment:** Decouple unratified partnership language on `weliftoff.now` (replace "Inaugural Partner" with "Inaugural Campus Pilot" or stage private cohort paths).
* **Dual Conversion Flow:** Provide an immediate application form for student founder crews that captures student details and parent contact for assent.
* **Faculty Engagement:** Frame the initiative to Dr. Ashish as an alumni academic contribution integrated with evening prep (18:00–20:00) requiring zero school budget or IT overhead.
* **Parent Conversion Collateral:** Provide an executive prospectus explaining the Common App portfolio value, zero-monetization campus utility invariant, and intellectual property custody transfer to the student at age 18.

### Out-of-Scope Non-Goals
* **No Course Platform Distribution (Maven / Udemy):** Do not dilute the offering into an asynchronous online course. The value proposition depends on on-campus physical execution, pair debugging, and organizational Play Store publishing.
* **No Institutional Billing Dependency:** Do not require the school bursar to invoice parents or fund the residency from school accounts. Tuition is collected directly from parents via custodial enrollment agreements.
* **No Premature Incorporation Overhead:** Remove company incorporation mechanics from the 45-minute student masterclass. Focus exclusively on technical shipping and project credibility.

---

## Key Decisions & Staging for Next Steps

1. **Website Hotfix (Immediate):**
   * Soften `"INAUGURAL PARTNER: MAYO COLLEGE, AJMER"` to `"CAMPUS PILOT TRACK: MAYO COLLEGE"` to avoid trademark friction.
   * Add a tabbed switcher on the `#contract` intake form: `[Founder Crew Application]` vs `[Institutional Faculty Dossier]`.
2. **Faculty Outreach Timing:**
   * Allow Dr. Ashish's WhatsApp thread to sit until 18:00 IST today without double-messaging.
   * If unread by 18:00 IST, send a single structured follow-up clarifying that the masterclass requires zero school budget, zero IT infrastructure, and fits within existing evening prep slots.
3. **Drafting Phase (`/egm-draft`):**
   * Advance this brief into formal documentation:
     * `docs/designs/gtm_pilot_funnel.md` (Operational sequencing, form schemas, and parent assent loop).
     * `docs/designs/parent_prospectus.md` (College admissions value proposition, DPDP 2023 compliance, and IP custody terms).
