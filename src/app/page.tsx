'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Brain, 
  Compass, 
  LineChart, 
  ShieldCheck, 
  Sparkles, 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative selection:bg-indigo-500/20">
      {/* Background radial gradients for ambient soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-indigo-100/60 via-purple-50/40 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-100/40 blur-[100px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <span className="font-mono font-bold text-sm tracking-tighter">&lt;/&gt;</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">CodeAdapt AI</span>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Curriculum</a>
        </nav>

        {/* Auth CTA buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-all"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Heading & Value Prop */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI-Driven Adaptive Learning Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Every student gets <br />
            the{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              right problem
            </span>{' '}
            <br />
            at the right time.
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
            CodeAdapt AI is an adaptive DSA learning platform that tracks your mastery across 10 core computer science domains, identifies weak algorithmic patterns, and curates optimal challenges automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link
              href="/diagnostic"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
            >
              <span>Start Free Diagnostic</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm flex items-center justify-center transition-all shadow-xs"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        {/* Right Column: High-Tech Visual Mockup with Floating Badges */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Main Decorative Visual Box */}
          <div className="w-full max-w-[440px] aspect-[4/3.8] rounded-3xl bg-white border border-slate-200/90 p-6 shadow-2xl relative overflow-hidden">
            {/* Background subtle grid */}
            <div className="absolute inset-0 bg-slate-50/50" />

            {/* Coding visual */}
            <div className="relative h-full w-full flex flex-col justify-end items-center pb-4">
              <div className="absolute top-6 left-6 font-mono text-[11px] text-indigo-700/80 space-y-1 bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 w-[calc(100%-3rem)]">
                <div>&gt; assessing_user_mastery()</div>
                <div>&gt; array_score: 72% [Developing]</div>
                <div>&gt; next_problem: &quot;Binary Search&quot;</div>
              </div>

              {/* Central illustration avatar */}
              <div className="relative mb-2">
                <div className="h-28 w-28 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 p-0.5 shadow-xl shadow-indigo-500/20">
                  <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                    <Brain className="h-14 w-14 text-indigo-600 animate-pulse" />
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-700">Live Adaptive Evaluation</span>
            </div>

            {/* Floating Badge 1: Learn */}
            <div className="absolute top-8 right-6 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-md flex items-center gap-2 animate-bounce">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Learn</span>
            </div>

            {/* Floating Badge 2: Practice */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>Practice</span>
            </div>

            {/* Floating Badge 3: Improve */}
            <div className="absolute bottom-8 left-6 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-md flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Improve</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom 3 Feature Cards */}
      <section id="features" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Compass className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Adaptive Learning</h3>
              <p className="text-sm text-slate-500 mt-1">Personalized recommendations calibrated to your pace</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <LineChart className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Track Mastery</h3>
              <p className="text-sm text-slate-500 mt-1">See your progress across 10 DSA topics in real-time</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Spaced Repetition</h3>
              <p className="text-sm text-slate-500 mt-1">Ebbinghaus SM-2 revision curve keeps concepts fresh</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
