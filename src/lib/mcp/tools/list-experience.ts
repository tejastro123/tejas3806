import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { experience } from "../portfolio-data";

export default defineTool({
  name: "list_experience",
  title: "List experience",
  description:
    "List the portfolio owner's work, research, academic, and education experience entries. Optionally filter by type.",
  inputSchema: {
    type: z
      .enum(["work", "research", "academic", "education"])
      .optional()
      .describe("Filter to a single experience type."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ type }) => {
    const filtered = type ? experience.filter((e) => e.type === type) : experience;
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { count: filtered.length, experience: filtered },
    };
  },
});
