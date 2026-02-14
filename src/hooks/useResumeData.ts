import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface ResumeData {
  personalInfo: any;
  experience: any[];
  projects: any[];
  skills: any[];
}

export const useResumeData = () => {
  const [data, setData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        { data: personalInfo },
        { data: experience },
        { data: projects },
        { data: skills }
      ] = await Promise.all([
        supabase.from("personal_info").select("*").single(),
        supabase.from("experience").select("*").order("sort_order", { ascending: true }),
        supabase.from("projects").select("*").order("sort_order", { ascending: true }),
        supabase.from("skills").select("*").order("sort_order", { ascending: true })
      ]);

      setData({
        personalInfo,
        experience: experience || [],
        projects: projects || [],
        skills: skills || []
      });
    } catch (err: any) {
      console.error("Error fetching resume data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refresh: fetchData };
};
