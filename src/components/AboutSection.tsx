import { motion } from "framer-motion";
import { Code2, Lightbulb, Rocket, Coffee } from "lucide-react";

import { personalInfo, about } from "@/data";

const highlights = [
  { icon: Code2, title: "Clean Code", desc: "I write readable, maintainable, well-tested code." },
  { icon: Lightbulb, title: "Creative Thinker", desc: "I love finding elegant solutions to complex problems." },
  { icon: Rocket, title: "Ship Fast", desc: "I believe in iterating quickly and delivering value." },
  { icon: Coffee, title: "Team Player", desc: "Collaboration and communication are my strengths." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">About Me</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">
            Nice to meet you! <span className="inline-block animate-float">👋</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center border-2 border-dashed border-border">
              <span className="text-6xl">🧑‍💻</span>
            </div>
            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl glass shadow-lg text-sm font-medium">
              📍 {personalInfo.location}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {personalInfo.bio.long}
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              When I'm not coding, you'll find me exploring new technologies, contributing to open
              source projects, or sharing what I've learned with the community.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-display font-semibold text-foreground mb-3">Fun facts about me:</p>
              <div className="flex flex-wrap gap-2">
                {about.funFacts.map((fact) => (
                  <span
                    key={fact}
                    className="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {highlights.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-5 rounded-2xl glass text-center hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
