import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

type Project = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  demo?: string;
  github?: string;
};

const projects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce application with real-time inventory, Stripe payments, and admin dashboard.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    category: "Full Stack",
    demo: "#",
    github: "#",
  },
  {
    title: "AI Chat Assistant",
    description: "An intelligent chatbot powered by OpenAI with context-aware responses and conversation history.",
    tags: ["Python", "OpenAI", "FastAPI", "React"],
    category: "AI/ML",
    demo: "#",
    github: "#",
  },
  {
    title: "Task Management App",
    description: "A collaborative project management tool with real-time updates, drag-and-drop, and team features.",
    tags: ["Next.js", "TypeScript", "Supabase"],
    category: "Full Stack",
    demo: "#",
    github: "#",
  },
  {
    title: "Portfolio Generator",
    description: "A CLI tool that generates beautiful portfolio websites from a simple configuration file.",
    tags: ["TypeScript", "Node.js", "CLI"],
    category: "Tools",
    demo: "#",
    github: "#",
  },
  {
    title: "Weather Dashboard",
    description: "A beautiful weather dashboard with animated visualizations and 7-day forecasts.",
    tags: ["React", "D3.js", "API"],
    category: "Frontend",
    demo: "#",
    github: "#",
  },
  {
    title: "Code Snippet Manager",
    description: "A VS Code extension for organizing, searching, and sharing code snippets across teams.",
    tags: ["TypeScript", "VS Code API"],
    category: "Tools",
    demo: "#",
    github: "#",
  },
];

const filters = ["All", "Full Stack", "Frontend", "AI/ML", "Tools"];

const ProjectsSection = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Projects</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">Things I've Built 🚀</h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                active === f
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl glass overflow-hidden hover:shadow-xl transition-all"
              >
                {/* Thumbnail placeholder */}
                <div className="h-44 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500">
                  💻
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.demo && (
                      <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} /> Demo
                        </a>
                      </Button>
                    )}
                    {project.github && (
                      <Button size="sm" variant="ghost" className="rounded-full text-xs gap-1.5" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github size={14} /> Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
