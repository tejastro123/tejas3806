import { useState, useEffect } from "react";
import { apiClient } from "@/services/api/apiClient";

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
        apiClient.from("personal_info").select("*").single(),
        apiClient.from("experience").select("*").order("sort_order", { ascending: true }),
        apiClient.from("projects").select("*").order("sort_order", { ascending: true }),
        apiClient.from("skills").select("*").order("sort_order", { ascending: true })
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
