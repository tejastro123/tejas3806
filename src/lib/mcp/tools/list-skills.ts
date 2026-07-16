import { defineTool } from "@lovable.dev/mcp-js";
import { skillGroups } from "../portfolio-data";

export default defineTool({
  name: "list_skills",
  title: "List skills",
  description:
    "Return the portfolio owner's public technical skill groups, each with a set of named skills and self-rated proficiency levels (0–100).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(skillGroups, null, 2) }],
    structuredContent: { groups: skillGroups },
  }),
});
