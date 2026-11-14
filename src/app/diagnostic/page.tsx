'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Award, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Timer 
} from 'lucide-react';
import { DIAGNOSTIC_QUESTIONS } from '../../lib/diagnosticData';
import { useApp } from '../../context/AppContext';
import { TopicSlug } from '../../types';

export default function DiagnosticPage() {
  const router = useRouter();
  const { completeDiagnostic } = useApp();

  // Mode: 'instructions' | 'test' | 'completed'
  const [mode, setMode] = useState<'instructions' | 'test' | 'completed'>('instructions');
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [resultsSummary, setResultsSummary] = useState<Record<TopicSlug, number> | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 mins

  // Timer countdown
  useEffect(() => {
    if (mode === 'test' && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, secondsLeft]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / DIAGNOSTIC_QUESTIONS.length) * 100);

  const handleSelectOption = (idx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQ.id]: idx,
    });
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishDiagnostic();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const finishDiagnostic = () => {
    const topicScores: Record<string, { correct: number; total: number }> = {
      arrays: { correct: 0, total: 0 },
      strings: { correct: 0, total: 0 },
      searching: { correct: 0, total: 0 },
      hashing: { correct: 0, total: 0 },
    };

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      if (topicScores[q.topic]) {
        topicScores[q.topic].total += 1;
        if (selectedAnswers[q.id] === q.correctOptionIndex) {
          topicScores[q.topic].correct += 1;
        }
      }
    });

    const baselines: Record<TopicSlug, number> = {
      arrays: Math.round((topicScores.arrays.correct / Math.max(1, topicScores.arrays.total)) * 75 + 25),
      strings: Math.round((topicScores.strings.correct / Math.max(1, topicScores.strings.total)) * 70 + 20),
      searching: Math.round((topicScores.searching.correct / Math.max(1, topicScores.searching.total)) * 65 + 20),
      hashing: Math.round((topicScores.hashing.correct / Math.max(1, topicScores.hashing.total)) * 80 + 20),
      'two-pointers': 45,
      'linked-lists': 35,
      'stacks-queues': 40,
      trees: 25,
      graphs: 20,
      dp: 15,
    };

    setResultsSummary(baselines);
    completeDiagnostic(baselines);
    setMode('completed');
  };

  // ================= VIEW 1: INSTRUCTIONS =================
  if (mode === 'instructions') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative">
        <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900">Diagnostic Assessment</h1>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              12 Questions
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Find your current DSA level</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This test will take approximately 15 minutes and includes 12 questions across 4 core topics. The result will give you an initial estimate of your strengths and weaknesses.
            </p>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-3 py-2 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-bold text-slate-900">12</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Questions</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-bold text-slate-900">~15 min</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Duration</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                <span className="text-base font-bold text-slate-900">4 Topics</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Arrays, Strings, Search, Hash</p>
              </div>
            </div>

            {/* Topics Distribution (2x2 Grid) */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Topics Distribution</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Arrays', count: '3 questions', color: 'bg-amber-500' },
                  { name: 'Strings', count: '3 questions', color: 'bg-cyan-500' },
                  { name: 'Searching', count: '3 questions', color: 'bg-blue-500' },
                  { name: 'Hashing', count: '3 questions', color: 'bg-emerald-500' },
                ].map((t) => (
                  <div key={t.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{t.name}</p>
                      <p className="text-[10px] text-slate-500">{t.count}</p>
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${t.color}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <button
                onClick={() => setMode('test')}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Test</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900 font-medium text-xs block text-center transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW 3: COMPLETED REPORT =================
  if (mode === 'completed' && resultsSummary) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6">
        <div className="max-w-xl w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 text-center">
          <div className="h-16 w-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Diagnostic Results</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Your personalized baseline has been calculated. Your dashboard is now calibrated to your learning edge.
          </p>

          <div className="mt-8 space-y-3 text-left">
            {(Object.keys(resultsSummary) as TopicSlug[]).map((topic) => {
              const score = resultsSummary[topic];
              return (
                <div key={topic} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="w-28 font-bold text-slate-800 capitalize">{topic}</div>
                  <div className="flex-1 mx-4">
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <div className="font-extrabold text-slate-900 w-10 text-right">{score}%</div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Open Mastery Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= VIEW 2: QUESTION VIEW =================
  const selectedAnswer = selectedAnswers[currentQ.id];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative">
      {/* Top Header / Progress Bar */}
      <div className="max-w-2xl w-full mb-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900 text-sm">Diagnostic Assessment</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span>Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="max-w-2xl w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Main Question Card */}
      <div className="max-w-2xl w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative">
        {/* Badges & Timer Row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
              {currentQ.topicName}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {currentQ.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-mono bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            <Timer className="h-3.5 w-3.5 text-indigo-600" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          {currentQ.questionText}
        </h2>

        {/* Options (A, B, C, D) */}
        <div className="mt-8 space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const letter = String.fromCharCode(65 + idx);
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-sm'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`h-7 w-7 rounded-lg border flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-300 bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </div>
                  <span className="text-sm font-medium">{opt}</span>
                </div>
                {isSelected && <CheckCircle className="h-4 w-4 text-indigo-600" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentIndex === 0 ? 'opacity-30 text-slate-400 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedAnswer === undefined
                ? 'opacity-40 bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
            }`}
          >
            <span>{currentIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Screen 7: Resume Diagnostic Modal Demo trigger */}
      <button
        onClick={() => setShowResumeModal(true)}
        className="mt-6 text-[11px] text-slate-400 hover:text-slate-600 underline"
      >
        Simulate Resume Modal
      </button>

      {/* RESUME MODAL */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-sm w-full p-8 rounded-3xl shadow-2xl text-center">
            <div className="h-16 w-16 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Resume Your Diagnostic?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              We found an unfinished diagnostic session. Would you like to continue where you left off?
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Last saved: 2 minutes ago</p>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => setShowResumeModal(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20"
              >
                Resume Diagnostic
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSelectedAnswers({});
                  setShowResumeModal(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
              >
                Restart Diagnostic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
