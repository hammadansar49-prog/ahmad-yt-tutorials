import { NextResponse } from "next/server";
import { searchTutorials, getTutorial, listArticles, getArticle } from "@/lib/agent-content";
import { MCP_SERVER_INFO, MCP_PROTOCOL_VERSION } from "@/lib/mcp-card";

// Minimal stateless MCP server (Streamable HTTP, JSON responses only).
// Every tool is read-only and returns the same public data as the site.

const TOOLS = [
  {
    name: "search_tutorials",
    title: "Search tutorials",
    description: "Search Ahmad YT Tutorial's AI video tutorials by keyword (title, description, tools) and/or category. Returns titles, URLs and slugs.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, e.g. 'penguin' or 'Google Flow'" },
        category: { type: "string", description: "Exact category name (optional)" },
        limit: { type: "number", description: "Max results (1-100, default 20)" },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_tutorial",
    title: "Get tutorial prompts",
    description: "Get a tutorial's full AI prompts, tools used, YouTube link and FAQs by its slug.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "Tutorial slug from search_tutorials" } },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "list_articles",
    title: "List articles",
    description: "List all guide articles about AI video prompts and growing a YouTube channel.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "get_article",
    title: "Get article",
    description: "Get the full text of one article by slug.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
    },
    annotations: { readOnlyHint: true },
  },
];

type Rpc = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version",
};

function text(data: unknown) {
  return { content: [{ type: "text", text: typeof data === "string" ? data : JSON.stringify(data, null, 2) }] };
}

async function callTool(name: string, args: Record<string, unknown>) {
  const s = (k: string) => (typeof args[k] === "string" ? (args[k] as string) : "");
  switch (name) {
    case "search_tutorials":
      return text(await searchTutorials(s("query"), s("category"), Number(args.limit) || 20));
    case "get_tutorial": {
      const t = await getTutorial(s("slug"));
      return t ? text(t) : { ...text(`No tutorial with slug "${s("slug")}"`), isError: true };
    }
    case "list_articles":
      return text(listArticles());
    case "get_article": {
      const a = getArticle(s("slug"));
      return a ? text(a) : { ...text(`No article with slug "${s("slug")}"`), isError: true };
    }
    default:
      return null;
  }
}

async function handle(msg: Rpc) {
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id: msg.id ?? null, result });
  const err = (code: number, message: string) => ({ jsonrpc: "2.0", id: msg.id ?? null, error: { code, message } });
  switch (msg.method) {
    case "initialize":
      return ok({
        protocolVersion: MCP_PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: MCP_SERVER_INFO,
        instructions: "Read-only tools for Ahmad YT Tutorial's AI video tutorials, prompts and articles.",
      });
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: TOOLS });
    case "tools/call": {
      const p = msg.params ?? {};
      const result = await callTool(String(p.name ?? ""), (p.arguments as Record<string, unknown>) ?? {});
      return result ? ok(result) : err(-32602, `Unknown tool: ${String(p.name)}`);
    }
    default:
      return msg.id === undefined ? null : err(-32601, `Method not found: ${msg.method}`);
  }
}

export async function POST(request: Request) {
  let body: Rpc | Rpc[];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, { status: 400, headers: CORS });
  }
  const list = Array.isArray(body) ? body : [body];
  const replies = (await Promise.all(list.map(handle))).filter(Boolean);
  if (replies.length === 0) return new Response(null, { status: 202, headers: CORS });
  return NextResponse.json(Array.isArray(body) ? replies : replies[0], { headers: CORS });
}

export function GET() {
  // No server-initiated stream in this stateless server.
  return new Response("Method Not Allowed", { status: 405, headers: { ...CORS, Allow: "POST, OPTIONS" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
