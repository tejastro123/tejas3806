import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Loader2 } from "lucide-react";

interface ResumeAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisResult {
  score: number;
  gaps: string[];
  strengths: string[];
  recommendations: string[];
}

export const ResumeAnalyzerModal: React.FC<ResumeAnalyzerModalProps> = ({ isOpen, onClose }) => {
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/ai/resume-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to the analysis engine.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-strong border border-neon-cyan/30 text-white max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-mono tracking-tight text-neon-cyan">
            <Sparkles className="text-neon-cyan animate-pulse" size={20} />
            AI Resume Gap Analyzer
          </DialogTitle>
          <DialogDescription className="text-foreground/60 text-xs">
            Paste your resume to compare it with Tejas's expertise profile. Get an ATS score, identify technical gaps, and see recommended skills.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
            {error}
          </div>
        )}

        {!result ? (
          <div className="space-y-4 py-2">
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your professional experience, skills, and summary here..."
              className="w-full h-48 bg-black/40 border border-neon-cyan/20 rounded-lg p-3 text-sm font-mono text-white outline-none focus:border-neon-cyan/60 transition-all custom-scrollbar resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose} disabled={analyzing} className="text-foreground/75 hover:bg-white/5">
                Cancel
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing || !resumeText.trim()}
                className="bg-neon-cyan hover:bg-neon-cyan/80 text-black font-semibold font-mono"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Analyzing Profile...
                  </>
                ) : (
                  "Compare Profile"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* ATS Score Header */}
            <div className="flex flex-col items-center justify-center py-4 border-b border-neon-cyan/10">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-4 border-neon-cyan/20">
                {/* Score Circle */}
                <div className="text-center">
                  <span className="text-3xl font-mono font-bold text-neon-cyan">{result.score}</span>
                  <span className="text-xs text-foreground/40 block">ATS MATCH</span>
                </div>
                {/* Overlay glow */}
                <div className="absolute inset-0 rounded-full bg-neon-cyan/5 blur-md" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="space-y-3">
                <h4 className="font-mono text-sm text-neon-green flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={16} /> Key Strengths
                </h4>
                <div className="space-y-1.5">
                  {result.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-foreground/80 leading-relaxed bg-green-500/5 p-2 border border-green-500/10 rounded">
                      • {str}
                    </div>
                  ))}
                  {result.strengths.length === 0 && <span className="text-xs text-foreground/40 italic">None detected</span>}
                </div>
              </div>

              {/* Gaps */}
              <div className="space-y-3">
                <h4 className="font-mono text-sm text-neon-pink flex items-center gap-1.5 font-semibold">
                  <AlertTriangle size={16} /> Technical Gaps
                </h4>
                <div className="space-y-1.5">
                  {result.gaps.map((gap, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-foreground/80 leading-relaxed bg-pink-500/5 p-2 border border-pink-500/10 rounded">
                      • {gap}
                    </div>
                  ))}
                  {result.gaps.length === 0 && <span className="text-xs text-foreground/40 italic">No gaps detected! Match is perfect.</span>}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3 pt-2">
              <h4 className="font-mono text-sm text-neon-yellow flex items-center gap-1.5 font-semibold">
                <Lightbulb size={16} /> Recommendations to Reach Benchmark
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-foreground/80 leading-relaxed list-decimal list-inside bg-yellow-500/5 p-2.5 border border-yellow-500/10 rounded">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neon-cyan/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResult(null)}
                className="neon-border hover:neon-glow hover:text-neon-cyan text-xs"
              >
                Test Another Resume
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-white/5 text-xs text-foreground/60"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
