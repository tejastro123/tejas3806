import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, MessageSquarePlus, Send, Loader2, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
}

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar_url: ""
  });

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await apiClient
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const isAllowedAvatarUrl = (url: string): boolean => {
    if (!url) return true; // empty allowed
    try {
      const u = new URL(url);
      if (u.protocol !== "https:") return false;
      const ALLOWED_HOSTS = [
        "github.com",
        "avatars.githubusercontent.com",
        "gravatar.com",
        "www.gravatar.com",
        "secure.gravatar.com",
        "lh3.googleusercontent.com",
        "media.licdn.com",
      ];
      return ALLOWED_HOSTS.includes(u.hostname);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const content = formData.content.trim();
    const avatar = formData.avatar_url.trim();

    if (name.length > 100 || content.length > 1000) {
      toast({
        title: "Too long",
        description: "Please shorten your input and try again.",
        variant: "destructive",
      });
      return;
    }
    if (avatar && !isAllowedAvatarUrl(avatar)) {
      toast({
        title: "Avatar URL not allowed",
        description:
          "Avatar must be an HTTPS link from GitHub, Gravatar, Google, or LinkedIn. Leave it blank to skip.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await apiClient
        .from("testimonials")
        .insert([{
          name,
          role: formData.role.trim() || null,
          company: formData.company.trim() || null,
          content,
          avatar_url: avatar || null,
          is_approved: false
        }]);

      if (error) throw error;

      setIsSent(true);
      setFormData({ name: "", role: "", company: "", content: "", avatar_url: "" });
      toast({
        title: "Success!",
        description: "Your testimonial has been submitted for review.",
      });
      setTimeout(() => {
        setIsSent(false);
        setIsOpen(false);
      }, 3000);
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  return (
    <section id="testimonials" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-purple uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-purple/50" />
            {t("nav.testimonials")}
            <span className="w-8 h-px bg-neon-purple/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">{t("testimonials.heading")}</h2>
        </motion.div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-neon-cyan" size={32} />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="relative group">
            <div className="glass neon-border rounded-3xl p-10 md:p-16 text-center relative overflow-hidden holo-shine">
              <div className="absolute top-6 left-6 text-neon-cyan/10">
                <Quote size={60} />
              </div>

              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <p className="text-xl md:text-2xl italic text-foreground/90 mb-8 leading-relaxed">
                  "{testimonials[current].content}"
                </p>
                <div className="flex flex-col items-center gap-3">
                  {testimonials[current].avatar_url && (
                    <img
                      src={testimonials[current].avatar_url || ""}
                      alt=""
                      className="w-12 h-12 rounded-full border border-neon-cyan/30 object-cover"
                    />
                  )}
                  <div>
                    <h4 className="font-display font-bold text-neon-cyan text-lg">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                      {testimonials[current].role} {testimonials[current].company && `@ ${testimonials[current].company}`}
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="flex justify-center gap-2 mt-10">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-neon-cyan w-6 shadow-neon" : "bg-muted/50"
                      }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 rounded-full glass neon-border flex items-center justify-center text-foreground/40 hover:text-neon-cyan hover:neon-glow transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 rounded-full glass neon-border flex items-center justify-center text-foreground/40 hover:text-neon-cyan hover:neon-glow transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        ) : (
          <div className="text-center p-12 glass border border-dashed border-muted-foreground/30 rounded-3xl">
            <p className="text-muted-foreground mb-4">{t("testimonials.no_testimonials")}</p>
          </div>
        )}

        {/* Submission Button & Dialog */}
        <div className="mt-12 text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full px-8 neon-border group hover:neon-glow transition-all"
              >
                <MessageSquarePlus className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                {t("common.share_story")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-strong border-neon-cyan/20">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display gradient-text">{t("testimonials.submit_title")}</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t("testimonials.submit_desc")}
                </DialogDescription>
              </DialogHeader>

              {isSent ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green"
                  >
                    <CheckCircle2 size={32} />
                  </motion.div>
                  <h3 className="text-xl font-bold">{t("testimonials.success_title")}</h3>
                  <p className="text-muted-foreground">{t("testimonials.success_desc")}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-neon-cyan uppercase">{t("common.name")}</label>
                      <Input
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="glass neon-border focus:ring-neon-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-neon-cyan uppercase">{t("common.role")}</label>
                      <Input
                        placeholder="Project Manager"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="glass neon-border focus:ring-neon-cyan"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-neon-cyan uppercase">{t("common.company")} ({t("common.optional") || "Optional"})</label>
                      <Input
                        placeholder="TechCorp"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="glass neon-border focus:ring-neon-cyan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-neon-cyan uppercase">{t("common.avatar_url")} ({t("common.optional") || "Optional"})</label>
                      <Input
                        placeholder="https://..."
                        value={formData.avatar_url}
                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                        className="glass neon-border focus:ring-neon-cyan"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-neon-cyan uppercase">{t("common.content")}</label>
                    <Textarea
                      placeholder="Working with Tejas was a game-changer..."
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="glass neon-border focus:ring-neon-cyan resize-none"
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      className="w-full neon-glow bg-primary text-primary-foreground font-display"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("testimonials.transmitting")}</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" /> {t("testimonials.submit_for_review")}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
