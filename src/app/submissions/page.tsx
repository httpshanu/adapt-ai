'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, FileCode, XCircle } from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';

export default function SubmissionsPage() {
  const { submissions } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR'>('ALL');

  // Realistic mock data seeded if submissions list is small
  const defaultSubmissions = [
    { id: '1', problem: 'Binary Search Basics', problemId: 'p_binary_search', result: 'ACCEPTED', lang: 'Python', time: '2m ago' },
    { id: '2', problem: 'Two Sum', problemId: 'p_two_sum', result: 'WRONG_ANSWER', lang: 'Python', time: '12m ago' },
    { id: '3', problem: 'Valid Palindrome', problemId: 'p_valid_palindrome', result: 'ACCEPTED', lang: 'Python', time: '1h ago' },
    { id: '4', problem: 'Find Maximum in Array', problemId: 'p_max_element', result: 'ACCEPTED', lang: 'Python', time: '2h ago' },
    { id: '5', problem: 'Group Anagrams', problemId: 'p_group_anagrams', result: 'ACCEPTED', lang: 'Python', time: '3h ago' },
    { id: '6', problem: 'Search in Rotated Sorted Array', problemId: 'p_search_rotated', result: 'ACCEPTED', lang: 'Python', time: '5h ago' },
  ];

  const allDisplay = submissions.length > 0
    ? submissions.map((s, idx) => ({
        id: s.id || String(idx),
        problem: s.problemTitle,
        problemId: s.problemId,
        result: s.verdict,
        lang: 'Python',
        time: s.createdAt,
      }))
    : defaultSubmissions;

  const filtered = allDisplay.filter((s) => {
    if (filter === 'ALL') return true;
    return s.result === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Sidebar matching Screen 11 */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 sm:p-10 max-w-6xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
          My Submissions
        </h1>

        {/* Filter Pills matching Screen 11 */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'ACCEPTED', label: 'Accepted' },
            { id: 'WRONG_ANSWER', label: 'Wrong Answer' },
            { id: 'RUNTIME_ERROR', label: 'Runtime Error' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === pill.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Submissions Table matching Screen 11 */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50/70 text-xs font-semibold text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-4 px-6">Problem</th>
                <th className="py-4 px-6">Result</th>
                <th className="py-4 px-6">Language</th>
                <th className="py-4 px-6 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <Link href={`/problems/${item.problemId}`} className="hover:text-indigo-600">
                      {item.problem}
                    </Link>
                  </td>

                  <td className="py-4 px-6">
                    {item.result === 'ACCEPTED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Accepted</span>
                      </span>
                    ) : item.result === 'WRONG_ANSWER' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Wrong Answer</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        <span>Runtime Error</span>
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                    {item.lang}
                  </td>

                  <td className="py-4 px-6 text-xs text-slate-400 text-right">
                    {item.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
