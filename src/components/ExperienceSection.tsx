import { motion } from "framer-motion";
import { useTextScramble } from "@/hooks/useTextScramble";

type TimelineItem = {
  type: "work" | "education";
  title: string;
  org: string;
  date: string;
  description: string;
};

import { experience } from "@/data";

const typeColors: Record<string, string> = {
  work: "border-neon-cyan bg-neon-cyan",
  education: "border-neon-purple bg-neon-purple",
  research: "border-neon-green bg-neon-green",
  academic: "border-neon-orange bg-neon-orange",
};

import { ThreeDText } from "@/components/ThreeDText";

const ExperienceSection = () => {
  const { displayText, scramble } = useTextScramble("Experience & Education");

  return (
    <section id="experience" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={scramble}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-orange uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-orange/50" />
            Journey
            <span className="w-8 h-px bg-neon-orange/50" />
          </span>
          <ThreeDText variant="purple" intensity={12}>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text font-mono min-h-[1.2em]" onMouseEnter={scramble}>
              {displayText}
            </h2>
          </ThreeDText>
        </motion.div>


        <div className="relative">
          {/* Neon center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan/50 via-neon-purple/30 to-neon-green/50 -translate-x-1/2" />

          <motion.div
            className="space-y-12"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {experience.map((item, i) => {
              const isLeft = i % 2 === 0;
              const dotColor = typeColors[item.type] || "border-neon-cyan bg-neon-cyan";
              return (
                <motion.div
                  key={item.title + item.org}
                  variants={{
                    hidden: { opacity: 0, x: isLeft ? -30 : 30 },
                    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80 } }
                  }}
                  className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-6`}
                >
                  <div className={`hidden md:flex w-1/2 justify-${isLeft ? 'end' : 'start'} items-center`}>
                    <div className="text-sm font-mono text-muted-foreground">{item.date}</div>
                    <div className={`w-8 h-[1px] bg-border/50 mx-4 ${isLeft ? '' : 'order-first'}`} />
                  </div>

                  {/* Neon dot */}
                  <div className={`absolute left-6 md:left-1/2 w-3 h-3 -ml-1.5 rounded-full border-2 ${dotColor} z-10`}
                    style={{ boxShadow: `0 0 8px currentColor` }}
                  />

                  <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="glass neon-border rounded-2xl p-5 holo-shine">
                      <div className="md:hidden text-xs font-mono text-neon-cyan mb-2">{item.date}</div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-neon-cyan/10 text-neon-cyan mb-2">
                        {item.type}
                      </span>
                      <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                      <div className="text-neon-purple font-medium text-sm mb-1">{item.org}</div>
                      {item.location && <div className="text-xs text-muted-foreground mb-3">{item.location}</div>}
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      {item.skills && (
                        <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                          {item.skills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono bg-muted/50 text-muted-foreground neon-border">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

