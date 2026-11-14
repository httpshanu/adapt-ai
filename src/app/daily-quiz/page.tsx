'use client';

import React, { useEffect, useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import { 
  AlertCircle, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  HelpCircle, 
  RefreshCw, 
  Sparkles, 
  Timer, 
  Trophy, 
  XCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getTodayQuizQuestions } from '../../lib/dailyQuizData';
import Link from 'next/link';

export default function DailyQuizPage() {
  const { currentAccount, dailyQuizResult, completeDailyQuiz } = useApp();
  const [questions, setQuestions] = useState(getTodayQuizQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);

  // If already taken today
  useEffect(() => {
    if (dailyQuizResult) {
      setQuizFinished(true);
    }
  }, [dailyQuizResult]);

  // Question Timer
  useEffect(() => {
    if (!isTimerActive || isAnswerSubmitted || quizFinished) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, isAnswerSubmitted, quizFinished, currentIndex]);

  const handleAutoTimeout = () => {
    setIsAnswerSubmitted(true);
  };

  const currentQ = questions[currentIndex];
  const isSelected = selectedAnswers[currentIndex] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleConfirmAnswer = () => {
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setTimerSeconds(60);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizFinished(true);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    let xpEarned = correctCount * 30;
    if (correctCount === questions.length) {
      xpEarned += 50; // Perfect score bonus
    }

    completeDailyQuiz(correctCount, questions.length, xpEarned);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Daily DSA Blitz
              </span>
              <span className="text-xs text-slate-500 font-medium">3 Questions • Instant XP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Daily Code Quiz Challenge
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Sharp DSA questions every day. Keep your streak alive and earn XP towards the leaderboard!
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500 fill-amber-500 animate-bounce" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Active Streak</span>
                <span className="text-sm font-extrabold text-slate-900">{currentAccount.streak} Days 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {!quizFinished ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            {/* Progress & Timer Bar */}
            <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {currentQ.topic}
                </span>
              </div>

              {/* Timer Countdown */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timerSeconds <= 15
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                    : 'bg-slate-50 text-slate-700 border border-slate-200'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>{timerSeconds}s remaining</span>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">
              {currentQ.question}
            </h2>

            {/* Optional Code Snippet */}
            {currentQ.codeSnippet && (
              <div className="mb-6 rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <div className="text-[10px] text-slate-400 uppercase font-sans font-bold mb-2">
                  Code Snippet ({currentQ.language || 'code'})
                </div>
                <pre>{currentQ.codeSnippet}</pre>
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const isChosen = selectedAnswers[currentIndex] === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let optionStyle =
                  'border-slate-200 bg-white hover:border-indigo-400 hover:bg-slate-50 text-slate-800';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                  } else if (isChosen && !isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                  } else {
                    optionStyle = 'border-slate-200 opacity-60 text-slate-400';
                  }
                } else if (isChosen) {
                  optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold ring-2 ring-indigo-500';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-lg bg-slate-100 font-mono font-bold text-xs flex items-center justify-center text-slate-600 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isChosen && !isCorrect && (
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card (Visible after submit) */}
            {isAnswerSubmitted && (
              <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 leading-relaxed animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                  <HelpCircle className="h-4 w-4 text-indigo-600" />
                  <span>Explanation:</span>
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-medium">
                Reward: <span className="font-bold text-indigo-600">+{currentQ.xpReward} XP</span>
              </span>

              {!isAnswerSubmitted ? (
                <button
                  disabled={!isSelected}
                  onClick={handleConfirmAnswer}
                  className={`py-2.5 px-6 rounded-xl font-bold text-sm shadow-sm transition-all ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz 🎉'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Quiz Summary Card */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 text-center max-w-lg mx-auto">
            <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border-2 border-amber-300 text-amber-500 flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">
              🏆
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Daily Blitz Completed!</h2>
            <p className="text-sm text-slate-500 mb-6">
              You showed up today and kept your DSA streak burning bright.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Score</span>
                <span className="text-2xl font-black text-indigo-600">
                  {dailyQuizResult?.score || 3} / {questions.length}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Questions Correct</span>
              </div>
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-bold text-amber-600 block uppercase">XP Gained</span>
                <span className="text-2xl font-black text-amber-600">
                  +{dailyQuizResult?.xpEarned || 110} XP
                </span>
                <span className="text-[10px] text-amber-700 block mt-0.5">Added to Leaderboard</span>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 flex items-center justify-center gap-2">
              <Flame className="h-4 w-4 text-emerald-600 fill-emerald-600" />
              <span>Daily Streak Extended to {currentAccount.streak} Days!</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/leaderboard"
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 transition-all text-center"
              >
                Check Leaderboard Rank
              </Link>
              <Link
                href="/catalog"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all text-center"
              >
                Practice Problems
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
