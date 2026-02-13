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
                  <div className={`hidden md:flex w-1/2 justify-${isLeft ? 'end' : 'start'} items-center`}>
                    <div className="text-sm font-medium text-muted-foreground">{item.date}</div>
                    <div className={`w-8 h-[1px] bg-border mx-4 ${isLeft ? '' : 'order-first'}`}></div>
                  </div>

                  <div className="absolute left-4 md:left-1/2 w-4 h-4 -ml-2 rounded-full border-2 border-primary bg-background z-10"></div>

                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="md:hidden text-sm font-semibold text-primary mb-1">{item.date}</div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="text-primary font-medium mb-1">{item.org}</div>
                    {item.location && <div className="text-xs text-muted-foreground mb-3">{item.location}</div>}
                    <p className="text-muted-foreground mb-3">{item.description}</p>
                    {item.skills && (
                      <div className={`flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                        {item.skills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider bg-muted text-muted-foreground">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
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
