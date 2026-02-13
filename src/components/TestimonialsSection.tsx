import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/data";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section id="testimonials" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-purple uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-purple/50" />
            Inspiration
            <span className="w-8 h-px bg-neon-purple/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">Words I Live By</h2>
        </motion.div>

        <div className="relative">
          <div className="glass neon-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden holo-shine">
            {/* Decorative quote icon */}
            <div className="absolute top-6 left-6 text-neon-cyan/10">
              <Quote size={60} />
            </div>

            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xl md:text-2xl italic text-foreground/90 mb-6 leading-relaxed relative z-10">
                "{testimonials[current].quote}"
              </p>
              <div>
                <p className="font-display font-bold text-neon-cyan">{testimonials[current].name}</p>
                <p className="text-sm font-mono text-muted-foreground">{testimonials[current].role}</p>
              </div>
            </motion.div>

            {/* Indicator dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-neon-cyan w-6 shadow-neon" : "bg-muted/50"
                    }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full glass neon-border flex items-center justify-center text-foreground/60 hover:text-neon-cyan hover:neon-glow transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full glass neon-border flex items-center justify-center text-foreground/60 hover:text-neon-cyan hover:neon-glow transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
