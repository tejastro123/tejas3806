import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDB } from "../../shared/db";
import { vectorStore } from "../../shared/vectorStore";
import { getEmbedding, generateText } from "./gemini";
import { requireAdmin } from "../../shared/middleware/auth";
import { traceMiddleware } from "../../shared/middleware/trace";
import { bootstrapObservability } from "../../shared/observability";

// Models
import { PersonalInfo } from "../../shared/models/PersonalInfo";
import { About } from "../../shared/models/About";
import { Experience } from "../../shared/models/Experience";
import { Project } from "../../shared/models/Project";
import { Skill } from "../../shared/models/Skill";

dotenv.config();

const app = express();
const PORT = 5004;

app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Apply global request-scoped tracing middleware
app.use(traceMiddleware);

// Bootstrap Observability health check and system performance metrics
bootstrapObservability(app, "AI Service");

// Connect DB and trigger ingestion
connectDB("AI-Service").then(() => {
  // Wait a small bit to ensure collections are ready/seeded
  setTimeout(ingestPortfolioContext, 5000);
});

async function ingestPortfolioContext() {
  try {
    console.log("[AI Service] Ingesting portfolio data into local vector store...");
    await vectorStore.clear();

    // 1. Personal Info
    const info = await PersonalInfo.findOne();
    if (info) {
      const text = `Name: ${info.name}\nRole: ${info.role}\nLocation: ${info.location}\nBio Tagline: ${info.bio_tagline}\nShort Bio: ${info.bio_short}\nDetailed Biography: ${info.bio_long}`;
      const emb = await getEmbedding(text);
      await vectorStore.addDocument("personal_info", text, emb, { type: "personal", title: "Personal Info" });
    }

    // 2. About
    const about = await About.findOne();
    if (about) {
      const text = `About Tejas:\nHeading: ${about.heading}\nContent: ${about.content}\nFun Facts:\n${about.fun_facts.map(f => `- ${f.text}`).join("\n")}`;
      const emb = await getEmbedding(text);
      await vectorStore.addDocument("about", text, emb, { type: "about", title: "About Me" });
    }

    // 3. Experience
    const experiences = await Experience.find();
    for (const exp of experiences) {
      const text = `Experience [${exp.type}]:\nTitle: ${exp.title}\nOrganization: ${exp.org}\nDate: ${exp.date}\nLocation: ${exp.location}\nDescription: ${exp.description}\nSkills Used: ${exp.skills.join(", ")}`;
      const emb = await getEmbedding(text);
      await vectorStore.addDocument(`exp_${exp._id}`, text, emb, { type: "experience", title: exp.title });
    }

    // 4. Projects
    const projects = await Project.find();
    for (const proj of projects) {
      const text = `Project:\nTitle: ${proj.title}\nDescription: ${proj.description}\nCategory: ${proj.category}\nTags/Technologies: ${proj.tags.join(", ")}`;
      const emb = await getEmbedding(text);
      await vectorStore.addDocument(`proj_${proj._id}`, text, emb, { type: "project", title: proj.title });
    }

    // 5. Skills
    const skills = await Skill.find();
    for (const skill of skills) {
      const text = `Skill Category: ${skill.title}\nSkills:\n${skill.items.map(s => `- ${s.name} (Proficiency: ${s.level}%)`).join("\n")}`;
      const emb = await getEmbedding(text);
      await vectorStore.addDocument(`skill_${skill._id}`, text, emb, { type: "skills", title: skill.title });
    }

    const isEmpty = await vectorStore.isEmpty();
    console.log(`[AI Service] Ingestion complete. Vector store now contains ${isEmpty ? 0 : 5} main vectors.`);
  } catch (err) {
    console.error("[AI Service] Ingestion failed:", err);
  }
}

// Re-index endpoint
app.post("/api/ai/reindex", requireAdmin, async (req, res) => {
  await ingestPortfolioContext();
  return res.json({ success: true, message: "Re-indexing complete." });
});

