import './TypingIndicator.css'

export default function TypingIndicator() {
  return (
    <div className="typing-row">
      <div className="typing-avatar">
        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
          <path d="M12 2a2 2 0 0 1 2 2v1h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3V4a2 2 0 0 1 2-2Z"
            fill="url(#tg)" />
          <circle cx="9"  cy="11" r="1.2" fill="#fff" opacity=".9" />
          <circle cx="15" cy="11" r="1.2" fill="#fff" opacity=".9" />
          <defs>
            <linearGradient id="tg" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" /><stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="typing-bubble">
        <div className="typing-dots">
          <span /><span /><span />
        </div>
        <span className="typing-label">ChartMind is thinking…</span>
      </div>
    </div>
  )
}
