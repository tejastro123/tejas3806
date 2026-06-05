import { useEffect, useState } from "react";
import { apiClient } from "@/services/api/apiClient";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Save, Plus, Trash2, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import { RichTextEditor } from "@/shared/components/RichTextEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  date: string;
  read_time: string;
  excerpt: string;
  link: string;
  image: string;
  content: string;
  published: boolean;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const empty = (): BlogPost => ({
  title: "",
  slug: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  read_time: "5 min read",
  excerpt: "",
  link: "#",
  image: "",
  content: "",
  published: false,
});

const AdminBlog = () => {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTitle, setAiTitle] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!aiTitle.trim() || !aiPrompt.trim()) return;
    setIsAiGenerating(true);
    setMsg("🤖 AI is writing your technical article...");
    try {
      const response = await fetch("/api/ai/blog-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: aiTitle, prompt: aiPrompt })
      });
      const data = await response.json();
      if (data.content) {
        const newPost: BlogPost = {
          title: data.title,
          slug: data.slug,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          read_time: data.readTime || "5 min read",
          excerpt: data.excerpt,
          link: "#",
          image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
          content: data.content,
          published: false
        };
        setItems([newPost, ...items]);
        setActiveIdx(0);
        setShowAiModal(false);
        setAiTitle("");
        setAiPrompt("");
        setMsg("✅ Article generated! Review below and click Save.");
      } else {
        setMsg(`❌ Generation failed: ${data.error || "Unknown Error"}`);
      }
    } catch (err) {
      setMsg(`❌ Error: ${(err as Error).message}`);
    } finally {
      setIsAiGenerating(false);
      setTimeout(() => setMsg(""), 5000);
    }
  };

  useEffect(() => {
    apiClient
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as BlogPost[]);
      });
  }, []);

  const saveActive = async () => {
    if (activeIdx === null) return;
    const item = items[activeIdx];
    if (!item.title.trim()) {
      setMsg("⚠️ Title is required");
      return;
    }
    if (!item.slug.trim()) item.slug = slugify(item.title);
    setSaving(true);
    setMsg("");
    const payload = { ...item, updated_at: new Date().toISOString() };
    if (item.id) {
      const { error } = await apiClient.from("blog_posts").update(payload).eq("id", item.id);
      if (error) setMsg(`❌ ${error.message}`);
      else setMsg("✅ Saved");
    } else {
      const { data, error } = await apiClient
        .from("blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) setMsg(`❌ ${error.message}`);
      else if (data) {
        const next = [...items];
        next[activeIdx] = data as BlogPost;
        setItems(next);
        setMsg("✅ Created");
      }
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  const addItem = () => {
    setItems([empty(), ...items]);
    setActiveIdx(0);
  };

  const removeItem = async (i: number) => {
    if (!confirm("Delete this post?")) return;
    const item = items[i];
    if (item.id) await apiClient.from("blog_posts").delete().eq("id", item.id);
    setItems(items.filter((_, idx) => idx !== i));
    if (activeIdx === i) setActiveIdx(null);
  };

  const update = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) => {
    if (activeIdx === null) return;
    const next = [...items];
    next[activeIdx] = { ...next[activeIdx], [key]: value };
    if (key === "title" && !next[activeIdx].slug) {
      next[activeIdx].slug = slugify(value as string);
    }
    setItems(next);
  };

  const togglePublish = async (i: number) => {
    const item = items[i];
    if (!item.id) {
      setMsg("⚠️ Save the post before publishing");
      return;
    }
    const newPublished = !item.published;
    const { error } = await apiClient
      .from("blog_posts")
      .update({ published: newPublished, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    if (error) {
      setMsg(`❌ ${error.message}`);
    } else {
      const next = [...items];
      next[i] = { ...next[i], published: newPublished };
      setItems(next);
    }
  };

  const active = activeIdx !== null ? items[activeIdx] : null;

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6">
      {/* Sidebar list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <h1 className="text-2xl font-bold">Blog</h1>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" onClick={() => setShowAiModal(true)} className="gap-1 px-2 text-neon-pink hover:text-neon-pink/80 border-neon-pink/30">
              <Sparkles size={13} /> AI
            </Button>
            <Button size="sm" onClick={addItem} className="gap-1 px-2.5">
              <Plus size={14} /> New
            </Button>
          </div>
        </div>
        <div className="space-y-1 max-h-[70vh] overflow-auto">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground p-3">No posts yet</p>
          )}
          {items.map((p, i) => (
            <button
              key={p.id || i}
              onClick={() => setActiveIdx(i)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                activeIdx === i ? "bg-primary/10 border-primary" : "hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm flex-1 truncate">
                  {p.title || "(untitled)"}
                </span>
                {p.published ? (
                  <Eye size={12} className="text-green-500" />
                ) : (
                  <EyeOff size={12} className="text-muted-foreground" />
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 truncate">{p.slug}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        {active ? (
          <>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-xl font-semibold">
                {active.id ? "Edit Post" : "New Post"}
              </h2>
              <div className="flex items-center gap-2">
                {active.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(activeIdx!)}
                    className="gap-1"
                  >
                    {active.published ? (
                      <>
                        <EyeOff size={14} /> Unpublish
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> Publish
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(activeIdx!)}
                  className="text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
                <Button onClick={saveActive} disabled={saving} size="sm" className="gap-1">
                  <Save size={14} /> {saving ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>

            {msg && <p className="text-sm">{msg}</p>}

            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <Input
                value={active.title}
                onChange={(e) => update("title", e.target.value)}
                className="mt-1 text-lg font-semibold"
                placeholder="Post title"
                maxLength={200}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Slug</label>
                <Input
                  value={active.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  className="mt-1 font-mono text-xs"
                  maxLength={200}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date label</label>
                <Input
                  value={active.date}
                  onChange={(e) => update("date", e.target.value)}
                  className="mt-1"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Read time</label>
                <Input
                  value={active.read_time}
                  onChange={(e) => update("read_time", e.target.value)}
                  className="mt-1"
                  maxLength={50}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Cover image URL</label>
              <Input
                value={active.image}
                onChange={(e) => update("image", e.target.value)}
                className="mt-1"
                placeholder="https://…"
                maxLength={500}
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Excerpt</label>
              <textarea
                value={active.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Short summary shown on the blog cards"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Content</label>
              <RichTextEditor
                value={active.content}
                onChange={(html) => update("content", html)}
              />
            </div>
          </>
        ) : (
          <div className="border border-dashed rounded-xl p-12 text-center text-muted-foreground">
            Select a post to edit, or click <b>New</b> to create one.
          </div>
        )}
      </div>

      <Dialog open={showAiModal} onOpenChange={(open) => !open && setShowAiModal(false)}>
        <DialogContent className="glass-strong border border-neon-cyan/30 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-mono text-neon-cyan">
              <Sparkles className="text-neon-cyan animate-pulse" size={20} />
              AI Technical Writer
            </DialogTitle>
            <DialogDescription className="text-foreground/60 text-xs">
              Provide a title and a description prompt, and the AI will generate a complete technical blog post formatted in markdown.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs text-muted-foreground font-mono">Article Title</label>
              <Input
                value={aiTitle}
                onChange={(e) => setAiTitle(e.target.value)}
                placeholder="e.g. Advanced TypeScript Utility Types"
                className="mt-1 bg-black/40 border border-neon-cyan/20 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground font-mono">Guidelines / Topics to cover</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Explain Pick, Omit, Record, and ReturnType with real-world examples."
                className="w-full h-32 bg-black/40 border border-neon-cyan/20 rounded-md mt-1 p-3 text-sm font-mono text-white outline-none focus:border-neon-cyan/60 transition-all custom-scrollbar resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setShowAiModal(false)} disabled={isAiGenerating} className="text-foreground/75 hover:bg-white/5">
                Cancel
              </Button>
              <Button
                onClick={handleAiGenerate}
                disabled={isAiGenerating || !aiTitle.trim() || !aiPrompt.trim()}
                className="bg-neon-cyan hover:bg-neon-cyan/80 text-black font-semibold font-mono"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Writing Article...
                  </>
                ) : (
                  "Generate Post"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlog;
