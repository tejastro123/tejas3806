import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";

interface BlogPost {
  id?: string;
  title: string;
  date: string;
  read_time: string;
  excerpt: string;
  link: string;
  image: string;
}

const AdminBlog = () => {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    for (const item of items) {
      if (item.id) {
        await supabase.from("blog_posts").update(item).eq("id", item.id);
      } else {
        const { data } = await supabase.from("blog_posts").insert(item).select().single();
        if (data) item.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const addItem = () => {
    setItems([{ title: "", date: "", read_time: "", excerpt: "", link: "#", image: "" }, ...items]);
  };

  const removeItem = async (i: number) => {
    const item = items[i];
    if (item.id) await supabase.from("blog_posts").delete().eq("id", item.id);
    setItems(items.filter((_, idx) => idx !== i));
  };

  const update = (i: number, key: keyof BlogPost, value: string) => {
    const updated = [...items];
    (updated[i] as any)[key] = value;
    setItems(updated);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={addItem} className="gap-2"><Plus size={16} /> Add Post</Button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Blog title" className="flex-1 mr-2" />
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <Input value={item.date} onChange={(e) => update(i, "date", e.target.value)} placeholder="Feb 12, 2026" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Read Time</label>
                <Input value={item.read_time} onChange={(e) => update(i, "read_time", e.target.value)} placeholder="5 min read" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Link</label>
                <Input value={item.link} onChange={(e) => update(i, "link", e.target.value)} placeholder="https://..." className="mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Image URL</label>
              <Input value={item.image} onChange={(e) => update(i, "image", e.target.value)} placeholder="https://images.unsplash.com/..." className="mt-1" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Excerpt</label>
              <textarea
                value={item.excerpt}
                onChange={(e) => update(i, "excerpt", e.target.value)}
                rows={2}
                className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2"><Save size={16} /> {saving ? "Saving..." : "Save All"}</Button>
        {msg && <span className="text-sm font-medium">{msg}</span>}
      </div>
    </div>
  );
};

export default AdminBlog;
