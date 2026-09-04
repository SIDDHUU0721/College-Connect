import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  Clock,
  RotateCcw
} from 'lucide-react';

const PROMPT_SUGGESTIONS = [
  "What assignments are due this week?",
  "When is my NLP exam?",
  "Show NLP Unit 2 notes",
  "What changed in the timetable?",
  "Show AI hackathon experiences",
  "What did I miss?"
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am your **CollegeConnect AI Assistant**. I have complete indexed access to all faculty announcements, assignment deadlines, exam schedules, solved PYQs, and Experience Hub articles. How can I help you today?",
      suggestedChips: PROMPT_SUGGESTIONS
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/nlp/assistant/chat', { message: textToSend });
      if (res.success) {
        const botMessage = {
          role: 'assistant',
          content: res.answer,
          category: res.category,
          actionCards: res.actionCards || [],
          suggestedChips: res.suggestedQueries || []
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Apologies, I encountered an issue: ${err.message}. Please try asking again.` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">AI College Assistant</h1>
              <span className="px-2 py-0.5 text-[9px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected to Campus DB
              </span>
            </div>
            <p className="text-xs text-slate-400">Grounding across all official schedules, study materials & experiences</p>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ role: 'assistant', content: "Chat reset. How can I assist you with your academics?", suggestedChips: PROMPT_SUGGESTIONS }])}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs flex items-center gap-1"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {/* Action Cards if attached */}
              {msg.actionCards?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-1">
                  {msg.actionCards.map((card, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => navigate(card.link)}
                      className="p-3 rounded-xl bg-slate-800 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between group transition-all"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-indigo-300">{card.title}</p>
                        <p className="text-[10px] text-slate-400">{card.subtitle}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              )}

              {/* Prompt Suggestion Chips */}
              {msg.suggestedChips?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestedChips.map((chip, chipIdx) => (
                    <button
                      key={chipIdx}
                      onClick={() => handleSend(chip)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-500/20 hover:text-indigo-300 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-indigo-400 animate-pulse py-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>AI Assistant retrieving campus database...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything: 'When is my NLP exam?', 'Show DBMS assignment', 'What did I miss?'..."
          className="flex-1 px-4 py-2.5 bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder-slate-500"
        />
        <Button
          variant="primary"
          icon={Send}
          loading={loading}
          onClick={() => handleSend()}
        >
          Ask
        </Button>
      </div>

    </div>
  );
}
