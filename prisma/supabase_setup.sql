-- =========================================================================
-- CodeAdapt AI — Supabase PostgreSQL Database Setup
-- Run this in your Supabase Project -> SQL Editor
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public."User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    uid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT DEFAULT 'sanidhya',
    role TEXT DEFAULT 'student',
    level INT DEFAULT 1,
    xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    "longestStreak" INT DEFAULT 0,
    league TEXT DEFAULT 'Bronze',
    badges TEXT[] DEFAULT ARRAY['First Blood'],
    "solvedCount" INT DEFAULT 0,
    "diagnosticCompleted" BOOLEAN DEFAULT false,
    "eloRating" INT DEFAULT 1200,
    "duelWins" INT DEFAULT 0,
    "duelLosses" INT DEFAULT 0,
    "bugsFixed" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Index for leaderboard queries and fast UID lookup
CREATE INDEX IF NOT EXISTS idx_user_uid ON public."User"(uid);
CREATE INDEX IF NOT EXISTS idx_user_xp ON public."User"(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_elo ON public."User"("eloRating" DESC);

-- 3. Topic Mastery Table (Adaptive Engine)
CREATE TABLE IF NOT EXISTS public."TopicMastery" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    score DOUBLE PRECISION DEFAULT 0.0,
    "isProvisional" BOOLEAN DEFAULT true,
    "evidenceCount" INT DEFAULT 0,
    "consecutiveSuccesses" INT DEFAULT 0,
    "consecutiveFailures" INT DEFAULT 0,
    status TEXT DEFAULT 'Needs Foundation',
    "needsRevision" BOOLEAN DEFAULT false,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", topic)
);

CREATE INDEX IF NOT EXISTS idx_topic_mastery_user ON public."TopicMastery"("userId");

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS public."Submission" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
    "problemId" TEXT NOT NULL,
    "problemTitle" TEXT NOT NULL,
    topic TEXT NOT NULL,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    verdict TEXT NOT NULL,
    "passedTests" INT DEFAULT 0,
    "totalTests" INT DEFAULT 0,
    "runtimeMs" DOUBLE PRECISION DEFAULT 0.0,
    "memoryMb" DOUBLE PRECISION DEFAULT 0.0,
    "hintsUsed" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submission_user ON public."Submission"("userId");
CREATE INDEX IF NOT EXISTS idx_submission_problem ON public."Submission"("problemId");

-- 5. Daily Quiz Results Table
CREATE TABLE IF NOT EXISTS public."DailyQuizResult" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    score INT NOT NULL,
    total INT NOT NULL,
    "xpEarned" INT NOT NULL,
    "completedAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("userId", date)
);

CREATE INDEX IF NOT EXISTS idx_quiz_user ON public."DailyQuizResult"("userId");

-- 6. Chat Messages Table (Community Lounge)
CREATE TABLE IF NOT EXISTS public."ChatMessage" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL REFERENCES public."User"(id) ON DELETE CASCADE,
    "authorName" TEXT NOT NULL,
    "authorAvatar" TEXT NOT NULL,
    "authorUid" TEXT NOT NULL,
    "authorBadge" TEXT,
    content TEXT NOT NULL,
    "codeSnippet" TEXT,
    "codeLanguage" TEXT,
    reactions JSONB DEFAULT '{}'::JSONB,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_channel ON public."ChatMessage"("channelId");

-- 7. Duel Matches Table (1v1 Arena)
CREATE TABLE IF NOT EXISTS public."DuelMatch" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    "player1Id" TEXT NOT NULL,
    "player2Id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "winnerId" TEXT,
    "player1EloChange" INT DEFAULT 0,
    "player2EloChange" INT DEFAULT 0,
    "timeTakenSeconds" INT DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Realtime on ChatMessages (For Discord-style live lounge)
ALTER PUBLICATION supabase_realtime ADD TABLE public."ChatMessage";

-- 9. Seed Demo Accounts
INSERT INTO public."User" (id, uid, name, email, avatar, role, level, xp, streak, "longestStreak", league, badges, "solvedCount", "diagnosticCompleted", "eloRating", "duelWins", "duelLosses", "bugsFixed")
VALUES 
    ('acc_sanidhya', 'CA-1001', 'Sanidhya Uniyal', 'sanidhya@codeadapt.ai', 'sanidhya', 'competitive', 5, 920, 3, 7, 'Gold', ARRAY['Array Master', 'Quiz Blitz', 'Night Owl'], 8, true, 1420, 8, 2, 11),
    ('acc_arjun', 'CA-2048', 'Arjun Sharma', 'arjun.prep@codeadapt.ai', 'aarav', 'student', 4, 850, 4, 6, 'Gold', ARRAY['Consistent', 'Fast Learner'], 12, true, 1380, 6, 3, 9),
    ('acc_riya', 'CA-3109', 'Riya Patel', 'riya.learns@codeadapt.ai', 'priya', 'student', 2, 420, 2, 4, 'Silver', ARRAY['First Blood', 'Rising Star'], 6, false, 1210, 2, 4, 4),
    ('acc_dev', 'CA-4096', 'Dev Khurana', 'dev.lead@codeadapt.ai', 'dev_pro', 'competitive', 8, 1850, 14, 21, 'Diamond', ARRAY['Code Ninja', 'Speed Demon', 'Algorithm Ace'], 28, true, 1820, 24, 3, 35)
ON CONFLICT (uid) DO NOTHING;
