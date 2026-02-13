import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Mail, MailOpen, Trash2, Calendar, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== id));
      toast({
        title: "Deleted",
        description: "Message has been removed.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Messages</h1>
          <p className="text-muted-foreground">Inquiries from your portfolio contact form.</p>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm" disabled={loading}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center p-20 glass neon-border rounded-2xl">
          <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-xl font-bold">No messages yet</h3>
          <p className="text-muted-foreground">When someone contacts you, their message will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`glass neon-border rounded-2xl p-6 transition-all ${!m.is_read ? 'border-neon-cyan/50 bg-neon-cyan/5' : 'opacity-80'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!m.is_read ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-muted text-muted-foreground'}`}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {m.name}
                      {!m.is_read && <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />}
                    </h3>
                    <p className="text-sm text-muted-foreground font-mono">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {new Date(m.created_at).toLocaleDateString()} {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-neon-cyan hover:bg-neon-cyan/10"
                      onClick={() => toggleRead(m.id, m.is_read)}
                      title={m.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {m.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => deleteMessage(m.id)}
                      title="Delete inquiry"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-sm leading-relaxed">
                {m.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
