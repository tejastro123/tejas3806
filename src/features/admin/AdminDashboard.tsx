import { useEffect, useState } from "react";
import { apiClient } from "@/services/api/apiClient";
import { Button } from "@/shared/components/ui/button";
import { FolderGit2, PenTool, MessageSquare, Briefcase, Wrench, Zap, Database, LucideIcon } from "lucide-react";

interface CountCard {
  label: string;
  table: string;
  icon: LucideIcon;
  count: number;
}

const AdminDashboard = () => {
  const [cards, setCards] = useState<CountCard[]>([
    { label: "Projects", table: "projects", icon: FolderGit2, count: 0 },
    { label: "Blog Posts", table: "blog_posts", icon: PenTool, count: 0 },
    { label: "Testimonials", table: "testimonials", icon: MessageSquare, count: 0 },
    { label: "Experience", table: "experience", icon: Briefcase, count: 0 },
    { label: "Skills", table: "skills", icon: Wrench, count: 0 },
    { label: "Services", table: "services", icon: Zap, count: 0 },
  ]);
  const [seeding, setSeeding] = useState(false);
  const [seedResults, setSeedResults] = useState<string[]>([]);

  const fetchCounts = async () => {
    const updated = await Promise.all(
      cards.map(async (card) => {
        const { count } = await apiClient
          .from(card.table)
          .select("*", { count: "exact", head: true });
        return { ...card, count: count || 0 };
      })
    );
    setCards(updated);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedResults([]);
    try {
      const response = await fetch("/api/seed");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to seed");
      setSeedResults(["✅ Database seeded successfully!", data.message]);
      fetchCounts(); // Refresh counts after seeding
    } catch (err: any) {
      setSeedResults([`❌ Error: ${err.message}`]);
    }
    setSeeding(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to your portfolio admin panel.</p>

      {/* Seed Data Section */}
      <div className="mb-8 p-5 rounded-2xl border border-dashed border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Database size={20} className="text-primary" /> Seed Database
            </h2>
            <p className="text-sm text-muted-foreground">
              Push your current portfolio data into Supabase. Safe to run multiple times (skips existing data).
            </p>
          </div>
          <Button onClick={handleSeed} disabled={seeding} className="gap-2">
            <Database size={16} /> {seeding ? "Seeding..." : "Seed All Data"}
          </Button>
        </div>
        {seedResults.length > 0 && (
          <div className="mt-3 p-3 rounded-lg bg-background text-sm space-y-1 font-mono">
            {seedResults.map((r, i) => (
              <p key={i}>{r}</p>
            ))}
          </div>
        )}
      </div>

      {/* Content Counts */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ label, icon: Icon, count }) => (
          <div
            key={label}
            className="p-6 rounded-2xl bg-background border border-border hover:shadow-md transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Icon size={20} />
            </div>
            <p className="text-3xl font-bold">{count}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
