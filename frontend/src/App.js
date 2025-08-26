import React, {
  useState,
  useRef,
  useEffect,
} from "react"
import axios from "axios"
import "./App.css"

export default function App() {
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  const suggestions = [
    "✨ Write me a poem",
    "📊 Explain AI in simple words",
    "💡 Give me a startup idea",
    "🍽️ Suggest a healthy meal plan",
    "🧠 Help me with Java interview questions",
    "📚 Summarize a book for me",
  ]

  const sendMessage = async () => {
    if (!message) return
    const newChat = [
      ...chat,
      { sender: "You", text: message },
    ]
    setChat(newChat)
    setMessage("")
    setLoading(true)
    try {
      const res = await axios.post(
        "http://localhost:5000/chat",
        { message }
      )
      const reply =
        res.data.reply ||
        res.data.error ||
        "No reply"
      setChat([
        ...newChat,
        { sender: "Nova Bot", text: reply },
      ])
    } catch (err) {
      setChat([
        ...newChat,
        {
          sender: "Nova Bot",
          text: "Error: " + (err.message || err),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    })
  }, [chat])

  return (
    <div className="app-container">
      {/* Navbar */}
      <div className="navbar">
        <h2>🌌 Nova Bot</h2>
      </div>

      <div className="main">
        {/* Sidebar */}
        <div className="sidebar">
          <h3>💬 Try Asking</h3>
          <ul>
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => setMessage(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Section */}
        <div className="chat-container">
          <div className="chat-box">
            {chat.length === 0 && (
              <p className="placeholder">
                Start the conversation...
              </p>
            )}
            {chat.map((m, i) => (
              <div
                key={i}
                className={`message ${
                  m.sender === "You"
                    ? "user"
                    : "bot"
                }`}
              >
                <div className="sender">
                  {m.sender}
                </div>
                <div className="text">
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input */}
          <div className="input-area">
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  sendMessage()
              }}
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} Ankit
        Nimbolkar | Powered by Nova Bot 🚀
      </footer>
    </div>
  )
}
