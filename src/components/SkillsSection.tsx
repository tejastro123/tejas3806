import { motion } from "framer-motion";

type SkillCategory = {
  title: string;
  color: string;
  skills: { name: string; level: number }[];
};

import { skills } from "@/data";

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Skills</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">My Toolbox 🛠️</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.15 }}
              className="rounded-2xl glass p-6"
            >
              <h3 className="font-display font-bold text-lg mb-5">{cat.title}</h3>
              <div className="space-y-4">
                {cat.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${ci === 0 ? "bg-primary" : ci === 1 ? "bg-secondary" : "bg-accent"
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
