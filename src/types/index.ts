export interface Translation {
  id: string; // MongoDB _id converted to string
  user_id?: string;
  source_text?: string;
  input_text?: string; // fallback for old data
  translated_text?: string;
  braille_output?: string;
  translation_type?: "text" | "image" | "audio" | "microphone" | "file" | "braille";
  input_method?: "text" | "image" | "audio" | "microphone" | "file" | "braille"; // alias for compatibility
  created_at?: string;
  updated_at?: string;
}

export interface TranslationStats {
  total: number;
  byMethod: {
    text: number;
    image: number;
    audio: number;
    microphone: number;
    file: number;
    braille: number;
  };
}