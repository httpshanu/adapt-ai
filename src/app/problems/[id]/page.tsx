'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Compass, 
  FileCode, 
  Lightbulb, 
  Play, 
  RotateCcw, 
  Send, 
  Sparkles, 
  XCircle 
} from 'lucide-react';
import { INITIAL_PROBLEMS } from '../../../lib/problemsData';
import { executePythonCode, RunResult } from '../../../lib/pythonRunner';
import { useApp } from '../../../context/AppContext';
import { QuestionBankRepository } from '../../../lib/questionBankRepository';
import { Hint, Problem, Recommendation } from '../../../types';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  getProblemStarterCode 
} from '../../../lib/starterCodes';
import { evaluateMultiLanguageProblem } from '../../../lib/codeSandboxRunner';

export default function ProblemWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params?.id as string;
  const { evaluateSolution, recordSubmission, submissions } = useApp();

  const problem: Problem | undefined = 
    QuestionBankRepository.getByIdOrSlug(problemId) ||
    INITIAL_PROBLEMS.find((p) => p.id === problemId || p.slug === problemId);

  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'problem' | 'submissions' | 'hints' | 'ai'>('problem');
  const [isRunningSamples, setIsRunningSamples] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [revealedHintTiers, setRevealedHintTiers] = useState<number[]>([]);
  const [secondsSpent, setSecondsSpent] = useState<number>(0);

  // Gemini AI Tutor state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string>('Google Gemini 2.5 Flash');
  const [aiCustomQuestion, setAiCustomQuestion] = useState('');

  // Timer for time spent tracking (anti-cheat verification)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsSpent((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [problemId]);

  // Screen 10 Modal state
  const [showAcceptedModal, setShowAcceptedModal] = useState<{
    show: boolean;
    result: RunResult;
    nextRec: Recommendation;
  } | null>(null);

  useEffect(() => {
    if (problem) {
      setCode(getProblemStarterCode(problem.slug, selectedLanguage, problem.starterCode));
      setRunResult(null);
      setRevealedHintTiers([]);
      setShowAcceptedModal(null);
    }
  }, [problemId, selectedLanguage]);

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguage(newLang);
    if (problem) {
      setCode(getProblemStarterCode(problem.slug, newLang, problem.starterCode));
      setRunResult(null);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Problem not found</h2>
          <Link href="/catalog" className="mt-4 inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            Return to Problem Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleRevealHint = (tier: number) => {
    if (!revealedHintTiers.includes(tier)) {
      setRevealedHintTiers([...revealedHintTiers, tier]);
    }
  };

  const triggerGeminiAI = async (
    mode: 'hint' | 'explain' | 'debug' | 'chat',
    customPrompt?: string
  ) => {
    setActiveTab('ai');
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          problemTitle: problem.title,
          problemTopic: problem.topicName,
          problemDifficulty: problem.difficulty,
          problemDescription: problem.descriptionMarkdown,
          userCode: code,
          language: selectedLanguage,
          errorMessage: runResult?.errorMessage || (runResult?.verdict !== 'ACCEPTED' ? `Verdict: ${runResult?.verdict}` : ''),
          userPrompt: customPrompt,
        }),
      });

      const data = await res.json();
      if (data?.data?.content) {
        setAiResponse(data.data.content);
        if (data.data.modelUsed) setAiModelUsed(data.data.modelUsed);
      } else {
        setAiResponse('Unable to retrieve AI response. Please try again.');
      }
    } catch (err: any) {
      setAiResponse(`Error contacting AI Tutor: ${err?.message || 'Network error'}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRunSamples = async () => {
    setIsRunningSamples(true);
    try {
      const res = await evaluateMultiLanguageProblem(code, selectedLanguage, problem, true);
      setRunResult(res);
    } finally {
      setIsRunningSamples(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Execute through server-side queue with anti-cheat & hidden test cases
      const { result, nextRec } = await evaluateSolution(
        problem,
        code,
        selectedLanguage,
        revealedHintTiers.length,
        secondsSpent
      );

      const mappedRunResult: RunResult = {
        verdict: result.verdict,
        passedTests: result.passedTests,
        totalTests: result.totalTests,
        runtimeMs: result.runtimeMs,
        memoryMb: result.memoryMb,
        stdout: result.sampleResults?.[0]?.stdout || '',
        errorMessage: result.error || (result.verdict !== 'ACCEPTED' ? `Evaluation: Passed ${result.passedTests} of ${result.totalTests} tests` : undefined),
        testDetails: (result.sampleResults || []).map((sr, idx) => ({
          testCaseId: `sample_${idx + 1}`,
          input: sr.input,
          expected: sr.expectedOutput,
          actual: sr.actualOutput,
          passed: sr.passed,
          isSample: true,
        })),
      };

      setRunResult(mappedRunResult);

      if (result.verdict === 'ACCEPTED') {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });

        // Open Screen 10 Modal
        setShowAcceptedModal({
          show: true,
          result: mappedRunResult,
          nextRec,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const problemSubmissions = submissions.filter((s) => s.problemId === problem.id);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Top Header matching Screen 9 */}
      <div className="h-16 px-6 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-slate-300">|</span>
          <h1 className="text-lg font-bold text-slate-900">{problem.title}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 capitalize">
              {problem.topicName}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              {problem.difficulty}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{problem.estimatedMinutes} min</span>
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Python 3.11 Environment
        </div>
      </div>

      {/* Split Layout: Left Problem Pane & Right Editor Pane */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT PANE (Problem, Submissions, Hints) */}
        <div className="w-full md:w-1/2 h-full border-r border-slate-200/80 flex flex-col bg-white overflow-hidden">
          {/* Tabs header matching Screen 9 */}
          <div className="flex items-center gap-6 px-6 h-12 border-b border-slate-100 shrink-0 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('problem')}
              className={`h-full border-b-2 transition-all ${
                activeTab === 'problem' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Problem
            </button>
            <button
              onClick={() => setActiveTab('submissions')}
              className={`h-full border-b-2 transition-all ${
                activeTab === 'submissions' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Submissions ({problemSubmissions.length})
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`h-full border-b-2 transition-all ${
                activeTab === 'hints' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Hints ({revealedHintTiers.length}/3)
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`h-full border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'ai' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>AI Tutor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-mono">Gemini</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed">
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <p className="whitespace-pre-line text-slate-600">{problem.descriptionMarkdown}</p>
                </div>

                {/* Constraints box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Constraints</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 font-mono">
                    {problem.constraints.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-3">
                {problemSubmissions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No submissions yet for this problem.</p>
                ) : (
                  problemSubmissions.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs flex items-center justify-between">
                      <div>
                        <span className={`font-bold ${sub.verdict === 'ACCEPTED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {sub.verdict}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">Passed {sub.passedTests}/{sub.totalTests} tests</p>
                      </div>
                      <span className="text-slate-400 text-[11px]">{sub.createdAt}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                {problem.hints.map((hint: Hint) => {
                  const isRevealed = revealedHintTiers.includes(hint.tier);
                  return (
                    <div key={hint.tier} className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">Hint {hint.tier}: {hint.title}</span>
                        {!isRevealed ? (
                          <button
                            onClick={() => handleRevealHint(hint.tier)}
                            className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          >
                            Reveal
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold uppercase">Revealed</span>
                        )}
                      </div>
                      {isRevealed && (
                        <p className="text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-200">
                          {hint.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-5">
                {/* AI Tutor Header Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-white border border-indigo-100/80 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
                    <h3 className="text-xs font-bold text-slate-900 tracking-tight">CodeAdapt AI DSA Mentor</h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    Powered by Google Gemini. Ask graduated questions, debug failures, or explore Big-O time and space trade-offs without spoiling solutions.
                  </p>
                </div>

                {/* Quick Action Shortcuts */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Instant AI Assistance
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => triggerGeminiAI('hint')}
                      disabled={aiLoading}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white transition-all text-xs font-semibold text-slate-700 flex flex-col gap-1 shadow-sm"
                    >
                      <span className="text-base">💡</span>
                      <span className="text-slate-900">Graduated Hint</span>
                      <span className="text-[10px] text-slate-400 font-normal">Next step without spoilers</span>
                    </button>

                    <button
                      onClick={() => triggerGeminiAI('explain')}
                      disabled={aiLoading}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white transition-all text-xs font-semibold text-slate-700 flex flex-col gap-1 shadow-sm"
                    >
                      <span className="text-base">⚡</span>
                      <span className="text-slate-900">Optimal Big-O</span>
                      <span className="text-[10px] text-slate-400 font-normal">Time & space complexity</span>
                    </button>

                    <button
                      onClick={() => triggerGeminiAI('debug')}
                      disabled={aiLoading}
                      className="p-3 text-left rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 bg-white transition-all text-xs font-semibold text-slate-700 flex flex-col gap-1 shadow-sm"
                    >
                      <span className="text-base">🐞</span>
                      <span className="text-slate-900">Debug Code</span>
                      <span className="text-[10px] text-slate-400 font-normal">Spot logic bugs & errors</span>
                    </button>
                  </div>
                </div>

                {/* Custom Question Input */}
                <div className="pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Ask Gemini anything about this problem..."
                      value={aiCustomQuestion}
                      onChange={(e) => setAiCustomQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && aiCustomQuestion.trim() && !aiLoading) {
                          triggerGeminiAI('chat', aiCustomQuestion);
                          setAiCustomQuestion('');
                        }
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white shadow-sm"
                    />
                    <button
                      onClick={() => {
                        if (aiCustomQuestion.trim() && !aiLoading) {
                          triggerGeminiAI('chat', aiCustomQuestion);
                          setAiCustomQuestion('');
                        }
                      }}
                      disabled={aiLoading || !aiCustomQuestion.trim()}
                      className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1"
                    >
                      <span>Ask</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* AI Loading State */}
                {aiLoading && (
                  <div className="p-6 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-indigo-600 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-semibold text-indigo-900">Gemini AI is analyzing your code & problem structure...</p>
                    <p className="text-[11px] text-indigo-600/70 mt-1">Applying algorithmic proof and time complexity checks</p>
                  </div>
                )}

                {/* AI Response Display */}
                {!aiLoading && aiResponse && (
                  <div className="p-5 rounded-2xl bg-white text-slate-800 border border-indigo-100 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-[11px]">
                      <span className="font-semibold text-indigo-600 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {aiModelUsed}
                      </span>
                      <button
                        onClick={() => setAiResponse(null)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">
                      {aiResponse}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE (Light Code Editor) */}
        <div className="w-full md:w-1/2 h-full flex flex-col bg-slate-50 border-l border-slate-200 overflow-hidden">
          {/* Editor Header Bar with Language Switcher */}
          <div className="h-11 px-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-lg border border-slate-300/60">
              {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                const config = SUPPORTED_LANGUAGES[langKey];
                const isSelected = selectedLanguage === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => handleLanguageChange(langKey)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {config.name}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                {SUPPORTED_LANGUAGES[selectedLanguage].version}
              </span>
              <button
                onClick={() => setCode(getProblemStarterCode(problem.slug, selectedLanguage, problem.starterCode))}
                className="hover:text-slate-900 flex items-center gap-1 transition-colors text-slate-500"
                title="Reset starter template"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0 relative bg-white">
            <Editor
              height="100%"
              language={SUPPORTED_LANGUAGES[selectedLanguage].monacoLang}
              theme="vs"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                tabSize: 4,
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          {/* Quick Output Console (Above bottom action bar) */}
          {runResult && (
            <div className="h-44 bg-slate-900 border-t border-slate-700 p-4 text-xs font-mono text-slate-200 overflow-y-auto shrink-0 transition-all">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 mb-2">
                <span className={`font-bold ${runResult.verdict === 'ACCEPTED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ● {runResult.verdict}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    {runResult.runtimeMs}ms • Passed {runResult.passedTests}/{runResult.totalTests} ({selectedLanguage.toUpperCase()})
                  </span>
                  <button
                    onClick={() => setRunResult(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Close console"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {runResult.stdout && <p className="text-[11px] text-slate-300 mb-1">{runResult.stdout}</p>}
              {runResult.errorMessage && (
                <pre className="text-[11px] text-rose-300 bg-rose-950/50 p-2 rounded border border-rose-800 whitespace-pre-wrap mt-1">
                  {runResult.errorMessage}
                </pre>
              )}
            </div>
          )}

          {/* Bottom Action Bar (Fixed to bottom) */}
          <div className="h-16 px-6 bg-slate-100/90 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            <button
              onClick={handleRunSamples}
              disabled={isRunningSamples || isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{isRunningSamples ? 'Running...' : 'Run Samples'}</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isRunningSamples}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SCREEN 10: SUBMISSION RESULT MODAL */}
      {showAcceptedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center">
            {/* Big Green Checkmark Icon */}
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Accepted!</h3>
            <p className="text-sm text-slate-500 mt-1">Your solution passed all test cases.</p>

            {/* Metrics: Runtime & Memory matching Screen 10 */}
            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400">Runtime</span>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{showAcceptedModal.result.runtimeMs} ms</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400">Memory</span>
                <p className="text-lg font-extrabold text-slate-900 mt-0.5">{showAcceptedModal.result.memoryMb} MB</p>
              </div>
            </div>

            <button
              onClick={() => setShowAcceptedModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-200 mb-6"
            >
              View Details
            </button>

            {/* Next Recommended Problem Box matching Screen 10 */}
            <div className="text-left pt-4 border-t border-slate-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Recommended Problem</span>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{showAcceptedModal.nextRec.problem.title}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold capitalize">
                      {showAcceptedModal.nextRec.problem.topicName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold">
                      {showAcceptedModal.nextRec.problem.difficulty}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowAcceptedModal(null);
                    router.push(`/problems/${showAcceptedModal.nextRec.problem.id}`);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-200 flex items-center gap-1"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
