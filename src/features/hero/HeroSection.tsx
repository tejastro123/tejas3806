import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Terminal, Cpu, Code2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { personalInfo, socialLinks } from "@/data";
import { useTextScramble } from "@/shared/hooks/useTextScramble";
import { Magnetic } from "@/shared/components/Magnetic";
import { useTranslation } from "react-i18next";
import { ResumeDownloadButton } from "@/features/about/ResumeDownloadButton";
import { ResumeAnalyzerModal } from "@/features/about/ResumeAnalyzerModal";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  const { t } = useTranslation();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const { displayText: nameText, scramble: scrambleName } = useTextScramble(personalInfo.name);
  const { displayText: roleText, scramble: scrambleRole } = useTextScramble(t("hero.role"));

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const px1 = useTransform(sx, (v) => v * 30);
  const py1 = useTransform(sy, (v) => v * 30);
  const px2 = useTransform(sx, (v) => v * -50);
  const py2 = useTransform(sy, (v) => v * -50);
  const px3 = useTransform(sx, (v) => v * 20);
  const py3 = useTransform(sy, (v) => v * 20);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set((e.clientX / window.innerWidth) - 0.5);
      my.set((e.clientY / window.innerHeight) - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Animated tech grid background */}
      <div className="absolute inset-0 -z-10 tech-grid opacity-30" />

      {/* Aurora gradient blobs */}
      <motion.div
        style={{ x: px2, y: py2 }}
        className="absolute -z-10 top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-neon-purple/20 blur-3xl"
      />
      <motion.div
        style={{ x: px1, y: py1 }}
        className="absolute -z-10 bottom-[-15%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-neon-cyan/20 blur-3xl"
      />
      <motion.div
        style={{ x: px3, y: py3 }}
        className="absolute -z-10 top-[40%] left-[40%] w-[20rem] h-[20rem] rounded-full bg-neon-pink/15 blur-3xl"
      />

      {/* 3D Floating geometric shapes */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <motion.div style={{ x: px1, y: py1 }} className="absolute top-[15%] right-[10%] w-40 h-40 border border-neon-cyan/20 rounded-full animate-spin-slow" />
        <motion.div style={{ x: px1, y: py1 }} className="absolute top-[16%] right-[11%] w-36 h-36 border border-neon-purple/15 rounded-full animate-spin-slow" />

        <motion.div
          style={{ x: px2, y: py2 }}
          animate={{ rotateZ: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[8%] w-12 h-12 border border-neon-cyan/20 rotate-45"
        />

        <motion.div
          style={{ x: px3, y: py3 }}
          animate={{ rotateZ: [0, -45, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] right-[12%] w-8 h-8 bg-neon-purple/10 border border-neon-purple/20"
        />

        <motion.div style={{ x: px2, y: py2 }} className="absolute top-[20%] left-[25%] w-2 h-2 bg-neon-cyan rounded-full animate-pulse shadow-neon" />
        <motion.div style={{ x: px1, y: py1 }} className="absolute top-[60%] right-[20%] w-3 h-3 bg-neon-purple rounded-full animate-pulse shadow-neon" />
        <motion.div style={{ x: px3, y: py3 }} className="absolute bottom-[35%] left-[15%] w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />

        <motion.div style={{ x: px1, y: py1 }} className="absolute top-[45%] left-[5%] text-neon-cyan/15">
          <Terminal size={40} />
        </motion.div>
        <motion.div style={{ x: px2, y: py2 }} className="absolute top-[25%] right-[5%] text-neon-purple/15">
          <Cpu size={36} />
        </motion.div>
        <motion.div style={{ x: px3, y: py3 }} className="absolute bottom-[20%] left-[40%] text-neon-green/15">
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
                width={160}
                height={160}
                {...{ fetchpriority: "high" } as any}
                decoding="async"
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

          <Magnetic>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full gap-2 neon-border hover:neon-glow hover:text-neon-pink transition-all"
              onClick={() => setShowResumeModal(true)}
            >
              <Sparkles size={18} />
              AI Resume Match
            </Button>
          </Magnetic>
        </motion.div>

        <ResumeAnalyzerModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />

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
                className="p-3 glass neon-border hover:neon-glow transition-all hover:scale-110 text-foreground/60 hover:text-neon-cyan rounded-none"
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

