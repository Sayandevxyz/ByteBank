'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  MessageSquare,
  X,
  Send,
  Maximize2,
  Minimize2,
  Navigation,
} from 'lucide-react';

const RobotMascotCanvas = dynamic(() => import('../canvas/RobotMascotCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-24 h-28 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-blue-600/30 animate-pulse" />
    </div>
  ),
});

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  credentials:
    "Test Accounts (password: password123):\n• Customer: rishi.sharma101@email.com (BB-ACC-5001)\n• Counterparty: rahul.verma102@email.com (BB-ACC-5002)\n• Admin: admin@bytebank.test\n• Auditor: auditor@bytebank.test",
  concurrency:
    "Concurrency Race Condition:\nIn /admin/lab, two parallel database connections attempt to transfer 0.8 BTC from a 1.0 BTC balance. PostgreSQL row-level locks (SELECT ... FOR UPDATE) serialize the requests. Thread 1 commits, Thread 2 aborts with Insufficient balance, leaving an exact 0.20000000 BTC final balance.",
  ledger:
    "Double-Entry Ledger Invariant:\nHolding = SUM(ledger_entry). Every debit has a corresponding credit. Database trigger trg_ledger_immutable() strictly prohibits UPDATE and DELETE statements on ledger rows.",
  risk:
    "Transaction Safety Preview:\nEvaluates versioned risk rules in assess_transfer_risk() (KYC verified, account active, sufficient available balance). On approval, PostgreSQL generates a 15-minute bound UUID authorization token.",
  idempotency:
    "Idempotent Transfers:\nEvery transfer requires an Idempotency-Key header scoped per customer with a SHA-256 parameter fingerprint. Replays return the cached result without double debits.",
};

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRoaming, setIsRoaming] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! You're through to ByteBank support. Ask anything and we'll reply right here.",
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply =
        "I can answer questions regarding ByteBank's DBMS architecture! You can ask about: 'credentials', 'concurrency race test', 'ledger invariant', 'risk preview', or 'idempotency'.";

      if (lower.includes('credential') || lower.includes('login') || lower.includes('password') || lower.includes('account')) {
        reply = KNOWLEDGE_BASE.credentials;
      } else if (lower.includes('concurrency') || lower.includes('race') || lower.includes('double spend') || lower.includes('lock')) {
        reply = KNOWLEDGE_BASE.concurrency;
      } else if (lower.includes('ledger') || lower.includes('reconcil') || lower.includes('formula') || lower.includes('drift')) {
        reply = KNOWLEDGE_BASE.ledger;
      } else if (lower.includes('risk') || lower.includes('preview') || lower.includes('safety') || lower.includes('screening')) {
        reply = KNOWLEDGE_BASE.risk;
      } else if (lower.includes('idempot') || lower.includes('retry') || lower.includes('fingerprint') || lower.includes('replay')) {
        reply = KNOWLEDGE_BASE.idempotency;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  const roamingOffset = isRoaming ? Math.sin(scrollY * 0.003) * 18 : 0;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end transition-transform duration-500"
      style={{
        transform: `translateY(${roamingOffset}px)`,
      }}
    >
      {isOpen && (
        <div
          className={`mb-4 rounded-2xl bg-[#0c101a] border border-[#182030] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${isExpanded ? 'h-[580px] w-[460px]' : 'h-[490px] w-88 sm:w-96'
            }`}
        >
          <div className="px-4 py-3.5 bg-[#0e1422] border-b border-[#182030] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#162138] border border-blue-500/40 p-1 flex items-center justify-center shrink-0 shadow-glow-blue">
                <Image
                  src="/bytebank-icon.svg"
                  alt="ByteBank Support"
                  width={24}
                  height={24}
                  className="w-5 h-5 rounded-full"
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  ByteBank Support
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  We usually reply within a few hours
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsRoaming(!isRoaming)}
                className={`p-1.5 rounded-lg hover:bg-[#182030] transition-colors ${isRoaming ? 'text-blue-400' : 'text-slate-500'}`}
                title={isRoaming ? 'Roaming Active' : 'Pinned'}
              >
                <Navigation className={`w-3.5 h-3.5 ${isRoaming ? 'rotate-45 text-blue-400' : ''}`} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg hover:bg-[#182030] hover:text-white transition-colors"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#182030] hover:text-white transition-colors"
                title="Close Support"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${m.sender === 'user'
                      ? 'bg-blue-600 text-white font-medium rounded-br-none'
                      : 'bg-[#121929] text-slate-200 border border-[#1d273d] rounded-bl-none shadow'
                    }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#121929] text-slate-400 text-xs w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 bg-[#090d16] border-t border-[#182030] flex gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
            <button
              onClick={() => handleSend('Test credentials')}
              className="px-2.5 py-1 rounded-full bg-[#111c33] hover:bg-[#182747] border border-[#1b2b4d] text-blue-400 shrink-0 transition-colors"
            >
              Credentials
            </button>
            <button
              onClick={() => handleSend('Concurrency race test')}
              className="px-2.5 py-1 rounded-full bg-[#111c33] hover:bg-[#182747] border border-[#1b2b4d] text-blue-400 shrink-0 transition-colors"
            >
              Concurrency Lab
            </button>
            <button
              onClick={() => handleSend('Ledger invariant formula')}
              className="px-2.5 py-1 rounded-full bg-[#111c33] hover:bg-[#182747] border border-[#1b2b4d] text-blue-400 shrink-0 transition-colors"
            >
              Ledger Invariant
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#0c101a] border-t border-[#182030] flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 bg-[#06080e] border border-[#182030] rounded-xl px-3 py-2">
              <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you need..."
                className="w-full bg-transparent border-0 text-white placeholder-slate-500 text-xs focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-glow-blue shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3">
        {!isOpen && (
          <div className="px-3 py-1.5 rounded-xl bg-[#0c101a] border border-[#182030] shadow-lg text-xs font-mono text-slate-300 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ByteBank Support</span>
          </div>
        )}

        <div className="relative group">
          <RobotMascotCanvas onClick={() => setIsOpen(!isOpen)} isDancing={true} />
          <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
          <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
        </div>
      </div>
    </div>
  );
}
