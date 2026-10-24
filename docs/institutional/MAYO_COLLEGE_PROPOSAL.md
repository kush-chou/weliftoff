# Institutional Executive Proposal
## Liftoff Zero-to-One: 2-Week Winter Agentic Android Engineering Residency

* **Addressed To**: The Principal, Housemasters, and Department of Computer Science, Mayo College, Ajmer
* **Proposing Entity**: Substrata Labs (Govt. of India MSME: `UDYAM-RJ-37-0014993`)
* **Program Lead**: Kush Chouhan (@kush-chou)
* **Target Cohort**: Grades 9–12 (Strictly capped at 10 two-student crews / 20 seats)
* **Program Window**: Winter 2026 Residency (14 Calendar Days / 28.0 Lab Hours)
* **Scheduling**: 18:00–20:00 Daily Evening Prep / Lab Slot

---

## 1. Executive Summary

Substrata Labs respectfully submits this proposal to host **Liftoff Zero-to-One**, an intensive 14-day residential winter engineering residency at Mayo College, Ajmer. 

Unlike traditional introductory computer science courses that focus on syntax memorization and artificial exercises, Liftoff Zero-to-One trains high school students to operate as **Lead Engineering Directors**. Students direct state-of-the-art autonomous AI coding agents using Google DeepMind's Antigravity 2.0 and the Elephant-Goldfish Model (EGM) to architect, test, compile, verify, and ship production-grade Android software.

Each student crew concludes the 14-day residency with three verifiable engineering credentials:
1. **Verifiable 60+ Atomic Commit GitHub DAG**: An open-source Apache-2.0 repository under `github.com/substrata-labs` documenting authentic student-agent co-authorship via `git-ledger` Confidence 1.0 trailers (`Agent: antigravity`, `Model: gemini-2.5-pro`, `Prompted-by:`, `Audited-by:`).
2. **In-App Identity Colophon & Build Fingerprint Screen**: A compiled, cryptographic provenance screen baked directly into the app APK displaying student developer handles, Git commit SHA, build timestamp, and license.
3. **Signed Google Play Store Binaries (Tri-Track Deployment)**: Applications packaged as signed Android App Bundles (`.aab`) deployed to Google Play (Track 1: Internal App Sharing and Track 2: Closed Testing) and signed APKs published to GitHub Releases (Track 3) ready for instant QR-code installation.

---

## 2. Zero-Impact Campus Network Autonomy

A primary obstacle for institutional boarding school bootcamps is bandwidth congestion and campus firewall restrictions. Liftoff Zero-to-One is engineered from the ground up to operate with **zero school network impact**:
- **Environment Zero USB Provisioning**: On Day 1, all 20 student machines are provisioned offline in under 5 minutes using pre-flashed 64GB USB 3.0 drives containing the complete Android SDK, OpenJDK 17, Gradle binary distributions, custom CLI utilities (`android`, `inst`, `agy-skills`, `git-ledger`), and a pre-seeded offline Gradle cache (`~/.gradle/caches/modules-2/`).
- **Autonomous Cellular 5G Routing**: All outbound model API traffic (Antigravity 2.0 agent steering) is routed through Substrata Labs' dedicated portable enterprise cellular router (dual-carrier failover: Jio 5G + Airtel 5G) with AP/Client Isolation disabled on a private `192.168.1.0/24` subnet.
- **Zero Mayo College IT SLA Required**: No modifications to Mayo College proxy servers, firewall whitelist rules, or campus Wi-Fi credentials are required.

---

## 3. Hardware Pairing Policy & Handset Buffer

The residency enforces a strict native Android compile and test target without running memory-heavy virtual machine emulators on student laptops:
- **Intake Pairing Invariant**: Students without an Android handset are paired during crew matching with a co-founder who owns an Android 9.0+ smartphone. Each 2-student crew shares one physical test target permanently connected to Laptop 1 (Workstation).
- **Instructor Contingency Buffer**: Substrata Labs provides an on-site reserve buffer of:
  - 3 pre-configured reference Android test handsets (Google Pixel / Samsung Galaxy).
  - 15 certified USB-C and USB-A high-speed data cables.
  - 5 backup 64GB USB 3.0 flash drives with pre-flashed toolchain images.

---

## 4. Statutory Compliance & DPDP Child Safeguarding

In strict compliance with **Section 9 of India's Digital Personal Data Protection (DPDP) Act 2023** and COPPA:
- **Sanitized Public Attribution**: Minor legal names, house affiliations, and personal contact emails are strictly excluded from compiled APKs, public GitHub commit history, and Google Play Store metadata. Students operate under pseudonymized developer handles (e.g., `dev-handle-a`).
- **Parental Assent & Co-Signing**: Verifiable parental/guardian consent is gathered prior to Day 1, authorizing participation, parent-managed Google AI Pro subscription usage, and organization-level app publishing.
- **Zero Cloud Egress**: Student applications persist data 100% locally via SQLite/Room. The `android.permission.INTERNET` permission is prohibited and validated by automated build hooks.

---

## 5. Daily Schedule & Day 14 On-Campus Demo Day

The program integrates seamlessly into Mayo College's established evening prep routine:
- **Lab Slot (18:00–20:00)**: 2.0 dedicated hours daily across 14 consecutive evenings (28.0 total lab hours).
- **Ping-Pong Rotation**: Hour 1 (18:00–19:00) / Hour 2 (19:00–20:00) seat rotation managed via `scripts/crew-swap.sh`.
- **Day 14 Exhibition (Demo Day)**: A formal 90-minute technical defense conducted in the school auditorium. Student crews present their architectural specifications and live apps to the Principal, Housemasters, faculty, and peers. Attendees install the finished apps directly onto their phones using live Demo Day QR codes.

---

## 6. Program Financial Schedule & Substrata Support

* **Standard Catalog Fee**: ₹95,000 ($1,125 USD) per student.
* **Mayo College Pilot Founding Rate**: **₹49,000–₹55,000 ($580–$650 USD)** per student, strictly capped at 20 students (10 crews).
* **Included Materials**: Each enrolled student receives the pre-flashed 64GB USB 3.0 flash drive, a bound physical copy of the 40-page *Agentic Android Field Manual*, Substrata Labs lanyard, credential folio, and full custodial app publishing under Substrata Labs' verified Google Play Console.
