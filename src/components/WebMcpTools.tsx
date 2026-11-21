"use client";

import { useEffect } from "react";

type ModelContext = {
  registerTool: (tool: unknown, options?: { signal?: AbortSignal }) => Promise<void> | void;
};

// Exposes read-only site tools to in-browser AI agents (WebMCP).
// Each tool calls the same public endpoint the site's own data comes from.
export default function WebMcpTools() {
  useEffect(() => {
    const mc =
      (document as unknown as { modelContext?: ModelContext }).modelContext ??
      (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    if (!mc?.registerTool) return;
    const controller = new AbortController();
    const asText = (data: unknown) => ({
      content: [{ type: "text", text: JSON.stringify(data) }],
    });
    const tools = [
      {
        name: "search_tutorials",
        title: "Search tutorials",
        description:
          "Search Ahmad YT Tutorial's AI video tutorials by keyword and/or category. Returns titles, URLs and slugs.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Keywords to search" },
            category: { type: "string", description: "Category name (optional)" },
          },
        },
        annotations: { readOnlyHint: true },
        async execute({ query = "", category = "" }: { query?: string; category?: string }) {
          const r = await fetch(
            `/api/tutorials?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`
          );
          return asText(await r.json());
        },
      },
      {
        name: "get_tutorial_prompts",
        title: "Get tutorial prompts",
        description: "Get the full AI prompts, tools and FAQs of one tutorial by slug.",
        inputSchema: {
          type: "object",
          properties: { slug: { type: "string", description: "Tutorial slug" } },
          required: ["slug"],
        },
        annotations: { readOnlyHint: true },
        async execute({ slug }: { slug: string }) {
          const r = await fetch(`/api/tutorials?slug=${encodeURIComponent(slug)}`);
          return asText(await r.json());
        },
      },
    ];
    for (const tool of tools) {
      try {
        Promise.resolve(mc.registerTool(tool, { signal: controller.signal })).catch(() => {});
      } catch {
        // Unsupported or already registered — ignore.
      }
    }
    return () => controller.abort();
  }, []);

  return null;
}
