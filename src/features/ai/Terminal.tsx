import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight } from "lucide-react";
import { personalInfo, projects } from "@/data";

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandHistory {
  type: "command" | "output" | "error" | "info";
  text: string | React.ReactNode;
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    { type: "info", text: "ANTIGRAVITY OS v2.0.4 [BOOT SEQUENCE COMPLETE]" },
    { type: "info", text: "Type 'help' to see available commands." },
  ]);
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const args = trimmedCmd.split(" ");
    const command = args[0];

    setHistory((prev) => [...prev, { type: "command", text: `guest@portfolio:~$ ${cmd}` }]);

    switch (command) {
      case "help":
        setHistory((prev) => [
          ...prev,
          {
            type: "output",
            text: (
              <div className="grid grid-cols-2 gap-2 mt-1 mb-2">
                <div><span className="text-neon-cyan">help</span> - Show this menu</div>
                <div><span className="text-neon-cyan">ls</span> - List site sections</div>
                <div><span className="text-neon-cyan">cd [section]</span> - Jump to section</div>
                <div><span className="text-neon-cyan">whoami</span> - Display profile info</div>
                <div><span className="text-neon-cyan">projects</span> - View all projects</div>
                <div><span className="text-neon-cyan">cat [file]</span> - Read file content</div>
                <div><span className="text-neon-cyan">clear</span> - Clear screen</div>
                <div><span className="text-neon-cyan">exit</span> - Close terminal</div>
                <div><span className="text-neon-pink">sudo admin</span> - Restricted access</div>
              </div>
            ),
          },
        ]);
        break;

      case "ls":
        setHistory((prev) => [
          ...prev,
          { type: "output", text: "hero/  about/  skills/  projects/  experience/  contact/  about.txt  resume.md" },
        ]);
        break;

      case "cd": {
        const section = args[1];
        if (!section) {
          setHistory((prev) => [...prev, { type: "error", text: "Usage: cd [section]" }]);
        } else {
          const target = document.getElementById(section);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            setHistory((prev) => [...prev, { type: "output", text: `Navigating to ${section}...` }]);
            onClose();
          } else {
            setHistory((prev) => [...prev, { type: "error", text: `Directory not found: ${section}` }]);
          }
        }
        break;
      }

      case "whoami":
        setHistory((prev) => [
          ...prev,
          { type: "output", text: `${personalInfo.name} - ${personalInfo.role}` },
          { type: "output", text: personalInfo.bio.tagline },
        ]);
        break;

      case "projects":
        setHistory((prev) => [
          ...prev,
          { type: "output", text: "RETRIEVING_DATA_FROM_GRID..." },
          ...projects.map((p) => ({ type: "output" as const, text: `> ${p.title}: ${p.description.substring(0, 50)}...` })),
        ]);
        break;

      case "cat": {
        const file = args[1];
        if (file === "about.txt") {
          setHistory((prev) => [...prev, { type: "output", text: personalInfo.bio.long }]);
        } else if (file === "resume.md") {
          setHistory((prev) => [...prev, { type: "output", text: "Generating resume preview... system detected dynamic data seeding required." }]);
        } else {
          setHistory((prev) => [...prev, { type: "error", text: `cat: ${file || "NULL"}: No such file or directory` }]);
        }
        break;
      }

      case "clear":
        setHistory([]);
        break;

      case "exit":
        onClose();
        break;

      case "sudo":
        if (args[1] === "admin") {
          setHistory((prev) => [
            ...prev,
            { type: "error", text: "ACCESS DENIED. SECURE CHANNEL DETECTED." },
            { type: "error", text: "REPORTING ATTEMPT TO SYSTEM ADMINISTRATOR..." },
          ]);
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 1500);
        } else {
          setHistory((prev) => [...prev, { type: "error", text: "sudo: permission denied" }]);
        }
        break;

      case "":
        break;

      default:
        setHistory((prev) => [...prev, { type: "error", text: `command not found: ${command}` }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`pointer-events-auto flex flex-col glass-strong border border-neon-cyan/30 rounded-lg shadow-2xl overflow-hidden ${isMaximized ? "w-full h-full" : "w-full max-w-4xl h-[60vh]"
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-black/40 border-b border-neon-cyan/20">
              <div className="flex items-center gap-3">
                <TerminalIcon size={16} className="text-neon-cyan" />
                <span className="text-xs font-mono text-neon-cyan uppercase tracking-tighter">antigravity_terminal_v2.sh</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMaximized(!isMaximized)} className="p-1 hover:text-neon-cyan transition-colors">
                  {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <button onClick={onClose} className="p-1 hover:text-neon-pink transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div
              ref={scrollRef}
              className="flex-grow p-4 font-mono text-sm overflow-y-auto bg-black/60 custom-scrollbar"
              onClick={() => inputRef.current?.focus()}
            >
              <div className="space-y-1 mb-4">
                {history.map((line, i) => (
                  <div key={i} className={`
                    ${line.type === 'command' ? 'text-white font-bold' : ''}
                    ${line.type === 'error' ? 'text-neon-pink' : ''}
                    ${line.type === 'info' ? 'text-neon-cyan/60 italic' : ''}
                    ${line.type === 'output' ? 'text-neon-cyan' : ''}
                  `}>
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Input Line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="text-neon-green font-bold">guest@portfolio:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow bg-transparent border-none outline-none text-white selection:bg-neon-cyan/30"
                  autoFocus
                />
              </form>
            </div>

            {/* Footer */}
            <div className="px-4 py-1.5 bg-black/40 border-t border-neon-cyan/10 text-[10px] font-mono text-neon-cyan/40 flex justify-between">
              <span>SYSTEM: OK</span>
              <span>UTF-8 | TSX | VITE</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
