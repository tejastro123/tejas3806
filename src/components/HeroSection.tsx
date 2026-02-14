import { motion } from "framer-motion";
import { ArrowDown, Terminal, Cpu, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personalInfo, socialLinks } from "@/data";
import { useTextScramble } from "@/hooks/useTextScramble";
import { Magnetic } from "@/components/Magnetic";
import { useTranslation } from "react-i18next";
import { ResumeDownloadButton } from "./ResumeDownloadButton";

const HeroSection = () => {
  const { t } = useTranslation();
  const { displayText: nameText, scramble: scrambleName } = useTextScramble(personalInfo.name);
  const { displayText: roleText, scramble: scrambleRole } = useTextScramble(t("hero.role"));

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated tech grid background */}
      <div className="absolute inset-0 -z-10 tech-grid opacity-30" />

      {/* 3D Floating geometric shapes */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        {/* Rotating ring */}
        <div className="absolute top-[15%] right-[10%] w-40 h-40 border border-neon-cyan/20 rounded-full animate-spin-slow" />
        <div className="absolute top-[16%] right-[11%] w-36 h-36 border border-neon-purple/15 rounded-full animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "25s" }} />

        {/* Floating cubes */}
        <motion.div
          animate={{ y: [-10, 10, -10], rotateZ: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[8%] w-12 h-12 border border-neon-cyan/20 rotate-45"
          style={{ perspective: "200px", transform: "rotateX(45deg) rotateZ(45deg)" }}
        />

        <motion.div
          animate={{ y: [0, -20, 0], rotateZ: [0, -45, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] right-[12%] w-8 h-8 bg-neon-purple/10 border border-neon-purple/20"
          style={{ transform: "rotateX(30deg) rotateY(30deg)" }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-[20%] left-[25%] w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-neon" />
        <div className="absolute top-[60%] right-[20%] w-3 h-3 bg-neon-purple rounded-full animate-pulse shadow-neon" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Tech icons floating */}
        <motion.div
          animate={{ y: [-5, 15, -5] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-[45%] left-[5%] text-neon-cyan/10"
        >
          <Terminal size={40} />
        </motion.div>
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-[25%] right-[5%] text-neon-purple/10"
        >
          <Cpu size={36} />
        </motion.div>
        <motion.div
          animate={{ y: [-8, 12, -8] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-[20%] left-[40%] text-neon-green/10"
        >
          <Code2 size={32} />
        </motion.div>
      </div>

      <div className="container mx-auto text-center max-w-3xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass neon-border text-primary text-sm font-mono mb-6">
            <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            SYSTEM.ONLINE
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative inline-block"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 relative">
            <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/30 animate-pulse-ring" />
            <div className="absolute -inset-2 rounded-full border border-neon-purple/20 animate-spin-slow" />
            <div className="w-full h-full rounded-full overflow-hidden glass">
              <img
                src={personalInfo.avatar}
                alt={personalInfo.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onViewportEnter={scrambleName}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 font-display"
        >
          <span className="gradient-text font-mono" onMouseEnter={scrambleName}>{nameText}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onViewportEnter={scrambleRole}
          className="text-xl md:text-2xl text-neon-cyan/80 mb-2 font-mono font-medium"
        >
          {"< "}
          <span onMouseEnter={scrambleRole}>{roleText}</span>
          {" />"}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg text-neon-purple/70 mb-6 italic"
        >
          {t("hero.tagline")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed"
        >
          {t("hero.short")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <Magnetic>
            <Button size="lg" className="rounded-full px-8 font-display bg-primary text-primary-foreground neon-glow hover:shadow-neon-lg transition-all" asChild>
              <a href="#projects">{t("hero.cta")}</a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button size="lg" variant="outline" className="rounded-full px-8 font-display neon-border" asChild>
              <a href="#contact">{t("hero.contact_cta")}</a>
            </Button>
          </Magnetic>

          <ResumeDownloadButton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <Magnetic key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full glass neon-border hover:neon-glow transition-all hover:scale-110 text-foreground/60 hover:text-neon-cyan"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            </Magnetic>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neon-cyan/50 hover:text-neon-cyan transition-colors"
      >
        <ArrowDown className="animate-bounce" size={24} />
      </motion.a>
    </section>
  );
};

export default HeroSection;

