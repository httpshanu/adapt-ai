'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Check, 
  Code2, 
  Copy, 
  Flame, 
  Hash, 
  Headphones, 
  HelpCircle, 
  MessageSquare, 
  Pause, 
  Play, 
  RotateCcw, 
  Send, 
  Sparkles, 
  Users 
} from 'lucide-react';
import { CHAT_CHANNELS } from '../../lib/communityData';

export default function LoungePage() {
  const { currentAccount, channelMessages, sendChatMessage, toggleReaction } = useApp();
  const [activeChannelId, setActiveChannelId] = useState<string>('general');
  const [inputText, setInputText] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'cpp' | 'java'>('python');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Pomodoro Focus Timer State (for study room)
  const [pomoSeconds, setPomoSeconds] = useState(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = CHAT_CHANNELS.find((c) => c.id === activeChannelId) || CHAT_CHANNELS[0];
  const currentMessages = channelMessages[activeChannelId] || [];

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeChannelId]);

  // Pomodoro timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomoRunning) {
      interval = setInterval(() => {
        setPomoSeconds((prev) => {
          if (prev <= 1) {
            setIsPomoRunning(false);
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPomoRunning]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !codeSnippet.trim()) return;

    sendChatMessage(
      activeChannelId,
      inputText.trim() || 'Shared a code snippet:',
      codeSnippet.trim() ? { language: codeLanguage, code: codeSnippet.trim() } : undefined
    );

    setInputText('');
    setCodeSnippet('');
    setIsCodeModalOpen(false);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const formatPomoTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-100">
      <AppSidebar />

      {/* Main Lounge Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Discord Server Top Header */}
        <header className="h-14 px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeChannel.icon}</span>
              <span className="font-bold text-slate-100 text-sm">{activeChannel.name}</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-md">
              {activeChannel.description}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-400">48 Online</span>
          </div>
        </header>

        {/* Discord Two-Column Body: Channels & Chat */}
        <div className="flex-1 flex overflow-hidden">
          {/* Discord Channel Sidebar */}
          <div className="w-60 bg-slate-900 border-r border-slate-800/80 flex flex-col shrink-0">
            {/* Server Branding */}
            <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  &lt;&gt;
                </div>
                <span className="font-bold text-xs text-slate-200">CodeAdapt Hub</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                PRO
              </span>
            </div>

            {/* Channels List */}
            <div className="p-3 space-y-1 flex-1 overflow-y-auto">
              <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
                Text Channels
              </div>
              {CHAT_CHANNELS.map((ch) => {
                const isActive = ch.id === activeChannelId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{ch.icon}</span>
                    <span className="truncate">#{ch.name}</span>
                  </button>
                );
              })}
            </div>

            {/* User Presence Card at Bottom */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    {currentAccount.name.charAt(0)}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[80px]">
                      {currentAccount.name.split(' ')[0]}
                    </span>
                    <span className="font-mono text-[9px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1 py-0.2 rounded">
                      #{currentAccount.uid}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">{currentAccount.league}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Stream */}
          <div className="flex-1 flex flex-col bg-[#0b1120] overflow-hidden">
            {/* If Study Room, show Pomodoro Widget at Top */}
            {activeChannelId === 'study-room' && (
              <div className="m-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                    <Headphones className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">Deep Focus Lo-Fi Pomodoro</h3>
                    <p className="text-xs text-slate-400">25 min focus sprints • No distractions</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="font-mono text-3xl font-black text-indigo-400 tracking-wider">
                    {formatPomoTime(pomoSeconds)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPomoRunning(!isPomoRunning)}
                      className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {isPomoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{isPomoRunning ? 'Pause' : 'Start Focus'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsPomoRunning(false);
                        setPomoSeconds(25 * 60);
                      }}
                      className="h-10 w-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                      title="Reset Timer"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {currentMessages.map((msg) => {
                const isCurrent = msg.author.id === currentAccount.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 p-3 rounded-2xl transition-colors ${
                      isCurrent ? 'bg-indigo-950/20 border border-indigo-900/30' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Author Avatar */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        msg.author.isBot
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {msg.author.isBot ? '🤖' : msg.author.name.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-200">{msg.author.name}</span>
                        {msg.author.badge && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                              msg.author.isBot
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {msg.author.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-300 leading-relaxed break-words">{msg.content}</p>

                      {/* Code Snippet if attached */}
                      {msg.codeSnippet && (
                        <div className="mt-2.5 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                          <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold uppercase">{msg.codeSnippet.language}</span>
                            <button
                              onClick={() => handleCopyCode(msg.id, msg.codeSnippet!.code)}
                              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                            >
                              {copiedSnippetId === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 overflow-x-auto text-indigo-300 font-mono">
                            {msg.codeSnippet.code}
                          </pre>
                        </div>
                      )}

                      {/* Reactions Row */}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {['🔥', '🚀', '💡', '💯', '👏'].map((emoji) => {
                          const count = msg.reactions[emoji] || 0;
                          return (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction(activeChannelId, msg.id, emoji)}
                              className={`text-xs px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                                count > 0
                                  ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                                  : 'bg-transparent border-transparent hover:border-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="font-bold text-[10px]">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-500 font-semibold shrink-0">Quick Ask:</span>
              <button
                onClick={() => setInputText('@CodeAdaptBot give me a hint for Two Sum')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium shrink-0 transition-colors"
              >
                💡 Hint for Two Sum
              </button>
              <button
                onClick={() => setInputText('@CodeAdaptBot how does binary search avoid overflow?')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium shrink-0 transition-colors"
              >
                🔍 Binary Search Mid Formula
              </button>
              <button
                onClick={() => setInputText('@CodeAdaptBot explain Dynamic Programming memoization')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium shrink-0 transition-colors"
              >
                🧠 DP Intuition
              </button>
            </div>

            {/* Message Input Box */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
              {isCodeModalOpen && (
                <div className="mb-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Attach Code Snippet</span>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value as any)}
                      className="bg-slate-800 text-slate-200 border border-slate-700 px-2 py-0.5 rounded-lg text-xs"
                    >
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  <textarea
                    rows={4}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="Paste your code solution here..."
                    className="w-full bg-slate-900 rounded-xl p-2.5 font-mono text-xs text-slate-200 border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(!isCodeModalOpen)}
                  className={`h-11 w-11 rounded-2xl border flex items-center justify-center transition-all ${
                    isCodeModalOpen
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Attach Code Block"
                >
                  <Code2 className="h-5 w-5" />
                </button>

                <input
                  type="text"
                  placeholder={`Message #${activeChannel.name}... (tag @CodeAdaptBot for instant hints)`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-11 px-4 rounded-2xl bg-slate-800 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !codeSnippet.trim()}
                  className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-indigo-950"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
