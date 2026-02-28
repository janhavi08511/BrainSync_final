import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);
const OCR_API_URL = "https://api.ocr.space/parse/image";
const OCR_API_KEY = "K87649693488957";

const STT_API_URL =
  "https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-Xa6JZJO25zqa/v1/audio/transcriptions";
const STT_API_KEY = "aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU";

const TTS_API_URL =
  "https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-wL1znZBlexBY/v1/audio/speech";
const TTS_API_KEY = "aoampOdNvwF3csAVKJNXX0h0KlQ2bDJU";

export const extractTextFromImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "eng");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");
  formData.append("filetype", file.type.split("/")[1] || "PNG");

  // Create abort controller with 30 second timeout
  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), 30000);

  try {
    const response = await fetch(OCR_API_URL, {
      method: "POST",
      headers: {
        apikey: OCR_API_KEY,
      },
      body: formData,
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OCR API error response:", errorText);
      throw new Error(`OCR request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.OCRExitCode === 1 || data.OCRExitCode === "1") {
      if (data.ParsedResults && data.ParsedResults.length > 0) {
        const result = data.ParsedResults[0];
        if (result.ErrorMessage && result.ErrorMessage.trim() !== "") {
          throw new Error(result.ErrorMessage);
        }
        const extractedText = result.ParsedText || "";
        if (extractedText.trim() === "") {
          throw new Error("No text detected in the image. Try a clearer image with better contrast.");
        }
        return extractedText.trim();
      }
    }
    throw new Error(data.ErrorMessage || "Failed to extract text from image.");
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort/timeout specifically
    if (error instanceof Error && error.name === "AbortError") {
      console.error("OCR request timed out");
      throw new Error("Image processing timed out. Please try a smaller image or simpler text.");
    }
    
    console.error("OCR error details:", error);
    throw error instanceof Error ? error : new Error("Failed to process image");
  } finally {
    clearTimeout(timeoutId);
  }
};

export const transcribeAudio = async (file: File): Promise<string> => {
  // Use Web Speech API for transcription (built-in browser)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioData = event.target?.result as ArrayBuffer;
      
      audioContext.decodeAudioData(
        audioData,
        (buffer) => {
          // Use Web Speech API to transcribe
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            
            let transcript = '';
            recognition.onresult = (event: any) => {
              for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
              }
            };
            
            recognition.onerror = (event: any) => {
              reject(new Error(`Speech recognition error: ${event.error}`));
            };
            
            recognition.onend = () => {
              resolve(transcript || '[No speech detected]');
            };
            
            recognition.start();
          } else {
            reject(new Error('Web Speech API not supported in this browser'));
          }
        },
        (error) => {
          reject(new Error(`Audio decode error: ${error.message}`));
        }
      );
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read audio file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Fallback transcription using native Whisper API if available
 */
export const transcribeAudioFallback = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("response_format", "json");

  try {
    const response = await fetch(STT_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STT_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Speech-to-text request failed");
    }

    const data = await response.json();
    return data.text || "";
  } catch (error) {
    console.error("Speech-to-text error:", error);
    throw error;
  }
};

export const textToSpeech = async (text: string, voice = "alloy"): Promise<Blob> => {
  // Deprecated: AudioPlayer now uses Web Speech API directly
  // This function is kept for backwards compatibility only
  throw new Error("textToSpeech blob recording is no longer supported. Use Web Speech API directly.");
};

/**
 * Alternative TTS using external API 
 * Note: External TTS API (lemonfox.ai) requires valid credentials
 * AudioPlayer now uses browser Web Speech API directly instead
 */
export const textToSpeechAPI = async (text: string, voice = "alloy"): Promise<Blob> => {
  try {
    const response = await fetch(TTS_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TTS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: text,
        voice: voice,
        response_format: "mp3",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Text-to-speech request failed");
    }

    return await response.blob();
  } catch (error) {
    console.error("Text-to-speech API error:", error);
    throw error;
  }
};

export const checkGrammar = async (text: string) => {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('language', 'en-US');

  const response = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  return await response.json(); 
};

/**
 * NEW: Automated fix helper for Grammar
 * Applies the first suggestion for every grammatical error found.
 */
export const fixGrammar = async (text: string): Promise<string> => {
  const data = await checkGrammar(text);
  let fixedText = text;
  
  // Apply matches in reverse order so character offsets remain valid
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

export const summarizeText = async (text: string): Promise<string> => {
  try {
    // Check if HF token is available
    if (!import.meta.env.VITE_HF_TOKEN) {
      console.warn("HuggingFace token not configured; using fallback summarization");
      return summarizeTextFallback(text);
    }

    const result = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: text,
      parameters: {
        max_length: 100,
        min_length: 30,
      }
    });

    // The library returns a simple object with the summary text
    return result.summary_text || text;
  } catch (error: any) {
    // If the model is loading (Error 503), the library helps manage the retry logic
    if (error.message?.includes("loading")) {
      console.warn("Model is loading, retrying in 3 seconds...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      return summarizeText(text);
    }
    
    console.error("Summarization error:", error);
    // Fall back to simple summarization instead of returning raw text
    return summarizeTextFallback(text);
  }
};

/**
 * Fallback summarization when HuggingFace API is unavailable
 * Returns the first ~150 chars or sentence-based truncation
 */
const summarizeTextFallback = (text: string): string => {
  if (!text) return "";
  
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const summaryCount = Math.max(1, Math.ceil(sentences.length / 3));
  const summary = sentences.slice(0, summaryCount).join(" ").trim();
  
  return summary || text.substring(0, 150) + "...";
};