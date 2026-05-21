import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ParticleGrid from "@/components/ParticleGrid";
import CustomCursor from "@/components/CustomCursor";
import Terminal from "@/components/Terminal";
import { Terminal as TerminalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

const Index = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  useEffect(() => {
    trackEvent("page_view", "home");
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        glowRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsTerminalOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-neon-cyan/30 selection:text-white">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Terminal Overlay */}
      <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Mouse Following Glow */}
      <div
        ref={glowRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-soft-light"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(6, 182, 212, 0.12), transparent 80%)`,
        }}
      />

      {/* Particle Grid Background */}
      <div className="fixed inset-0 z-0">
        <ParticleGrid />
      </div>

      {/* Terminal Trigger FAB */}
      <div className="fixed bottom-8 right-8 z-[900]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsTerminalOpen(true)}
          className="w-14 h-14 rounded-full glass neon-border flex items-center justify-center text-neon-cyan shadow-neon hover:neon-glow transition-all"
          title="Open Terminal (Ctrl+K)"
        >
          <TerminalIcon size={24} />
        </motion.button>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <TestimonialsSection />
        <BlogSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;



