import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";

interface FunFact {
  icon_name: string;
  text: string;
}

const AdminAbout = () => {
  const [data, setData] = useState({
    id: "",
    heading: "",
    content: "",
    fun_facts: [] as FunFact[],
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiClient
      .from("about")
      .select("*")
      .limit(1)
      .single()
      .then(({ data: row }) => {
        if (row) setData(row);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    if (data.id) {
      const { error } = await apiClient
        .from("about")
        .update({ heading: data.heading, content: data.content, fun_facts: data.fun_facts, updated_at: new Date().toISOString() })
        .eq("id", data.id);
      setMsg(error ? `❌ ${error.message}` : "✅ Saved!");
    } else {
      const { data: newRow, error } = await apiClient.from("about").insert(data).select().single();
      if (newRow) setData(newRow);
      setMsg(error ? `❌ ${error.message}` : "✅ Created!");
    }
    setSaving(false);
  };

  const addFact = () => {
    setData({ ...data, fun_facts: [...data.fun_facts, { icon_name: "Rocket", text: "" }] });
  };

  const removeFact = (i: number) => {
    setData({ ...data, fun_facts: data.fun_facts.filter((_, idx) => idx !== i) });
  };

  const updateFact = (i: number, key: keyof FunFact, value: string) => {
    const updated = [...data.fun_facts];
    updated[i] = { ...updated[i], [key]: value };
    setData({ ...data, fun_facts: updated });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">About Me</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Section Heading</label>
          <Input value={data.heading} onChange={(e) => setData({ ...data, heading: e.target.value })} className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Content</label>
          <textarea
            value={data.content}
            onChange={(e) => setData({ ...data, content: e.target.value })}
            rows={4}
            className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-muted-foreground">Fun Facts</label>
            <Button variant="outline" size="sm" onClick={addFact} className="gap-1">
              <Plus size={14} /> Add
            </Button>
          </div>
          <div className="space-y-3">
            {data.fun_facts.map((fact, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input
                  value={fact.icon_name}
                  onChange={(e) => updateFact(i, "icon_name", e.target.value)}
                  placeholder="Icon (e.g. Rocket)"
                  className="w-32"
                />
                <Input
                  value={fact.text}
                  onChange={(e) => updateFact(i, "text", e.target.value)}
                  placeholder="Fun fact text"
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFact(i)} className="text-destructive shrink-0">
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </Button>
        {msg && <span className="text-sm font-medium">{msg}</span>}
      </div>
    </div>
  );
};

export default AdminAbout;
