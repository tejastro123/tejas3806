import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

const AdminHero = () => {
  const [data, setData] = useState({
    id: "",
    name: "",
    role: "",
    email: "",
    location: "",
    avatar: "",
    bio_tagline: "",
    bio_short: "",
    bio_long: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase
      .from("personal_info")
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
      const { error } = await supabase
        .from("personal_info")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", data.id);
      setMsg(error ? `❌ ${error.message}` : "✅ Saved!");
    } else {
      const { data: newRow, error } = await supabase
        .from("personal_info")
        .insert({ ...data })
        .select()
        .single();
      if (newRow) setData(newRow);
      setMsg(error ? `❌ ${error.message}` : "✅ Created!");
    }
    setSaving(false);
  };

  const field = (label: string, key: keyof typeof data, type = "text") => (
    <div key={key}>
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Input
        value={data[key]}
        onChange={(e) => setData({ ...data, [key]: e.target.value })}
        type={type}
        className="mt-1"
      />
    </div>
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Hero / Personal Info</h1>

      <div className="space-y-4">
        {field("Full Name", "name")}
        {field("Role / Title", "role")}
        {field("Email", "email", "email")}
        {field("Location", "location")}
        {field("Avatar URL", "avatar")}
        {field("Tagline", "bio_tagline")}

        <div>
          <label className="text-sm font-medium text-muted-foreground">Short Bio</label>
          <textarea
            value={data.bio_short}
            onChange={(e) => setData({ ...data, bio_short: e.target.value })}
            rows={3}
            className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Full Bio</label>
          <textarea
            value={data.bio_long}
            onChange={(e) => setData({ ...data, bio_long: e.target.value })}
            rows={5}
            className="w-full mt-1 rounded-md border bg-background px-3 py-2 text-sm"
          />
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

export default AdminHero;
