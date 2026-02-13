import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";

interface Testimonial {
  id?: string;
  quote: string;
  name: string;
  role: string;
  sort_order: number;
}

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("testimonials").select("*").order("sort_order").then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    for (const item of items) {
      if (item.id) {
        await supabase.from("testimonials").update(item).eq("id", item.id);
      } else {
        const { data } = await supabase.from("testimonials").insert(item).select().single();
        if (data) item.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const addItem = () => {
    setItems([...items, { quote: "", name: "", role: "", sort_order: items.length }]);
  };

  const removeItem = async (i: number) => {
    const item = items[i];
    if (item.id) await supabase.from("testimonials").delete().eq("id", item.id);
    setItems(items.filter((_, idx) => idx !== i));
  };

  const update = (i: number, key: keyof Testimonial, value: any) => {
    const updated = [...items];
    (updated[i] as any)[key] = value;
    setItems(updated);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Testimonials / Quotes</h1>
        <Button onClick={addItem} className="gap-2"><Plus size={16} /> Add Quote</Button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-start justify-between gap-2">
              <textarea
                value={item.quote}
                onChange={(e) => update(i, "quote", e.target.value)}
                rows={3}
                placeholder="Quote text..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm italic"
              />
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive shrink-0"><Trash2 size={16} /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={item.name} onChange={(e) => update(i, "name", e.target.value)} placeholder="Author name" />
              <Input value={item.role} onChange={(e) => update(i, "role", e.target.value)} placeholder="Role / Title" />
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

export default AdminTestimonials;
