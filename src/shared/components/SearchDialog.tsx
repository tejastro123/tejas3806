import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, Briefcase, Award, Code, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  url: string;
  highlights?: {
    title?: string;
    content?: string;
  };
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchDialog = ({ isOpen, onClose }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Handle hotkeys (Escape to close, arrow keys to navigate, enter to select)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, activeIndex]);

  // Query search endpoint
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setActiveIndex(0);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (item: SearchResult) => {
    onClose();
    window.location.href = item.url;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <BookOpen className="text-neon-cyan" size={18} />;
      case "project":
        return <Code className="text-emerald-400" size={18} />;
      case "experience":
        return <Briefcase className="text-amber-400" size={18} />;
      default:
        return <Award className="text-purple-400" size={18} />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20";
      case "project":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "experience":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Dialog Body */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border/50 glass-strong shadow-2xl flex flex-col max-h-[70vh]"
          >
            {/* Search Input Box */}
            <div className="flex items-center px-4 py-3 border-b border-border/50 gap-3">
              <Search className="text-muted-foreground" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, experience, skills, articles..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-base"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 rounded-md hover:bg-foreground/5 text-muted-foreground"
                >
                  <X size={16} />
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 bg-foreground/5 px-2 py-1 rounded text-[10px] text-muted-foreground font-mono">
                <span>ESC</span>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No matches found for "<span className="text-foreground font-medium">{query}</span>"
                </div>
              )}

              {!loading && !query && (
                <div className="text-center py-8 text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <Search className="opacity-40" size={32} />
                  <p>Type queries to scan the global portfolio index</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs border border-border/50">React</span>
                    <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs border border-border/50">Physics</span>
                    <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs border border-border/50">Experience</span>
                  </div>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mb-2">
                    Matches ({results.length})
                  </div>
                  {results.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${
                        index === activeIndex
                          ? "bg-primary/10 border-primary/40 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-foreground/5"
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">{getIcon(item.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className="font-medium text-sm text-foreground block truncate"
                            dangerouslySetInnerHTML={{ __html: item.highlights?.title || item.title }}
                          />
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border uppercase ${getTypeBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                        </div>
                        <p
                          className="text-xs text-muted-foreground line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: item.highlights?.content || item.content }}
                        />
                      </div>
                      {index === activeIndex && (
                        <div className="text-muted-foreground/50 self-center">
                          <CornerDownLeft size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-foreground/[0.02] border-t border-border/50 px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex gap-4">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <div>
                <span>Powered by SearchEngine</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
