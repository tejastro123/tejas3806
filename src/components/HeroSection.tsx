import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalInfo, socialLinks } from "@/data";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Floating blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary/20 rounded-full animate-blob blur-3xl" />
        <div className="absolute top-40 right-[15%] w-64 h-64 bg-secondary/20 rounded-full animate-blob blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-[30%] w-80 h-80 bg-accent/20 rounded-full animate-blob blur-3xl" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 right-[5%] w-16 h-16 bg-coral rounded-lg animate-float opacity-30 rotate-12" />
        <div className="absolute top-[20%] left-[5%] w-12 h-12 bg-lime rounded-full animate-float-reverse opacity-30" />
        <div className="absolute bottom-[30%] right-[20%] w-10 h-10 bg-sky rounded-lg animate-float opacity-20 rotate-45" />
      </div>

      <div className="container mx-auto text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            👋 Hey there, I'm
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-primary/20 p-1 bg-background/50 backdrop-blur-sm">
            <img
              src={personalInfo.avatar}
              alt={personalInfo.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-display"
        >
          <span className="gradient-text">{personalInfo.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-foreground/80 mb-2 font-display font-medium"
        >
          {personalInfo.role}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg text-primary/80 mb-6 italic"
        >
          {personalInfo.bio.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed"
        >
          {personalInfo.bio.short}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <Button size="lg" className="rounded-full px-8 font-display" asChild>
            <a href="#projects">View My Work</a>
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-8 font-display" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full border border-border transition-all hover:scale-110 ${color || "hover:border-primary hover:text-primary"}`}
              aria-label={label}
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowDown className="animate-bounce" size={24} />
      </motion.a>
    </section>
  );
};

export default HeroSection;
