import { defineTool } from "@lovable.dev/mcp-js";
import { services } from "../portfolio-data";

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "Return the services the portfolio owner offers, each with a title and short description.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
