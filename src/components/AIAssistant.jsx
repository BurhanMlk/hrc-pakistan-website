import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Mic, MicOff } from 'lucide-react';
import { publicApi } from '../services/publicApi.js';

const DISCLAIMER =
  'General informational guidance only – not a substitute for professional legal advice.';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am the HRC-Pakistan assistant. I can help you navigate this website, learn about human rights, and guide you on reporting concerns, membership, volunteering, events and publications. How can I help?',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const result = await publicApi.askAssistant(next, language);
      setMessages((m) => [...m, { role: 'assistant', content: result.message }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, the assistant is temporarily unavailable. Please use the Contact page.' }]);
    } finally {
      setSending(false);
    }
  };

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Voice input is not supported in this browser. You can type your question instead.' }]);
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = new SR();
    rec.lang = language === 'ur' ? 'ur-PK' : 'en-US';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      send(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900 text-white shadow-card transition hover:bg-navy-800"
        aria-label="Open AI assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed bottom-5 left-5 z-50 flex h-[34rem] max-h-[80vh] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card"
          role="dialog"
          aria-label="AI human rights assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <img src="/HRCP LOGO.png" alt="HRC-Pakistan logo" className="h-9 w-9 rounded bg-white object-contain p-0.5" />
              <div>
                <p className="text-sm font-bold">HRC-Pakistan Assistant</p>
                <p className="text-[10px] text-navy-300">Informational guidance only</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLanguage('en')}
                className={`rounded px-2 py-1 text-xs font-semibold ${language === 'en' ? 'bg-accent-500 text-white' : 'bg-navy-800 text-navy-200'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`rounded px-2 py-1 text-xs font-semibold ${language === 'ur' ? 'bg-accent-500 text-white' : 'bg-navy-800 text-navy-200'}`}
              >
                اردو
              </button>
              <button onClick={() => setOpen(false)} className="ml-1 rounded p-1 hover:bg-navy-800" aria-label="Close assistant">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                    m.role === 'user' ? 'bg-navy-900 text-white' : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && <div className="text-xs text-gray-400">Thinking…</div>}
            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <p className="border-t border-gray-200 bg-amber-50 px-3 py-2 text-[10px] leading-snug text-amber-800">
            {DISCLAIMER} For urgent matters or emergencies, contact local authorities immediately.
          </p>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-200 p-3">
            <button
              onClick={toggleVoice}
              className={`rounded-md p-2 ${listening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label="Voice input"
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={language === 'ur' ? 'اپنا سوال لکھیں…' : 'Type your question…'}
              className="input flex-1"
              aria-label="Message"
            />
            <button onClick={() => send()} disabled={sending} className="btn-primary !px-3" aria-label="Send">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
