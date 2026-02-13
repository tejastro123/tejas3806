import { useEffect, useRef } from "react";
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

const Index = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        glowRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-neon-cyan/30 selection:text-white">
      {/* Custom Cursor */}
      <CustomCursor />

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


