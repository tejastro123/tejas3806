import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2 } from "lucide-react";

interface SkillItem { name: string; level: number }
interface SkillCategory {
  id?: string;
  title: string;
  icon_name: string;
  items: SkillItem[];
  sort_order: number;
}

const AdminSkills = () => {
  const [cats, setCats] = useState<SkillCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    apiClient.from("skills").select("*").order("sort_order").then(({ data }) => {
      if (data) setCats(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    for (const cat of cats) {
      if (cat.id) {
        await apiClient.from("skills").update(cat).eq("id", cat.id);
      } else {
        const { data } = await apiClient.from("skills").insert(cat).select().single();
        if (data) cat.id = data.id;
      }
    }
    setMsg("✅ Saved!");
    setSaving(false);
  };

  const addCat = () => {
    setCats([...cats, { title: "", icon_name: "Code2", items: [], sort_order: cats.length }]);
  };

  const removeCat = async (i: number) => {
    const cat = cats[i];
    if (cat.id) await apiClient.from("skills").delete().eq("id", cat.id);
    setCats(cats.filter((_, idx) => idx !== i));
  };

  const updateCat = (i: number, key: string, value: any) => {
    const updated = [...cats];
    (updated[i] as any)[key] = value;
    setCats(updated);
  };

  const addSkill = (catIndex: number) => {
    const updated = [...cats];
    updated[catIndex].items.push({ name: "", level: 50 });
    setCats(updated);
  };

  const removeSkill = (catIndex: number, skillIndex: number) => {
    const updated = [...cats];
    updated[catIndex].items = updated[catIndex].items.filter((_, i) => i !== skillIndex);
    setCats(updated);
  };

  const updateSkill = (catIndex: number, skillIndex: number, key: keyof SkillItem, value: any) => {
    const updated = [...cats];
    (updated[catIndex].items[skillIndex] as any)[key] = value;
    setCats(updated);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button onClick={addCat} className="gap-2"><Plus size={16} /> Add Category</Button>
      </div>

      <div className="space-y-6">
        {cats.map((cat, ci) => (
          <div key={cat.id || ci} className="p-5 rounded-2xl border bg-background space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-1 mr-2">
                <Input value={cat.title} onChange={(e) => updateCat(ci, "title", e.target.value)} placeholder="Category title" />
                <Input value={cat.icon_name} onChange={(e) => updateCat(ci, "icon_name", e.target.value)} placeholder="Icon name" className="w-32" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCat(ci)} className="text-destructive"><Trash2 size={16} /></Button>
            </div>

            <div className="space-y-2 pl-4 border-l-2 border-primary/20">
              {cat.items.map((skill, si) => (
                <div key={si} className="flex gap-2 items-center">
                  <Input value={skill.name} onChange={(e) => updateSkill(ci, si, "name", e.target.value)} placeholder="Skill name" className="flex-1" />
                  <Input type="number" value={skill.level} onChange={(e) => updateSkill(ci, si, "level", parseInt(e.target.value) || 0)} className="w-20" min={0} max={100} />
                  <span className="text-xs text-muted-foreground w-4">%</span>
                  <Button variant="ghost" size="icon" onClick={() => removeSkill(ci, si)} className="text-destructive shrink-0"><Trash2 size={14} /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addSkill(ci)} className="gap-1 mt-1"><Plus size={12} /> Skill</Button>
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

export default AdminSkills;
