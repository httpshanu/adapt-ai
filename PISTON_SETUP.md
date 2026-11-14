# Piston Code Execution Engine Setup Guide

CodeAdapt AI is now configured with first-class **Piston Engine** integration for executing Python, C++, and Java code with isolated sandboxing and automatic resilience.

---

## 🏗 Architecture Overview

1. **Piston Service (`src/lib/server/pistonService.ts`)**:
   - Formats user code, sets correct filenames (`main.py`, `main.cpp`, `Main.java`), and sends payloads to the Piston v2 API.
   - Normalizes Java public class names automatically.
2. **Resilience & Fallback Engine**:
   - If a self-hosted Piston container or authorized Piston URL is active, it runs on Piston.
   - If the public Piston endpoint is unwhitelisted or unreachable, it automatically and silently falls back to the secondary compiler sandbox (Wandbox) so your students never experience broken submissions.
3. **Queue & Endpoints**:
   - `/api/execute`: Used by the interactive sandbox editor.
   - `src/lib/server/executionQueue.ts`: Evaluates test cases for problem submissions.

---

## 🚀 How to Run Your Own 100% Free Piston Instance (Optional / Recommended)

Because the public `emkc.org` instance transitioned to a whitelist authorization model, self-hosting Piston via Docker is the best way to get **unlimited, zero-cost, zero-rate-limit executions**.

### Option A: Local Docker (Development)

1. Make sure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed and running.
2. In the project root, start the Piston container:
   ```bash
   docker compose up -d
   ```
3. Install the default language runtimes into Piston:
   ```bash
   # Enter the Piston container or install runtimes via CLI
   docker exec -it codeadapt-piston piston-cli install python
   docker exec -it codeadapt-piston piston-cli install gcc
   docker exec -it codeadapt-piston piston-cli install java
   ```
4. In your `.env.local`:
   ```env
   PISTON_API_URL=http://localhost:2000/api/v2
   ```

---

### Option B: Free Cloud Hosting (Oracle Cloud / VPS)

1. Create a free Linux VM on **Oracle Cloud Always Free Tier** (4 OCPUs, 24 GB RAM free forever) or any cloud provider.
2. Copy `docker-compose.yml` to the VM and run:
   ```bash
   docker compose up -d
   ```
3. Point your production `.env.local` or Vercel environment variables to your instance:
   ```env
   PISTON_API_URL=https://your-server-ip-or-domain:2000/api/v2
   ```

---

## ⚙ Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PISTON_API_URL` | Endpoint to your Piston server | `http://localhost:2000/api/v2` (dev) / `https://emkc.org/api/v2/piston` (prod) |
| `PISTON_API_KEY` | Optional authorization token if using authorized public Piston | *None* |
