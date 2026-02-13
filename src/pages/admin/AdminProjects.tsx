import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { syncReposToSupabase } from "@/lib/githubSync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Github, Star, StarOff } from "lucide-react";

interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  demo: string;
  github: string;
  image: string;
  featured: boolean;
  sort_order: number;
}

const AdminProjects = () => {
  const [items, setItems] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchAll = () => {
    supabase
      .from("projects")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data);
      });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    for (const item of items) {
      if (item.id) {
        await supabase.from("projects").update(item).eq("id", item.id);
      } else {
        const { data } = await supabase.from("projects").insert(item).select().single();
        if (data) item.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const handleSync = async () => {
    setSyncing(true);
    setMsg("");
    try {
      const count = await syncReposToSupabase();
      setMsg(`✅ Synced ${count} repos!`);
      fetchAll();
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    }
    setSyncing(false);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        title: "",
        description: "",
        tags: [],
        category: "",
        demo: "#",
        github: "",
        image: "",
        featured: false,
        sort_order: items.length,
      },
    ]);
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    if (item.id) await supabase.from("projects").delete().eq("id", item.id);
    setItems(items.filter((_, i) => i !== index));
  };

  const update = (index: number, key: keyof Project, value: any) => {
    const updated = [...items];
    (updated[index] as any)[key] = value;
    setItems(updated);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} disabled={syncing} className="gap-2">
            <Github size={16} /> {syncing ? "Syncing..." : "Sync from GitHub"}
          </Button>
          <Button onClick={addItem} className="gap-2">
            <Plus size={16} /> Add Project
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => update(i, "featured", !item.featured)}
                className={`flex items-center gap-1 text-sm ${item.featured ? "text-yellow-500" : "text-muted-foreground"}`}
              >
                {item.featured ? <Star size={16} /> : <StarOff size={16} />}
                {item.featured ? "Featured" : "Not featured"}
              </button>
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive">
                <Trash2 size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Title</label>
                <Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Category</label>
                <Input value={item.category} onChange={(e) => update(i, "category", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">GitHub URL</label>
                <Input value={item.github} onChange={(e) => update(i, "github", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Demo URL</label>
                <Input value={item.demo} onChange={(e) => update(i, "demo", e.target.value)} className="mt-1" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => update(i, "description", e.target.value)}
                rows={2}
                className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Tags (comma-separated)</label>
                <Input
                  value={item.tags.join(", ")}
                  onChange={(e) => update(i, "tags", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Image URL</label>
                <Input value={item.image} onChange={(e) => update(i, "image", e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save size={16} /> {saving ? "Saving..." : "Save All"}
        </Button>
        {msg && <span className="text-sm font-medium">{msg}</span>}
      </div>
    </div>
  );
};

export default AdminProjects;
