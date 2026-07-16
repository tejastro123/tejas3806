import { defineTool } from "@lovable.dev/mcp-js";
import { socialLinks } from "../portfolio-data";

export default defineTool({
  name: "list_social_links",
  title: "List social links",
  description:
    "Return the portfolio owner's public social and contact links (GitHub, LinkedIn, X/Twitter, Instagram, email).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(socialLinks, null, 2) }],
    structuredContent: { links: socialLinks },
  }),
});
