# 🧠 ChartMind AI

> **AI-powered data visualization** — chat naturally, get beautiful ECharts instantly.

ChartMind AI is a full-stack application that lets you describe any chart in plain English and receive a fully rendered, interactive visualization powered by **Google Gemini** and the **Flint MCP** (Model Context Protocol) server.

---

## ✨ Features

- 💬 **Conversational chart generation** — describe your chart in natural language
- 📊 **ECharts-powered visuals** — rich, interactive charts rendered in the browser
- ⚡ **Streaming-ready FastAPI backend** — async, production-grade Python API
- 🤖 **Strands Agents + Gemini** — agentic AI pipeline with tool-use via MCP
- 🔒 **Secure by default** — API keys stay server-side, CORS locked to your origins

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, ECharts 5 |
| **Backend** | FastAPI, Python 3.11+, Uvicorn |
| **AI Agent** | [Strands Agents](https://github.com/strands-agents/sdk-python) |
| **LLM** | Google Gemini (via `gemini-2.5-flash`) |
| **Chart Tool** | [Flint MCP Server](https://flint.data-formulator.ai) |

---

## 📁 Project Structure

```
chartmind-ai/
├── backend/
│   ├── main.py            # FastAPI app + Strands agent logic
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Environment variable template
│   └── .env               # Your local secrets (git-ignored)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   ├── main.jsx       # React entry point
│   │   └── components/    # Reusable UI components
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example       # Frontend env template
│   └── .env               # Your local frontend secrets (git-ignored)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.11 or higher
- **Node.js** 18 or higher
- A **Google Gemini API key** → [Get one here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/ai_data_analyzer.git
cd ai_data_analyzer
```

---

### 2. Backend Setup

```bash
cd backend

# Create & activate a virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Open .env and add your GEMINI_API_KEY
```

**`backend/.env` variables:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ | — | Your Google Gemini API key |
| `GEMINI_MODEL_ID` | ❌ | `gemini-2.5-flash` | Gemini model to use |
| `FLINT_MCP_URL` | ❌ | `https://flint.data-formulator.ai/mcp` | Flint MCP server URL |
| `ALLOWED_ORIGINS` | ❌ | `http://localhost:5173` | Comma-separated CORS origins |

Start the backend server:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `/docs` for the interactive Swagger UI.

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env if your backend runs on a different port
```

**`frontend/.env` variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## 🔌 API Reference

### `GET /`
Health check — returns server status.

```json
{ "status": "ChartMind AI is running 🚀" }
```

### `POST /chat`
Send a natural-language chart request.

**Request body:**
```json
{ "message": "Show me a bar chart of monthly sales: Jan 120, Feb 95, Mar 140" }
```

**Response:**
```json
{
  "reply": "Here is a bar chart showing your monthly sales.",
  "chart_config": { }
}
```

---

## 🧩 How It Works

```
User message
     │
     ▼
FastAPI /chat endpoint
     │
     ▼
Strands Agent  ──────►  Flint MCP Server (render_chart tool)
     │                        │
     │◄───────────────────────┘
     │   ECharts config JSON
     ▼
FastAPI response
     │
     ▼
React frontend renders interactive ECharts visualization
```

1. The user types a chart description in the React UI.
2. The frontend POSTs the message to `POST /chat`.
3. The **FastAPI** backend hands the message to a **Strands Agent** configured with the Gemini model.
4. The agent calls the **Flint MCP** `render_chart` tool to produce a valid ECharts config.
5. The JSON config is returned to the frontend, which renders an interactive chart via **ECharts**.

---

## 🛠️ Development

### Running Both Servers (concurrently)

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### Building for Production

```bash
# Frontend
cd frontend && npm run build

# Backend — use a production ASGI server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Strands Agents](https://github.com/strands-agents/sdk-python) — agentic AI SDK
- [Flint / Data Formulator](https://github.com/microsoft/data-formulator) — MCP chart rendering server
- [Apache ECharts](https://echarts.apache.org) — powerful, interactive charting library
- [Google Gemini](https://ai.google.dev) — large language model powering the agent
