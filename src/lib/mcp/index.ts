import { defineMcp } from "@lovable.dev/mcp-js";
import getProfile from "./tools/get-profile";
import listSocialLinks from "./tools/list-social-links";
import listProjects from "./tools/list-projects";
import listExperience from "./tools/list-experience";
import listSkills from "./tools/list-skills";
import listServices from "./tools/list-services";

export default defineMcp({
  name: "tejas-portfolio-mcp",
  title: "Tejas Portfolio MCP",
  version: "0.1.0",
  instructions:
    "Public tools for exploring Mellimpudi Tejas's portfolio: profile, social/contact links, projects (with filters), work and education experience, skill groups, and offered services. All data is intentionally public — the same information shown on the portfolio site.",
  tools: [getProfile, listSocialLinks, listProjects, listExperience, listSkills, listServices],
});
