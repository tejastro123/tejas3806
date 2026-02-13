import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

type TimelineItem = {
  type: "work" | "education";
  title: string;
  org: string;
  date: string;
  description: string;
};

import { experience } from "@/data";

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Journey</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2">Experience & Education 🎓</h2>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {experience.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.title + item.org}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col md:flex-row ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-6`}
                >
                  {/* Card */}
                  <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="glass rounded-2xl p-5 inline-block text-left hover:shadow-lg transition-all">
                      <span className="text-xs font-medium text-primary">{item.date}</span>
                      <h3 className="font-display font-bold text-lg mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-medium">{item.org}</p>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 z-10 shadow-lg">
                    {item.type === "work" ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
