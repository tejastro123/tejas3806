import { motion } from "framer-motion";

type SkillCategory = {
  title: string;
  icon: unknown;
  skills: { name: string; level: number }[];
};

import { skills } from "@/data";

const neonColors = [
  "from-neon-cyan to-neon-cyan",
  "from-neon-purple to-neon-purple",
  "from-neon-green to-neon-green",
  "from-neon-pink to-neon-pink",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-cyan uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-cyan/50" />
            Skills
            <span className="w-8 h-px bg-neon-cyan/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">My Toolbox</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((cat, ci) => {
            const Icon = cat.icon as React.ComponentType<{ size: number }>;
            const colorClass = neonColors[ci % neonColors.length];
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
                className="card-3d"
              >
                <div className="card-3d-inner rounded-2xl glass neon-border p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-5 text-foreground">{cat.title}</h3>
                  <div className="space-y-4">
                    {cat.skills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-mono text-foreground/80">{skill.name}</span>
                          <span className="text-neon-cyan font-mono text-xs">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${colorClass}`}
                            style={{
                              boxShadow: `0 0 8px hsl(var(--neon-cyan) / 0.3)`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
