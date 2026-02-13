import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FolderGit2, PenTool, MessageSquare, Briefcase, Wrench, Zap } from "lucide-react";

interface CountCard {
  label: string;
  table: string;
  icon: unknown;
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

  useEffect(() => {
    const fetchCounts = async () => {
      const updated = await Promise.all(
        cards.map(async (card) => {
          const { count } = await supabase
            .from(card.table)
            .select("*", { count: "exact", head: true });
          return { ...card, count: count || 0 };
        })
      );
      setCards(updated);
    };
    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-muted-foreground mb-8">Welcome to your portfolio admin panel.</p>

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
