import { useState, useRef, useEffect, useCallback } from 'react'
import ChatMessage from './components/ChatMessage'
import TypingIndicator from './components/TypingIndicator'
import './App.css'

const WELCOME = {
  id: 0,
  role: 'assistant',
  text: "👋 Hello! I'm ChartMind AI — your data visualization assistant powered by Flint & Gemini.\n\nAsk me to create any chart. Examples:\n• \"Bar chart of top 5 countries by population, Economist theme\"\n• \"Line chart of monthly revenue Jan–Dec 2024\"\n• \"Pie chart: smartphone market share 2024\"",
  chart_config: null,
  timestamp: new Date(),
}

const SUGGESTIONS = [
  '📊 Bar chart: Top 5 countries by GDP, Economist theme',
  '📈 Line chart: Monthly sales Jan–Dec 2024',
  '🥧 Pie chart: Smartphone market share 2024',
  '📉 Bar chart: Programming language popularity 2025',
]

const API = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/chat`

export default function App() {
  const [messages, setMessages]   = useState([WELCOME])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const bottomRef                 = useRef(null)
  const textareaRef               = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 130) + 'px'
  }, [input])

  const sendMessage = useCallback(async (text) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    setInput('')
    setMessages(prev => [...prev, {
      id: Date.now(), role: 'user', text: msg,
      chart_config: null, timestamp: new Date(),
    }])
    setLoading(true)

    try {
      const res  = await fetch(API, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail ?? 'Server error')

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply ?? '',
        chart_config: data.chart_config ?? null,
        timestamp: new Date(),
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: `⚠️ Error: ${err.message}. Make sure the backend is running on port 8000.`,
        chart_config: null,
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const showSuggestions = messages.length === 1 && !loading

  return (
    <div className="app">

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <div className="logo-icon">
            <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
              <rect width="28" height="28" rx="8" fill="url(#lg)" />
              <path d="M8 20 L14 8 L20 20" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="14" cy="8" r="2" fill="#fff" />
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1"/><stop offset="1" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <h1 className="header-title">ChartMind AI</h1>
            <p className="header-sub">Flint · ECharts · Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="header-badge">
          <span className="pulse-dot" />
          Live
        </div>
      </header>

      {/* ── Chat area ── */}
      <main className="chat-area">
        <div className="messages-list">
          {messages.map(m => <ChatMessage key={m.id} message={m} />)}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Quick-start suggestions */}
        {showSuggestions && (
          <div className="suggestions">
            <p className="suggestions-label">Try asking…</p>
            <div className="suggestions-grid">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => sendMessage(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Input area ── */}
      <footer className="footer">
        <div className="input-shell">
          <textarea
            ref={textareaRef}
            className="input-box"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me to create a chart…  e.g. 'Bar chart of top 5 countries by population, Economist theme'"
            rows={1}
            disabled={loading}
          />
          <button
            id="send-btn"
            className={`send-btn${loading || !input.trim() ? ' send-btn--off' : ''}`}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            {loading
              ? <span className="loader" />
              : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="17" height="17">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )
            }
          </button>
        </div>
        <p className="footer-hint">Enter to send · Shift+Enter for new line</p>
      </footer>
    </div>
  )
}
