import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/shared/components/Navbar";
import HeroSection from "@/features/hero/HeroSection";
import AboutSection from "@/features/about/AboutSection";
import SkillsSection from "@/features/skills/SkillsSection";
import ServicesSection from "@/features/services/ServicesSection";
import ProjectsSection from "@/features/projects/ProjectsSection";
import ExperienceSection from "@/features/experience/ExperienceSection";
import TestimonialsSection from "@/features/testimonials/TestimonialsSection";
import BlogSection from "@/features/blog/BlogSection";
import ContactSection from "@/features/contact/ContactSection";
import Footer from "@/shared/components/Footer";
import ParticleGrid from "@/shared/components/ParticleGrid";
import CustomCursor from "@/shared/components/CustomCursor";
import Terminal from "@/features/ai/Terminal";
import { Terminal as TerminalIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/services/api/analytics";

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
      <Helmet>
        <link rel="canonical" href="https://tejas3806.lovable.app/" />
      </Helmet>
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