// Chat endpoint (RAG query)
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    console.log(`[AI Chat] Query received: "${message}"`);
    const queryEmb = await getEmbedding(message);
    const searchResults = await vectorStore.similaritySearch(queryEmb, 3);

    const contextText = searchResults.map((r) => `[Source: ${r.doc.metadata.title || r.doc.id}] (Similarity: ${Math.round(r.score * 100)}%)\n${r.doc.text}`).join("\n\n");

    const systemInstruction = `You are Mellimpudi Tejas's AI portfolio copilot.
Use the following context from Tejas's portfolio (education, experiences, skills, and projects) to answer the visitor's questions.
Answer professional queries warmly, concisely, and with precise technical details.
If the answer cannot be inferred from the context, answer based on general knowledge but clarify that it is not explicitly listed in Tejas's core portfolio.

Context:
${contextText}

Remember to speak of Tejas in the third person ("Tejas is...", "He designed...").`;

    const responseText = await generateText(message, systemInstruction);
    const sources = searchResults.map(r => ({
      id: r.doc.id,
      title: r.doc.metadata.title || r.doc.id,
      score: r.score
    }));

    return res.json({ response: responseText, sources });
  } catch (error) {
    console.error(`[AI Chat Error]`, error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Resume gap analyzer
app.post("/api/ai/resume-analyze", async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    console.log(`[AI Resume Analyzer] Analyzing resume...`);
    
    // Construct portfolio summary
    const info = await PersonalInfo.findOne();
    const skills = await Skill.find();
    const projects = await Project.find();
    
    const skillsSummary = skills.map(g => `${g.title}: ${g.items.map(i => i.name).join(", ")}`).join("\n");
    const projectsSummary = projects.map(p => `- ${p.title}: ${p.description}`).join("\n");
    
    const tejasContext = `
Role: ${info?.role || "AIMLDS Engineer & Physicist"}
Skills:
${skillsSummary}
Projects:
${projectsSummary}
`;

    const prompt = `Analyze this candidate's Resume against Mellimpudi Tejas's professional profile (which represents the benchmark role).
Generate an ATS match score (0-100), identify specific key technical skills present/missing, strengths, and actionable recommendations.

Resume Text:
"${resumeText}"

Benchmark Portfolio:
${tejasContext}

Return the response STRICTLY as a valid JSON object matching this structure:
{
  "score": 85,
  "gaps": ["Kubernetes", "Next.js"],
  "strengths": ["Strong C++ foundations", "Quantum simulation experience"],
  "recommendations": ["Add project documentation links", "Highlight hardware-software integration examples"]
}`;

    const rawResponse = await generateText(prompt);
    
    // Extract JSON in case LLM wraps it in markdown blocks
    let cleaned = rawResponse.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      const parsedAnalysis = JSON.parse(cleaned);
      return res.json(parsedAnalysis);
    } catch (parseError) {
      console.warn("[AI Resume Analyzer] Could not parse LLM output as JSON. Output:", rawResponse);
      return res.json({
        score: 70,
        gaps: ["Detailed ATS gap mapping failed. Check raw output."],
        strengths: ["Resume parsed successfully."],
        recommendations: ["Ensure resume is formatted in clear headings."],
        rawText: rawResponse
      });
    }
  } catch (error) {
    console.error("[AI Resume Analyzer Error]", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Blog Generator
app.post("/api/ai/blog-generate", requireAdmin, async (req, res) => {
  try {
    const { title, prompt } = req.body;
    if (!title || !prompt) {
      return res.status(400).json({ error: "Title and prompt guidelines are required." });
    }

    console.log(`[AI Blog Generator] Generating post on: "${title}"`);

    const systemInstruction = `You are a world-class software engineer and technical writer.
Create a comprehensive, engaging blog article formatted in clean markdown.
Include an introductory hook, structured sections with subheadings, code snippets or pseudo-code where appropriate, and a summary.`;

    const fullPrompt = `Write a deep-dive technical blog post titled "${title}".
Follow these guidelines/topic details: ${prompt}`;

    const blogContent = await generateText(fullPrompt, systemInstruction);

    // Compute excerpt and read time
    const excerpt = blogContent.split("\n").filter(line => line.trim().length > 0).slice(0, 2).join(" ")
      .substring(0, 150) + "...";
    const wordCount = blogContent.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return res.json({
      title,
      slug,
      content: blogContent,
      excerpt,
      readTime,
    });
  } catch (error) {
    console.error("[AI Blog Generator Error]", error);
    return res.status(500).json({ error: (error as Error).message });
  }
});

// Multi-Agent System Core Helpers
async function getContext(query: string): Promise<string> {
  try {
    const queryEmb = await getEmbedding(query);
    const searchResults = await vectorStore.similaritySearch(queryEmb, 3);
    return searchResults.map((r) => r.doc.text).join("\n\n");
  } catch {
    return "";
  }
}

async function runCareerAgent(query: string): Promise<string> {
  const context = await getContext(query);
  const systemInstruction = `You are Mellimpudi Tejas's Career Consultant Agent.
Persona: Highly professional, recruiter-focused, and persuasive. Highlight Tejas's suitability for software, full-stack development, and AI/ML engineering roles. Show why he is a top candidate.
Context:
${context}
Speak of Tejas in the third person. Keep responses structured and highlight career wins.`;
  return await generateText(query, systemInstruction);
}

async function runResearchAgent(query: string): Promise<string> {
  const context = await getContext(query);
  const systemInstruction = `You are Mellimpudi Tejas's Scientific Research Agent.
Persona: Highly analytical, academic, detailed, and physics-oriented. Address quantum gate simulations, physics algorithms, calculations, and mathematical proofs.
Context:
${context}
Speak of Tejas in the third person. Keep responses detailed and scientific.`;
  return await generateText(query, systemInstruction);
}

async function runCodingAgent(query: string): Promise<string> {
  const context = await getContext(query);
  const systemInstruction = `You are Mellimpudi Tejas's Codebase Architect Agent.
Persona: Structured, geeky, and highly technical. Focus on database schemas, REST APIs, clean coding practices, and distributed systems.
Context:
${context}
Speak of Tejas in the third person. Provide technical architecture details or pseudocode.`;
  return await generateText(query, systemInstruction);
}

async function runCollaboration(query: string) {
  console.log(`[AI Orchestrator] Executing specialized agent collaboration debate for query: "${query}"`);
  
  // Step 1: Research Agent analyzes first
  const researchOutput = await runResearchAgent(`Perform a deep scientific/research analysis for: ${query}`);
  
  // Step 2: Coding Agent reviews research analysis and specifies engineering implementation
  const codingPrompt = `Original Query: ${query}\nScientific/Research Input: ${researchOutput}\nTranslate this into system design, software engineering stack, or database schemas.`;
  const codingOutput = await runCodingAgent(codingPrompt);

  // Step 3: Career Agent reviews both aspects to synthesize business/hiring value
  const careerPrompt = `Original Query: ${query}\nScientific Input: ${researchOutput}\nCoding/Engineering Input: ${codingOutput}\nFormat a final synthesised report highlighting why Tejas has the exact expertise to solve this problem for a company.`;
  const careerOutput = await runCareerAgent(careerPrompt);

  return {
    query,
    agents: {
      researchAgent: researchOutput,
      codingAgent: codingOutput,
      careerAgent: careerOutput
    },
    synthesis: careerOutput
  };
}

// REST Endpoint for Multi-Agent Collaboration
app.post("/api/ai/agent-collab", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required." });
    }
    const collaborationResult = await runCollaboration(query);
    return res.json(collaborationResult);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
});

// JSON-RPC 2.0 Router for Multi-Agent Communication
app.post("/api/ai/agent-rpc", async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    if (jsonrpc !== "2.0" || !method || id === undefined) {
      return res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid JSON-RPC request format" },
        id: id || null
      });
    }

    const query = params?.query || "";
    if (!query) {
      return res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32602, message: "Missing parameter 'query'" },
        id
      });
    }

    let result;
    switch (method) {
      case "query_career":
        result = { response: await runCareerAgent(query) };
        break;
      case "query_research":
        result = { response: await runResearchAgent(query) };
        break;
      case "query_coding":
        result = { response: await runCodingAgent(query) };
        break;
      case "agent_collaborate":
        result = await runCollaboration(query);
        break;
      default:
        return res.status(404).json({
          jsonrpc: "2.0",
          error: { code: -32601, message: `Method '${method}' not found` },
          id
        });
    }

    return res.json({ jsonrpc: "2.0", result, id });
  } catch (error) {
    return res.status(500).json({
      jsonrpc: "2.0",
      error: { code: -32603, message: (error as Error).message },
      id: req.body.id || null
    });
  }
});

app.listen(PORT, () => {
  console.log(`[AI Service] Running on port ${PORT}`);
});
