# CodeAdapt AI (AdaptAI) 🚀

> **Every student gets the right problem at the right time.**  
> An adaptive diagnostic and personalized coding mastery platform with isolated multi-language code execution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)

---

## 🌟 Overview

**CodeAdapt AI** is an intelligent coding platform engineered to eliminate one-size-fits-all coding education. By tracking student micro-behaviors, syntax mistakes, execution speed, and pass/fail distributions, CodeAdapt dynamically calculates continuous rolling exponential mastery scores and serves targeted problem variations.

### Key Capabilities:
- 🎯 **Adaptive Diagnostic Baseline**: Dynamically evaluates initial learner competencies across algorithmic and data structure domains.
- 💻 **In-Browser Monaco Code Editor**: Feature-packed coding experience with syntax highlighting, auto-completion, and multi-language support (Python, C++, Java).
- ⚡ **Isolated Code Execution**: Robust sandboxed code execution powered by the **Piston Engine** with automatic zero-downtime compiler failover.
- 🧠 **Dynamic Algorithmic Mastery Engine**: Continuous rolling mastery calculation with prerequisite DAG traversal and transparent recommendation reason codes.
- 📊 **Real-Time Analytics & Dashboards**: Track time-to-solve, test case pass rates, learning streaks, and mastery progress.

---

## 🏗 Architecture & Core Loop

```
       ┌───────────► [ 1. Assess ] (Diagnostic Baseline)
       │                    │
       │                    ▼
 [ 5. Recommend ]     [ 2. Practice ] (In-Browser Monaco Editor)
       ▲                    │
       │                    ▼
 [ 4. Update Mastery ] ◄── [ 3. Evaluate ] (Isolated Sandbox Execution)
```

Detailed architectural blueprints and specifications are available in the [`brain/`](brain/) directory:
- [Product Requirements Document (PRD)](brain/PRD.md)
- [Technical Requirements Document (TRD)](brain/TRD.md)
- [Database Schema & DDL](brain/DATABASE_SCHEMA.md)
- [REST API Specification](brain/API_SPEC.md)
- [Adaptive Engine Specification](brain/ADAPTIVE_ENGINE_SPEC.md)
- [System & User Workflow](brain/WORKFLOW.md)

---

## 🛠 Tech Stack

- **Frontend / Framework**: [Next.js 14](https://nextjs.org/) (App Router), React 18, Tailwind CSS, Lucide Icons
- **Code Editor**: `@monaco-editor/react`
- **Execution Sandbox**: Piston API v2 (with Docker support & Wandbox fallback)
- **Database / ORM**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Language**: TypeScript 5

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) *(optional, for running local Piston execution engine)*

### 2. Installation
```bash
git clone https://github.com/httpshanu/adapt-ai.git
cd adapt-ai
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure necessary variables:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Running the Piston Code Execution Sandbox (Optional)
To host your own local zero-rate-limit Piston sandbox:
```bash
docker compose up -d
docker exec -it codeadapt-piston piston-cli install python gcc java
```
See [PISTON_SETUP.md](PISTON_SETUP.md) for full instructions.

---

## 📄 License & Copyright

**Copyright (c) 2026 [Sanidhya Uniyal (httpshanu)](https://github.com/httpshanu)**

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete terms and details.
