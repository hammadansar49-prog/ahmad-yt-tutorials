import { SITE_URL, SITE_NAME } from "@/lib/site";

export const MCP_SERVER_INFO = { name: "ahmad-yt-tutorial", version: "1.0.0" };
export const MCP_PROTOCOL_VERSION = "2025-06-18";

export const serverCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
  name: MCP_SERVER_INFO.name,
  title: `${SITE_NAME} MCP`,
  version: MCP_SERVER_INFO.version,
  description:
    "Read-only access to Ahmad YT Tutorial: search AI video tutorials, get the full AI prompts and FAQs for a tutorial, and read articles.",
  websiteUrl: SITE_URL,
  protocolVersion: MCP_PROTOCOL_VERSION,
  endpoint: `${SITE_URL}/api/mcp`,
  remotes: [{ type: "streamable-http", url: `${SITE_URL}/api/mcp` }],
  transport: { type: "streamable-http", url: `${SITE_URL}/api/mcp` },
  authentication: { required: false },
  capabilities: { tools: { listChanged: false } },
  tools: [
    { name: "search_tutorials", description: "Search AI video tutorials by keyword and/or category." },
    { name: "get_tutorial", description: "Get one tutorial's AI prompts, tools and FAQs by slug." },
    { name: "list_articles", description: "List all guide articles." },
    { name: "get_article", description: "Get the full text of one article by slug." },
  ],
};
