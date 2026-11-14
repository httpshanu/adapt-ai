'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Check, Plus, ShieldCheck, Sparkles, User, Users, X, Zap } from 'lucide-react';
import { LEAGUE_TIER_CONFIG } from '../lib/gamificationEngine';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { id: 'sanidhya', name: 'Master Coder', emoji: '🧑‍💻', bg: 'bg-indigo-600' },
  { id: 'aarav', name: 'Algorithm Wizard', emoji: '🧙‍♂️', bg: 'bg-emerald-600' },
  { id: 'priya', name: 'Frontend Prodigy', emoji: '👩‍💻', bg: 'bg-pink-600' },
  { id: 'dev_pro', name: 'Cyber Ninja', emoji: '🥷', bg: 'bg-purple-600' },
  { id: 'rohan', name: 'Speed Hacker', emoji: '⚡', bg: 'bg-amber-600' },
  { id: 'ananya', name: 'Data Scientist', emoji: '🔬', bg: 'bg-cyan-600' },
];

export default function AccountSwitcherModal({ isOpen, onClose }: AccountSwitcherModalProps) {
  const { accounts, currentAccount, switchAccount, createAccount } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('sanidhya');
  const [selectedRole, setSelectedRole] = useState<'student' | 'competitive' | 'mentor'>('student');

  if (!isOpen) return null;

  const handleSelectAccount = (id: string) => {
    switchAccount(id);
    onClose();
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createAccount(newName.trim(), newEmail.trim(), selectedAvatar, selectedRole);
    setIsCreating(false);
    setNewName('');
    setNewEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Multi-Account Switcher</h3>
              <p className="text-xs text-slate-500">Test different skill levels & learner profiles instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {!isCreating ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Account ({accounts.length})
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {accounts.map((acc) => {
                  const isCurrent = acc.id === currentAccount.id;
                  const tier = LEAGUE_TIER_CONFIG[acc.league];
                  const avatarObj = PRESET_AVATARS.find((a) => a.id === acc.avatar) || PRESET_AVATARS[0];

                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleSelectAccount(acc.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`h-11 w-11 rounded-2xl ${avatarObj.bg} flex items-center justify-center text-xl text-white shadow-sm`}
                        >
                          {avatarObj.emoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900">{acc.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tier.badgeColor}`}
                            >
                              {tier.icon} {acc.league}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              Lvl {acc.level} • {acc.xp} XP
                            </span>
                            <span className="text-xs text-amber-600 font-semibold flex items-center gap-0.5">
                              🔥 {acc.streak}d
                            </span>
                          </div>
                        </div>
                      </div>

                      {isCurrent && (
                        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add Account CTA */}
              <button
                onClick={() => setIsCreating(true)}
                className="w-full mt-2 py-3 px-4 rounded-2xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 text-indigo-600 hover:bg-indigo-50/50 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Student Profile</span>
              </button>
            </div>
          ) : (
            /* Create Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">New Student Profile</span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Back to List
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Student Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Kapoor"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="meera@student.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              {/* Pick Avatar */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Choose Avatar</label>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all ${
                        selectedAvatar === av.id
                          ? `${av.bg} text-white ring-2 ring-indigo-500 scale-105 shadow-md`
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title={av.name}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Track / Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Learning Focus</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'competitive', 'mentor'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        selectedRole === r
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100"
                >
                  Create & Switch
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
