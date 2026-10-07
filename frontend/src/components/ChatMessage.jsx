import ChartRenderer from './ChartRenderer'
import './ChatMessage.css'

function BotIcon() {
  return (
    <svg className="bot-icon" viewBox="0 0 24 24" fill="none">
      <path d="M12 2a2 2 0 0 1 2 2v1h3a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3V4a2 2 0 0 1 2-2Z"
        fill="url(#bg)" />
      <circle cx="9"  cy="11" r="1.2" fill="#fff" opacity=".9" />
      <circle cx="15" cy="11" r="1.2" fill="#fff" opacity=".9" />
      <path d="M9 15.5q3 2 6 0" stroke="#fff" strokeWidth="1.2"
        strokeLinecap="round" opacity=".9" />
      <defs>
        <linearGradient id="bg" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className={`msg-row ${isUser ? 'msg-row--user' : 'msg-row--bot'}`}>

      {/* Bot avatar */}
      {!isUser && (
        <div className="avatar avatar--bot">
          <BotIcon />
        </div>
      )}

      {/* Bubble */}
      <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--bot'}`}>
        {message.text && (
          <p className="bubble-text">{message.text}</p>
        )}
        {message.chart_config && (
          <ChartRenderer config={message.chart_config} />
        )}
        <span className="bubble-time">{time}</span>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="avatar avatar--user">You</div>
      )}
    </div>
  )
}
