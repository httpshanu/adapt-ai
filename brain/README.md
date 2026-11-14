# CodeAdapt AI — System Architecture & Specification Repository ("The Brain")

Welcome to the central engineering and product specification repository for **CodeAdapt AI**. This directory contains the exhaustive, production-grade blueprints required to build, test, and deploy the platform.

---

## 📚 Document Index

| Document | File Link | Focus Area & Description |
| :--- | :--- | :--- |
| **PRD (Product Requirements Document)** | [PRD.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/PRD.md) | User personas (Riya, Arjun, Meera), 9 functional epics with acceptance criteria, low-fidelity wireframes for all screens & screen states, metrics framework, and launch gates. |
| **TRD (Technical Requirements Document)** | [TRD.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/TRD.md) | End-to-end system architecture, Next.js / Monaco / PostgreSQL / BullMQ / Judge0 tech stack, sandbox isolation & security constraints (cgroups, rlimits, zero-egress), and NFRs. |
| **Database Schema & DDL** | [DATABASE_SCHEMA.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/DATABASE_SCHEMA.md) | Mermaid Entity-Relationship Diagram (ERD), full PostgreSQL 15+ DDL SQL scripts, foreign keys, indexes, enums, and initial curriculum seed data. |
| **REST API Specification** | [API_SPEC.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/API_SPEC.md) | Complete REST API contract: Authentication, Diagnostic flow, Problem Bank, Code Execution & Submissions, Adaptive Recommendations, and Telemetry event tracking. |
| **Adaptive Engine Algorithmic Spec** | [ADAPTIVE_ENGINE_SPEC.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/ADAPTIVE_ENGINE_SPEC.md) | Continuous rolling exponential mastery formula ($\alpha = 0.20$), test score modifiers, prerequisite DAG traversal, transparent reason codes, and automated test scenario matrices. |
| **System & User Workflow** | [WORKFLOW.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/WORKFLOW.md) | Visual sequence diagrams, state machines, and end-to-end user journeys (Activation, Solving loop, Recovery path, Spaced revision). |

---

## 🎯 Product Mission & Core Loop

> **Tagline:** *"Every student gets the right problem at the right time."*

```
       ┌───────────► [ 1. Assess ] (Diagnostic Baseline)
       │                    │
       │                    ▼
 [ 5. Recommend ]     [ 2. Practice ] (In-Browser Monaco Editor)
       ▲                    │
       │                    ▼
 [ 4. Update Mastery ] ◄── [ 3. Evaluate ] (Isolated Judge Execution)
```

---

## 🛠 Recommended Next Steps for Implementation

1. **Database Setup:** Run [DATABASE_SCHEMA.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/DATABASE_SCHEMA.md) migrations on local or cloud PostgreSQL (e.g. Supabase / Neon).
2. **Backend API Scaffolding:** Implement REST endpoints defined in [API_SPEC.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/API_SPEC.md) using the architecture specified in [TRD.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/TRD.md).
3. **Adaptive Engine Logic:** Unit test the 7 canonical scenarios defined in [ADAPTIVE_ENGINE_SPEC.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/ADAPTIVE_ENGINE_SPEC.md).
4. **Frontend Client Scaffold:** Set up Next.js 14+ with Tailwind CSS and Monaco Editor following the UX wireframes and screen states in [PRD.md](file:///c:/Users/sanid/OneDrive/Desktop/adapt%20ai/brain/PRD.md).
