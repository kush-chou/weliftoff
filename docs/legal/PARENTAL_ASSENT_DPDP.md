# Statutory Parental Consent & Custodial IP Agreement
## Digital Personal Data Protection (DPDP) Act 2023 Compliance Form

* **Entity**: Substrata Labs (Govt. of India MSME: `UDYAM-RJ-37-0014993`)
* **Program**: Liftoff Zero-to-One Agentic Android Engineering Residency
* **Institutional Partner**: Mayo College, Ajmer
* **Applicable Legislation**: Section 9 of India's Digital Personal Data Protection Act 2023 ("Processing of Personal Data of Children") and Children's Online Privacy Protection Act (COPPA).

---

## 1. Statutory Parental / Guardian Consent

Under Section 9 of the Digital Personal Data Protection Act 2023, processing of personal data relating to a minor requires verifiable parental consent.

By co-signing this agreement, the Parent or Legal Guardian ("Parent/Guardian") of the minor student ("Student") hereby grants express consent for:
1. The Student's enrollment and participation in the 14-day Liftoff Zero-to-One engineering residency.
2. The delegation and use of a parent-owned or institutional 18+ Google Account subscribed to the Google AI Pro plan (Google One AI Premium) for interactive browser OAuth login (`Sign in with Google` / `agy auth login`) in Antigravity 2.0 Desktop.
3. The generation of software source code, architectural documentation, and application binaries co-directed by the Student and Antigravity 2.0.

---

## 2. Personal Identifiable Information (PII) Sanitization & Anonymity

Substrata Labs enforces strict data minimization:
1. **Public Anonymity**: The Student's real legal name, residential boarding house, personal telephone number, and personal email address shall **never** appear in public Git repositories, commit metadata, compiled Android App Bundles, APK binaries, or Google Play Store listings.
2. **Pseudonymized Developer Handles**: The Student shall be represented in public version control exclusively via a chosen developer handle (e.g., `crew-builder-01`), mapped internally to private school administration records for certification purposes.
3. **Zero Telemetry / Zero In-App Tracking**: Student application code is prohibited from requesting `android.permission.INTERNET`, transmitting user data, or collecting biometric or behavioral tracking information.

---

## 3. Custodial Publishing & Repository Governance

To overcome Google Play's 14-day closed testing barrier for personal minor accounts and ensure secure distribution:
1. **Custodial Hosting**: Student software will be hosted under Substrata Labs' verified GitHub Organization (`github.com/substrata-labs/liftoff-<team_slug>`) and compiled under the package identifier `ai.substrata.liftoff.<team_slug>`.
2. **Keyring Isolation**: Signing keys (`upload-<team_slug>.jks`) will be maintained exclusively inside Substrata Labs' encrypted, protected GitHub Actions environment (`production-release`). No student laptop will retain raw production signing credentials.
3. **Tri-Track Distribution**: Substrata Labs will deploy the student application to:
   - Track 1: Google Play Internal App Sharing.
   - Track 2: Google Play Closed Testing (restricted to pre-registered school domain accounts).
   - Track 3: GitHub Releases (signed FOSS APK).

---

## 4. Intellectual Property, Fork Rights & Age-18 Transfer

1. **Apache-2.0 Permissive Licensing**: All code authored during the residency is published under the Apache-2.0 open-source license. Both crew members retain irrevocable, non-exclusive rights to fork, modify, commercialize, or redistribute the codebase at any time.
2. **Binding Age-18 Custodial Transfer**:
   - The compiled application listing and associated Google Play store presence are held in trust by Substrata Labs during the Student's minority.
   - Upon the primary student developer reaching the age of 18 (the age of majority under Indian law), Substrata Labs will execute a formal transfer of the Google Play application listing to the student's personal Google Play Developer account at zero transfer cost.
   - The student co-founder is simultaneously granted administrator co-ownership or equal licensing rights according to the crew's internal agreement.

---

## 5. Execution & Signatures

```
Student Full Legal Name: __________________________________________________

Student Assigned Developer Handle: _________________________________________

Mayo College Scholar Number / House: _____________________________________

Parent / Guardian Full Legal Name: ________________________________________

Parent / Guardian Email Address: __________________________________________

Parent / Guardian Contact Phone: __________________________________________

Relationship to Student: [ ] Mother   [ ] Father   [ ] Legal Guardian

Signature of Parent / Guardian: ________________________   Date: ___________

Signature of Student: __________________________________   Date: ___________
```
