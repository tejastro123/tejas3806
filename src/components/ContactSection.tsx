import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { personalInfo, socialLinks } from "@/data";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from("messages")
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
        ]);

      if (submitError) throw submitError;

      setIsSent(true);
      setFormData({ name: "", email: "", message: "" });
      // Reset success message after 5 seconds
      setTimeout(() => setIsSent(false), 5000);
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again or use the email link below.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-sm font-mono text-neon-green uppercase tracking-wider">
            <span className="w-8 h-px bg-neon-green/50" />
            {t("nav.contact")}
            <span className="w-8 h-px bg-neon-green/50" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 gradient-text">{t("contact.heading")}</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            {t("contact.tagline")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass neon-border rounded-2xl p-6 flex items-center gap-4 group hover:neon-glow transition-all">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{t("common.email")}</p>
                <a href={`mailto:${personalInfo.email}`} className="text-foreground hover:text-neon-cyan transition-colors">
                  {personalInfo.email}
                </a>
              </div>
            </div>

            <div className="glass neon-border rounded-2xl p-6 flex items-center gap-4 group hover:neon-glow transition-all">
              <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                <MapPin size={22} />
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{t("common.location")}</p>
                <p className="text-foreground">{personalInfo.location}</p>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 pt-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl glass neon-border flex items-center justify-center text-muted-foreground hover:text-neon-cyan hover:neon-glow transition-all"
                  aria-label={label}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {isSent ? (
              <div className="glass neon-border rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-20 h-20 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center text-neon-green mb-2 shadow-neon animate-pulse">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold gradient-text">{t("contact.success_title")}</h3>
                <p className="text-muted-foreground font-mono text-sm uppercase tracking-tighter">{t("contact.success_desc")}</p>
                <Button
                  variant="outline"
                  className="mt-6 neon-border"
                  onClick={() => setIsSent(false)}
                >
                  {t("contact.send_another")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass neon-border rounded-2xl p-6 space-y-4 relative overflow-hidden">
                {isSending && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin" />
                  </div>
                )}

                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">{t("common.name")}</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="bg-muted/30 border-border/50 focus:border-neon-cyan/50"
                    required
                    disabled={isSending}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">{t("common.email")}</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="bg-muted/30 border-border/50 focus:border-neon-cyan/50"
                    required
                    disabled={isSending}
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1 block">{t("contact.message_label")}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    rows={4}
                    className="w-full rounded-md border bg-muted/30 border-border/50 focus:border-neon-cyan/50 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-neon-cyan/50"
                    required
                    disabled={isSending}
                  />
                </div>

                {error && (
                  <p className="text-xs text-destructive font-mono animate-pulse">{error}</p>
                )}

                <Button type="submit" className="w-full gap-2 neon-glow hover:shadow-neon-lg transition-all" disabled={isSending}>
                  <Send size={16} /> {isSending ? t("common.loading") : t("contact.send_button")}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

