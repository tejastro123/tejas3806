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
  image?: string;
  featured?: boolean;
};

import { projects } from "@/data";

const filters = ["All", "Featured", "Full Stack", "AI/ML", "Algorithms", "Quantum Computing", "Web Dev"];

const ProjectsSection = () => {
  const [active, setActive] = useState("All");
  const filtered = active === "All"
    ? projects
    : active === "Featured"
      ? projects.filter((p) => p.featured)
      : projects.filter((p) => p.category === active);

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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${active === f
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
            {filtered.slice(0, active === "All" ? 9 : filtered.length).map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group rounded-2xl glass overflow-hidden hover:shadow-xl transition-all h-full flex flex-col"
              >
                {/* Thumbnail */}
                <div className="h-48 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                      💻
                    </div>
                  )}

                  {project.featured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-bold rounded-full shadow-lg z-10">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display font-bold text-lg mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    {project.demo && project.demo !== "#" && (
                      <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5 flex-1" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} /> Demo
                        </a>
                      </Button>
                    )}
                    {project.github && (
                      <Button size="sm" variant="ghost" className="rounded-full text-xs gap-1.5 flex-1" asChild>
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

        {active === "All" && projects.length > 9 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="rounded-full gap-2" asChild>
              <a href="https://github.com/tejastro123" target="_blank" rel="noopener noreferrer">
                <Github size={18} /> View All {projects.length} Projects on GitHub
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
