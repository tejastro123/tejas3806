import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";

interface Service {
  id?: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
}

const AdminServices = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("services").select("*").order("sort_order").then(({ data }) => {
      if (data) setItems(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    for (const item of items) {
      if (item.id) {
        await supabase.from("services").update(item).eq("id", item.id);
      } else {
        const { data } = await supabase.from("services").insert(item).select().single();
        if (data) item.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const addItem = () => {
    setItems([...items, { title: "", description: "", icon_name: "Globe", sort_order: items.length }]);
  };

  const removeItem = async (i: number) => {
    const item = items[i];
    if (item.id) await supabase.from("services").delete().eq("id", item.id);
    setItems(items.filter((_, idx) => idx !== i));
  };

  const update = (i: number, key: keyof Service, value: any) => {
    const updated = [...items];
    (updated[i] as any)[key] = value;
    setItems(updated);
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Button onClick={addItem} className="gap-2"><Plus size={16} /> Add Service</Button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <Input value={item.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Service title" className="flex-1 mr-2" />
              <Input value={item.icon_name} onChange={(e) => update(i, "icon_name", e.target.value)} placeholder="Icon" className="w-28 mr-2" />
              <Button variant="ghost" size="icon" onClick={() => removeItem(i)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>
            <textarea
              value={item.description}
              onChange={(e) => update(i, "description", e.target.value)}
              rows={2}
              placeholder="Service description..."
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
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

export default AdminServices;
