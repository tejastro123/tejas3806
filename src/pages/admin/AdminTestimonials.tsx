import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  User,
  Quote,
  Clock,
  ExternalLink,
  MessageSquareQuote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useCallback } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: unknown) {
      console.error("Error fetching testimonials:", err);
      toast({
        title: "Error",
        description: "Failed to load testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, is_approved: !currentStatus } : t
      ));

      toast({
        title: !currentStatus ? "Approved" : "Unapproved",
        description: `Testimonial status updated successfully.`,
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({
        title: "Deleted",
        description: "Testimonial removed permanently.",
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-muted-foreground text-sm">Review and moderate testimonials from your peers.</p>
        </div>
        <Button onClick={fetchTestimonials} variant="outline" size="sm" disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center p-12 glass rounded-xl border border-dashed">
          <MessageSquareQuote className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No testimonials found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`p-5 rounded-xl border transition-all glass ${t.is_approved ? 'border-neon-cyan/30' : 'border-neon-pink/30 bg-neon-pink/5'
                }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-muted bg-muted/50 flex items-center justify-center">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg leading-tight">{t.name}</h3>
                      <Badge variant={t.is_approved ? "default" : "destructive"} className="text-[10px] h-5">
                        {t.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.role}{t.company ? ` @ ${t.company}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 gap-2 ${t.is_approved ? 'hover:text-neon-pink' : 'hover:text-neon-cyan'}`}
                    onClick={() => toggleApproval(t.id, t.is_approved)}
                  >
                    {t.is_approved ? (
                      <><XCircle size={16} /> Unapprove</>
                    ) : (
                      <><CheckCircle2 size={16} /> Approve</>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTestimonial(t.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="mt-4 relative">
                <Quote size={20} className="absolute -left-1 -top-1 text-primary opacity-20" />
                <p className="text-muted-foreground italic pl-6 leading-relaxed">
                  {t.content}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-muted/30 flex items-center justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={10} />
                    ID: {t.id.substring(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
