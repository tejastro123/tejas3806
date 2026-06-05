import { personalInfo } from "@/data";
import { Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-neon-cyan/10 relative">
      <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-mono text-xs">
          <Terminal size={14} className="text-neon-cyan/50" />
          <p>© {new Date().getFullYear()} {personalInfo.name}. <span className="text-neon-cyan/50">Built with</span> ❤️ <span className="text-neon-cyan/50">and</span> ☕</p>
        </div>
        <a
          href="/admin/login"
          className="text-xs text-muted-foreground/30 hover:text-neon-cyan transition-colors font-mono"
        >
          [admin]
        </a>
      </div>
    </footer>
  );
};

export default Footer;
