import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { projects } from "../portfolio-data";

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description:
    "List public portfolio projects with title, description, tags, category, GitHub URL, and demo URL. Supports optional filtering by category, tag, featured-only, and a text search over title and description.",
  inputSchema: {
    category: z.string().optional().describe("Filter by category, e.g. 'AI / ML', 'Quantum Computing', 'Full Stack'."),
    tag: z.string().optional().describe("Filter to projects containing this tag (case-insensitive)."),
    featured: z.boolean().optional().describe("If true, return only featured projects."),
    search: z.string().optional().describe("Case-insensitive substring match against title and description."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, tag, featured, search }) => {
    const q = search?.toLowerCase();
    const tg = tag?.toLowerCase();
    const filtered = projects.filter((p) => {
      if (category && p.category !== category) return false;
      if (featured && !p.featured) return false;
      if (tg && !p.tags.some((t) => t.toLowerCase() === tg)) return false;
      if (q && !(p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))) return false;
      return true;
    });
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { count: filtered.length, projects: filtered },
    };
  },
});
