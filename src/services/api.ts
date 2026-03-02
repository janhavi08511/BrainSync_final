const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// 🎤 STT
export const transcribeAudio = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/ai/stt`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.text;
};

// 🖼 OCR
export const extractTextFromImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/ai/ocr`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.text;
};
// ===============================
// 🛠 Grammar Fix (LanguageTool)
// ===============================
export const fixGrammar = async (text: string): Promise<string> => {
  const params = new URLSearchParams();
  params.append("text", text);
  params.append("language", "en-US");

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await response.json();
  let fixedText = text;

  const matches = [...data.matches].reverse();

  for (const match of matches) {
    if (match.replacements && match.replacements.length > 0) {
      const replacement = match.replacements[0].value;
      fixedText =
        fixedText.substring(0, match.offset) +
        replacement +
        fixedText.substring(match.offset + match.length);
    }
  }

  return fixedText;
};
// ===============================
// ✂ Simple Text Summarization (Lightweight)
// ===============================
export const summarizeText = async (text: string): Promise<string> => {
  if (!text) return "";

  // Simple sentence-based summary (no external API)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const summaryCount = Math.max(1, Math.ceil(sentences.length / 3));

  return sentences.slice(0, summaryCount).join(" ").trim();
};