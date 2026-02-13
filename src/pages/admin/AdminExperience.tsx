import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";

interface ExpItem {
  id?: string;
  type: string;
  title: string;
  org: string;
  date: string;
  location: string;
  description: string;
  skills: string[];
  sort_order: number;
}

const blankItem: ExpItem = {
  type: "work",
  title: "",
  org: "",
  date: "",
  location: "",
  description: "",
  skills: [],
  sort_order: 0,
};

const AdminExperience = () => {
  const [items, setItems] = useState<ExpItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase
      .from("experience")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setItems(data);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");

    for (const item of items) {
      if (item.id) {
        await supabase.from("experience").update(item).eq("id", item.id);
      } else {
        const { data } = await supabase.from("experience").insert(item).select().single();
        if (data) item.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const addItem = () => {
    setItems([...items, { ...blankItem, sort_order: items.length }]);
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    if (item.id) {
      await supabase.from("experience").delete().eq("id", item.id);
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const update = (index: number, key: keyof ExpItem, value: any) => {
    const updated = [...items];
    (updated[index] as any)[key] = value;
    setItems(updated);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Experience</h1>
        <Button onClick={addItem} className="gap-2">
          <Plus size={16} /> Add Entry
        </Button>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical size={16} className="text-muted-foreground" />
                <select
                  value={item.type}
                  onChange={(e) => update(i, "type", e.target.value)}
                  className="text-sm rounded-md border bg-background px-2 py-1"
                  aria-label="Experience type"
                >
                  <option value="work">Work</option>
                  <option value="education">Education</option>
                  <option value="research">Research</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
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
                <label className="text-xs text-muted-foreground">Organization</label>
                <Input value={item.org} onChange={(e) => update(i, "org", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <Input value={item.date} onChange={(e) => update(i, "date", e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Location</label>
                <Input value={item.location} onChange={(e) => update(i, "location", e.target.value)} className="mt-1" />
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

            <div>
              <label className="text-xs text-muted-foreground">Skills (comma-separated)</label>
              <Input
                value={item.skills.join(", ")}
                onChange={(e) => update(i, "skills", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                className="mt-1"
              />
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

export default AdminExperience;
