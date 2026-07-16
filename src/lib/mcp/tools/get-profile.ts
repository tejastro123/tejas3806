import { defineTool } from "@lovable.dev/mcp-js";
import { personalInfo } from "../portfolio-data";

export default defineTool({
  name: "get_profile",
  title: "Get profile",
  description:
    "Return the portfolio owner's public profile: name, role, location, tagline, short bio, long bio, email, website, and avatar URL.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(personalInfo, null, 2) }],
    structuredContent: personalInfo,
  }),
});
