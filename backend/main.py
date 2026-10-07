import asyncio
import json
import os
import re
from typing import Any

from dotenv import load_dotenv

load_dotenv()  # reads backend/.env automatically

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from strands import Agent
from strands.models.gemini import GeminiModel
from strands.tools.mcp import MCPClient
from mcp.client.streamable_http import streamable_http_client

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(title="ChartMind AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # set via ALLOWED_ORIGINS in .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Config from .env ──────────────────────────────────────────────────────────
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY",  "")
FLINT_MCP_URL   = os.getenv("FLINT_MCP_URL",   "https://flint.data-formulator.ai/mcp")
GEMINI_MODEL_ID = os.getenv("GEMINI_MODEL_ID", "gemini-2.5-flash")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

model = GeminiModel(
    client_args={"api_key": GEMINI_API_KEY},
    model_id=GEMINI_MODEL_ID,
    params={
        "temperature": 0.7,
        "max_output_tokens": 10000,
        "top_p": 0.9,
        "top_k": 40,
    },
)

# ── Schemas ────────────────────────────────────────────────────────────────────
class ChartOutput(BaseModel):
    reply: str
    chart_config: dict[str, Any] | None = None

class ChatRequest(BaseModel):
    message: str

# ── Agent runner ───────────────────────────────────────────────────────────────
_JSON_PROMPT = (
    "Use the Flint render_chart tool with the ECharts backend. "
    "After calling the tool, respond with ONLY a single valid JSON object "
    "(no markdown fences, no extra text) in exactly this shape:\n"
    '{"reply": "<one-sentence explanation>", "chart_config": <full ECharts option object>}'
)

def _parse_response(text: str) -> ChartOutput:
    """Parse the agent text into a ChartOutput. Falls back gracefully."""
    # Strip markdown code fences if the model added them
    clean = re.sub(r'^```(?:json)?\s*', '', text.strip(), flags=re.IGNORECASE)
    clean = re.sub(r'\s*```$', '', clean)

    try:
        data = json.loads(clean)
        return ChartOutput(
            reply=data.get("reply", ""),
            chart_config=data.get("chart_config"),
        )
    except (json.JSONDecodeError, ValueError):
        # Model didn't return JSON — surface the raw reply without a chart
        return ChartOutput(reply=text.strip(), chart_config=None)


def run_agent(message: str) -> ChartOutput:
    flint_mcp = MCPClient(lambda: streamable_http_client(FLINT_MCP_URL))
    with flint_mcp:
        all_tools = flint_mcp.list_tools_sync()
        tools = [t for t in all_tools if t.tool_name == "render_chart"]

        agent   = Agent(model=model, tools=tools)
        # Regular agent() call — works correctly with sync thread + MCP tools
        response = agent(f"{message}\n\n{_JSON_PROMPT}")

    return _parse_response(str(response))


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {"status": "ChartMind AI is running 🚀"}


@app.post("/chat")
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        result = await asyncio.to_thread(run_agent, request.message)
        return {"reply": result.reply, "chart_config": result.chart_config}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


