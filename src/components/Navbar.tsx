import { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { personalInfo } from "@/data";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.skills"), href: "#skills" },
    { label: t("nav.projects"), href: "#projects" },
    { label: t("nav.experience"), href: "#experience" },
    { label: t("nav.blog"), href: "#blog" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg neon-glow" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:neon-glow transition-all">
            <Terminal size={16} />
          </div>
          <span className="font-display text-xl font-bold gradient-text">
            {personalInfo.name.split(" ")[0]}
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-mono text-muted-foreground hover:text-neon-cyan transition-all relative group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 rounded-lg bg-neon-cyan/0 group-hover:bg-neon-cyan/5 transition-all" />
                <span className="absolute bottom-1 left-3 right-3 h-px bg-neon-cyan/0 group-hover:bg-neon-cyan/50 transition-all" />
              </a>
            ))}
          </div>
          <div className="h-6 w-px bg-border/50 mx-2" />
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg glass neon-border"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-neon-cyan/10"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-mono text-muted-foreground hover:text-neon-cyan py-3 px-3 rounded-lg hover:bg-neon-cyan/5 transition-all flex items-center gap-2"
                >
                  <span className="text-neon-cyan/30 text-xs">0{i + 1}.</span>
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
