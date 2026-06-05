import { useEffect, useState } from "react";
import { apiClient } from "@/services/api/apiClient";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Save, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { RichTextEditor } from "@/shared/components/RichTextEditor";

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blog</h1>
          <Button size="sm" onClick={addItem} className="gap-1">
            <Plus size={14} /> New
          </Button>
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
    </div>
  );
};

export default AdminBlog;
