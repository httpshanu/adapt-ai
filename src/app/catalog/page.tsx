'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Search, 
  Sparkles, 
  Wand2 
} from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { QuestionBankRepository } from '../../lib/questionBankRepository';
import { useApp } from '../../context/AppContext';
import { DifficultyLevel, Problem, TopicSlug } from '../../types';

export default function ProblemCatalogPage() {
  const { solvedProblemIds, submissions } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'CORE' | 'DYNAMIC'>('ALL');
  const [activePill, setActivePill] = useState<'ALL' | 'UNSEEN' | 'ATTEMPTED' | 'SOLVED' | 'REVISION'>('ALL');

  const allProblems = QuestionBankRepository.getAllPublished();
  const solvedSet = new Set(solvedProblemIds);
  const attemptedSet = new Set(submissions.map((s) => s.problemId));

  const filtered = allProblems.filter((prob) => {
    if (searchQuery && !prob.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTopic !== 'ALL' && prob.topic !== selectedTopic) {
      return false;
    }
    if (selectedDifficulty !== 'ALL' && prob.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedType === 'CORE' && prob.provenance !== 'MANUAL') {
      return false;
    }
    if (selectedType === 'DYNAMIC' && prob.provenance === 'MANUAL') {
      return false;
    }
    const isSolved = solvedSet.has(prob.id);
    const isAttempted = attemptedSet.has(prob.id) && !isSolved;
    if (activePill === 'SOLVED' && !isSolved) return false;
    if (activePill === 'ATTEMPTED' && !isAttempted) return false;
    if (activePill === 'UNSEEN' && (isSolved || attemptedSet.has(prob.id))) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 sm:p-10 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Problem Catalog
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Curated and dynamically validated Python algorithmic problems.
            </p>
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> of {allProblems.length} available problems
          </div>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex items-center gap-2.5">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Topics</option>
              <option value="arrays">Arrays</option>
              <option value="strings">Strings</option>
              <option value="searching">Searching</option>
              <option value="hashing">Hashing</option>
              <option value="two-pointers">Two Pointers</option>
              <option value="linked-lists">Linked Lists</option>
              <option value="stacks-queues">Stacks & Queues</option>
              <option value="trees">Trees & BST</option>
              <option value="graphs">Graphs</option>
              <option value="dp">Dynamic Programming</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Question Types</option>
              <option value="CORE">Core Verified</option>
              <option value="DYNAMIC">Dynamic Validated</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'UNSEEN', label: 'Unseen' },
            { id: 'ATTEMPTED', label: 'Attempted' },
            { id: 'SOLVED', label: 'Solved' },
            { id: 'REVISION', label: 'Needs Revision' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActivePill(pill.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                activePill === pill.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Problem Card Rows */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-sm">
              No problems match your filters. Try selecting a different topic or difficulty.
            </div>
          ) : (
            filtered.map((prob) => {
              const isSolved = solvedSet.has(prob.id);
              const isAttempted = attemptedSet.has(prob.id) && !isSolved;

              return (
                <div
                  key={prob.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">
                        <Link href={`/problems/${prob.id}`} className="hover:text-indigo-600">
                          {prob.title}
                        </Link>
                      </h3>

                      {prob.provenance === 'PARAMETERIZED_VARIATION' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1">
                          <Wand2 className="h-3 w-3" />
                          Variation
                        </span>
                      )}
                      {prob.provenance === 'LLM_GENERATED' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Generated
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {prob.topicName}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {prob.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{prob.estimatedMinutes} min</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badges */}
                    {isSolved ? (
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Solved
                      </span>
                    ) : isAttempted ? (
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        Attempted
                      </span>
                    ) : (
                      <span className="px-3.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-400 border border-slate-100">
                        Unseen
                      </span>
                    )}

                    <Link
                      href={`/problems/${prob.id}`}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
