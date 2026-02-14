import { motion } from "framer-motion";
import { Code2, Lightbulb, Rocket, Coffee } from "lucide-react";
import { personalInfo, about } from "@/data";
import { useTextScramble } from "@/hooks/useTextScramble";
import { Magnetic } from "@/components/Magnetic";

const highlights = [
  { icon: Code2, title: "Clean Code", desc: "I write readable, maintainable, well-tested code." },
  { icon: Lightbulb, title: "Creative Thinker", desc: "I love finding elegant solutions to complex problems." },
  { icon: Rocket, title: "Ship Fast", desc: "I believe in iterating quickly and delivering value." },
  { icon: Coffee, title: "Team Player", desc: "Collaboration and communication are my strengths." },
];

import { ThreeDText } from "@/components/ThreeDText";

const AboutSection = () => {
  const { displayText, scramble } = useTextScramble("Nice to meet you!");

  return (
    <section id="about" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
          onViewportEnter={scramble}
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-green uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-green/50" />
            About Me
            <span className="w-8 h-px bg-neon-green/50" />
          </span>
          <ThreeDText intensity={10}>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text font-mono min-h-[1.2em]" onMouseEnter={scramble}>
              {displayText} <span className="inline-block animate-float">👋</span>
            </h2>
          </ThreeDText>
        </motion.div>


        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl glass neon-border overflow-hidden relative group">
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              <div className="absolute inset-0 scanline" />
            </div>
            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl glass-strong neon-border shadow-neon text-sm font-mono text-neon-green">
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
            <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
              {personalInfo.bio.long}
            </p>

            <div className="space-y-2">
              <p className="text-sm font-mono font-semibold text-neon-cyan mb-3">// fun_facts</p>
              <div className="flex flex-col gap-3">
                {about.funFacts.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <Magnetic key={fact.text}>
                      <div
                        className="flex items-center gap-3 p-3 rounded-2xl glass neon-border group cursor-default"
                      >
                        <div className="w-8 h-8 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan shrink-0 group-hover:scale-110 group-hover:shadow-neon transition-all">
                          <Icon size={16} />
                        </div>
                        <span className="text-sm text-foreground/70">{fact.text}</span>
                      </div>
                    </Magnetic>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Highlight cards */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
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
          {highlights.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="card-3d"
            >
              <div className="card-3d-inner p-5 rounded-2xl glass neon-border text-center group h-full">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:neon-glow-purple transition-all">
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1 text-foreground">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;

