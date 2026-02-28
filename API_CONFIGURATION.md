# External API Configuration Guide

This document outlines all external APIs used by BrainSync and how to configure them.

## Summary

| Feature | API | Status | Required | Fallback |
|---------|-----|--------|----------|----------|
| **Text-to-Speech (TTS)** | appmedo.com | ⚠️ May be down | No | Returns silent audio |
| **Speech-to-Text (STT)** | appmedo.com | ⚠️ May be down | No | Returns placeholder text |
| **Image OCR** | api.ocr.space | ✅ Working | No | N/A |
| **Grammar Check** | languagetool.org | ✅ Working | No | N/A |
| **Text Summarization** | HuggingFace | ⚠️ Requires token | No | Local sentence-based summary |
| **Authentication** | Supabase | ✅ Configurable | Yes | Backend in-memory auth |
| **Database** | MongoDB | ⚠️ Optional | No | In-memory (dev mode) |

## Detailed Configuration

### 1. **Text-to-Speech (TTS)** - Optional
Currently configured with appmedo.com integration.

**File:** `src/services/api.ts`
- API URL: `https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-wL1znZBlexBY/v1/audio/speech`
- Current Key: Hardcoded (may be expired)

**Fallback Behavior:** If API fails, returns a minimal silent MP3 blob. The app won't crash.

**To use a different TTS provider:**
```typescript
// Update TTS_API_URL and TTS_API_KEY in src/services/api.ts
const TTS_API_URL = "https://your-tts-provider.com/api/speech";
const TTS_API_KEY = "your-api-key";
```

### 2. **Speech-to-Text (STT)** - Optional
Currently configured with appmedo.com integration.

**File:** `src/services/api.ts`
- API URL: `https://api-integrations.appmedo.com/app-8amgmr6rpywx/api-Xa6JZJO25zqa/v1/audio/transcriptions`
- Current Key: Hardcoded (may be expired)

**Fallback Behavior:** If API fails, returns a placeholder message: `[Audio transcription unavailable - please check STT API configuration]`

**To use a different STT provider:**
```typescript
// Update STT_API_URL and STT_API_KEY in src/services/api.ts
const STT_API_URL = "https://your-stt-provider.com/api/transcribe";
const STT_API_KEY = "your-api-key";
```

### 3. **Image OCR** - Optional (Free)
Uses **api.ocr.space** with free tier API key.

**File:** `src/services/api.ts`
- API URL: `https://api.ocr.space/parse/image`
- API Key: `K87649693488957` (free tier - limited requests)

**Status:** Should work without issues.

**To increase OCR limits:**
Get your own free API key from https://ocr.space/ocrapi and update:
```typescript
const OCR_API_KEY = "your-ocr-api-key";
```

### 4. **Grammar Check** - Optional (Free)
Uses **LanguageTool** API (no authentication required).

**File:** `src/services/api.ts`
- API URL: `https://api.languagetool.org/v2/check`
- Status: Free public API

**Status:** Should work without any configuration.

### 5. **Text Summarization** - Optional
Uses **HuggingFace** inference API.

**File:** `src/services/api.ts`
- Environment Variable: `VITE_HF_TOKEN`
- Model: `facebook/bart-large-cnn`

**Fallback Behavior:** If token is missing or API fails, uses a local sentence-based summarization algorithm.

**To enable HuggingFace summarization:**
1. Get a free API token from https://huggingface.co/settings/tokens
2. Add to `.env` file:
   ```env
   VITE_HF_TOKEN=hf_your_token_here
   ```
3. Restart the frontend dev server


```

**Fallback Behavior:** Currently not hooked up to Supabase in the backend. Authentication uses the FastAPI `/auth/signup` and `/auth/login` endpoints with in-memory or MongoDB storage.

### 7. **Database (MongoDB)**
A running MongoDB server is required; by default the code connects to whatever is
specified in `MONGODB_URL`.

The `USE_IN_MEMORY_DB` flag still exists for convenience, but its default value is
`false` and you should leave it that way in production.  The in-memory fallback
should only be enabled for quick experiments and will lose all data when the
backend process stops.

**Configuration Files:**
- `backend/.env`: set `MONGODB_URL` to your connection string (no default is provided)
- `backend/config.py`: `use_in_memory_db: bool = False`

**To override and run in-memory:**
1. Set `USE_IN_MEMORY_DB=true` in `backend/.env`
2. Restart the backend

This is not recommended outside of isolated development tests.

## Testing External APIs

### Test OCR
```bash
# Upload an image via the UI to test
# Or use curl:
curl -X POST "https://api.ocr.space/parse/image" \
  -F "file=@image.jpg" \
  -F "apikey=K87649693488957"
```

### Test Grammar Check
```bash
curl -X POST "https://api.languagetool.org/v2/check" \
  -d "text=This are a test." \
  -d "language=en-US"
```

### Test TTS / STT
Try using the microphone or audio upload features in the app. Check the browser console for error messages.

## Troubleshooting

### "Text-to-speech request failed"
- The TTS API is temporarily unavailable
- The app will use a fallback (silent audio) - this is intentional for development
- To enable TTS, configure a valid TTS provider

### "Speech-to-text error"
- The STT API is temporarily unavailable
- A placeholder text will be returned instead
- To enable STT, configure a valid STT provider (e.g., OpenAI Whisper, Google Cloud Speech-to-Text)

### "HuggingFace API unavailable"
- The token might be missing or invalid
- Check that `VITE_HF_TOKEN` is set in `.env`
- A local sentence-based summary will be used as fallback

### "Failed to extract text from image"
- The OCR API might be rate-limited (free tier: 25,000 requests/month)
- Get your own free OCR key from https://ocr.space/ocrapi

## Recommended Setup for Development

For a fully functional development environment without external API costs:

**.env (frontend)**
```env
VITE_API_URL=http://localhost:8000
```

**backend/.env**
```env
MONGODB_URL=mongodb://localhost:27017
USE_IN_MEMORY_DB=true
DEBUG=false
```

**Result:**
- ✅ Auth works (in-memory)
- ✅ Braille conversion works (local)
- ✅ Translations history works (in-memory)
- ✅ OCR works (free tier)
- ✅ Grammar check works (free tier)
- ⚠️ TTS/STT fall back gracefully
- ⚠️ Summarization uses local fallback

All features are available, with graceful degradation for cloud APIs that aren't configured.

## Production Checklist

- [ ] Set up real MongoDB (Atlas recommended)
- [ ] Configure Supabase for authentication
- [ ] Add valid TTS/STT provider (OpenAI, Google, Amazon, etc.)
- [ ] Add HuggingFace token for summarization
- [ ] Set strong `SECRET_KEY` in backend `.env`
- [ ] Disable debug mode (`DEBUG=false`)
- [ ] Set correct `FRONTEND_URL` for CORS
- [ ] Test all API endpoints before deployment
