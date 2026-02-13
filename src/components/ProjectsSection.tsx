import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextScramble } from "@/hooks/useTextScramble";
import { Magnetic } from "@/components/Magnetic";

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
  const { displayText, scramble } = useTextScramble("Things I've Built");

  const filtered = active === "All"
    ? projects
    : active === "Featured"
      ? projects.filter((p) => p.featured)
      : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={scramble}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-cyan uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-cyan/50" />
            Projects
            <span className="w-8 h-px bg-neon-cyan/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text font-mono min-h-[1.2em]" onMouseEnter={scramble}>
            {displayText}
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-full text-sm font-mono transition-all ${active === f
                ? "bg-primary text-primary-foreground neon-glow"
                : "glass neon-border text-muted-foreground hover:text-foreground"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <motion.div
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, active === "All" ? 9 : filtered.length).map((project) => (
              <motion.div
                key={project.title}
                layout
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                className="card-3d"
              >
                <div className="card-3d-inner rounded-2xl glass neon-border overflow-hidden h-full flex flex-col holo-shine">
                  {/* Thumbnail */}
                  <div className="h-48 overflow-hidden relative">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neon-cyan/5 via-neon-purple/5 to-neon-green/5 flex items-center justify-center text-4xl">
                        💻
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

                    {project.featured && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-neon-cyan/90 text-primary-foreground text-xs font-bold font-mono rounded-full shadow-neon z-10">
                        ★ Featured
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow relative z-10">
                    <h3 className="font-display font-bold text-lg mb-2 text-foreground">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-xs font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono">
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-neon-cyan/10">
                      {project.demo && project.demo !== "#" && (
                        <Magnetic>
                          <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5 flex-1 neon-border hover:text-neon-cyan" asChild>
                            <a href={project.demo} target="_blank" rel="noopener noreferrer">
                              <ExternalLink size={14} /> Demo
                            </a>
                          </Button>
                        </Magnetic>
                      )}
                      {project.github && (
                        <Magnetic>
                          <Button size="sm" variant="ghost" className="rounded-full text-xs gap-1.5 flex-1 hover:text-neon-purple" asChild>
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github size={14} /> Code
                            </a>
                          </Button>
                        </Magnetic>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {active === "All" && projects.length > 9 && (
          <div className="mt-12 text-center">
            <Magnetic>
              <Button variant="outline" size="lg" className="rounded-full gap-2 neon-border hover:neon-glow" asChild>
                <a href="https://github.com/tejastro123" target="_blank" rel="noopener noreferrer">
                  <Github size={18} /> View All {projects.length} Projects on GitHub
                </a>
              </Button>
            </Magnetic>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;

