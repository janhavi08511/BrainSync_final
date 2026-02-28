// base URL for backend API; use environment variable with a fallback
import type { Translation, TranslationStats } from "@/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem("access_token")}`
});

export const saveTranslation = async (
  inputText: string, 
  brailleOutput: string, 
  inputMethod: string
) => {
  const res = await fetch(`${API_URL}/translations/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({
      source_text: inputText,
      translated_text: brailleOutput,
      braille_output: brailleOutput,
      translation_type: inputMethod,
      audio_file_url: null,
      image_file_url: null
    })
  });
  return res.ok ? await res.json() : null;
};

// fetch a list of translations; optional limit and search query
export const getTranslations = async (limit?: number, search?: string): Promise<Translation[]> => {
  const params = new URLSearchParams();
  if (limit) params.append("limit", limit.toString());
  if (search) params.append("search", search);
  const url = `${API_URL}/translations/${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) return [];
  return (await res.json()) as any[];
};

// get aggregated statistics from backend; fall back to client computation
export const getTranslationStats = async (): Promise<TranslationStats> => {
  const res = await fetch(`${API_URL}/translations/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const all = await getTranslations();
    const stats = {
      total: all.length,
      byMethod: {
        text: 0,
        image: 0,
        audio: 0,
        microphone: 0,
        file: 0,
        braille: 0,
      },
    } as any;
    all.forEach((t) => {
      const method = t.translation_type || t.input_method || "text";
      if (stats.byMethod[method] !== undefined) {
        stats.byMethod[method]++;
      }
    });
    return stats;
  }
  return (await res.json()) as any;
};

// delete a translation by its id
export const deleteTranslation = async (id: string) => {
  const res = await fetch(`${API_URL}/translations/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return res.ok;
};

// perform a search using backend query if supported, otherwise client-side filter
export const searchTranslations = async (query: string) => {
  const results = await getTranslations(undefined, query);
  if (results.length) return results;
  const all = await getTranslations();
  const q = query.toLowerCase();
  return all.filter(
    (t) =>
      (t.input_text && t.input_text.toLowerCase().includes(q)) ||
      (t.braille_output && t.braille_output.toLowerCase().includes(q))
  );
};