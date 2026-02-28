import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInput } from "@/components/translation/TextInput";
import { ImageUpload } from "@/components/translation/ImageUpload";
import { AudioUpload } from "@/components/translation/AudioUpload";
import { MicrophoneInput } from "@/components/translation/MicrophoneInput";
import { FileUpload } from "@/components/translation/FileUpload";
import { BrailleInput } from "@/components/translation/BrailleInput";
import { BrailleDisplay } from "@/components/translation/BrailleDisplay";
import { AudioPlayer } from "@/components/translation/AudioPlayer";
import { Switch } from "@/components/ui/switch"; 
import { textToBraille, brailleToText } from "@/utils/braille";
import { saveTranslation } from "@/db/api";
import { fixGrammar, summarizeText } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Trash2, 
  ArrowRightLeft, 
  Wand2, 
  AlignLeft, 
  Loader2 
} from "lucide-react";

export default function TranslationPage() {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as
    | "text" | "image" | "audio" | "microphone" | "file" | null;

  const [inputText, setInputText] = useState("");
  const [brailleText, setBrailleText] = useState("");
  const [reverseMode, setReverseMode] = useState(false);
  const [isGrade2, setIsGrade2] = useState(false); //
  const [isProcessing, setIsProcessing] = useState(false); //
  const [currentMethod, setCurrentMethod] = useState<
    "text" | "image" | "audio" | "microphone" | "file" | "braille"
  >(tabFromUrl || "text");
  const { toast } = useToast();

  // Integrated Grade-2 logic into the translation effect
  useEffect(() => {
    if (reverseMode) {
      if (brailleText) {
        const text = brailleToText(brailleText);
        setInputText(text);
      } else {
        setInputText("");
      }
    } else {
      if (inputText) {
        // Now passes the isGrade2 flag to the utility
        const braille = textToBraille(inputText, isGrade2);
        setBrailleText(braille);
      } else {
        setBrailleText("");
      }
    }
  }, [inputText, brailleText, reverseMode, isGrade2]);

  const handleFixGrammar = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    try {
      const fixed = await fixGrammar(inputText); // Calls updated api.ts
      setInputText(fixed);
      toast({ title: "Grammar Fixed", description: "Suggestions applied successfully." });
    } catch (error) {
      toast({ title: "Check Failed", description: "Grammar service error.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

 //
const handleSummarize = async () => {
  if (!inputText) return;
  setIsProcessing(true);
  try {
    const summary = await summarizeText(inputText); // Calls the helper in api.ts
    
    if (summary === inputText) {
      toast({ 
        title: "Summarization Busy", 
        description: "The AI model is waking up. Please try again in a few seconds.", 
        variant: "destructive" 
      });
    } else {
      setInputText(summary); // This triggers the Braille regeneration
      toast({ 
        title: "Summarized", 
        description: "Text condensed successfully." 
      });
    }
  } catch (error) {
    toast({ 
      title: "Summary Failed", 
      description: "Could not process document summary.", 
      variant: "destructive" 
    });
  } finally {
    setIsProcessing(false);
  }
};

  const handleTextExtracted = (text: string, method: "image" | "audio" | "microphone" | "file") => {
    setInputText(text);
    setCurrentMethod(method);
  };

  const handleBrailleInput = (braille: string) => {
    setBrailleText(braille);
    setCurrentMethod("braille");
  };

  const toggleMode = () => {
    setReverseMode(!reverseMode);
    setInputText("");
    setBrailleText("");
    setCurrentMethod(reverseMode ? "text" : "braille");
  };

  const handleSave = async () => {
    if (!inputText || !brailleText) return;
    const result = await saveTranslation(inputText, brailleText, currentMethod);
    if (result) {
      toast({ title: "Saved", description: "Translation saved to history" });
    }
  };

  const handleClear = () => {
    setInputText("");
    setBrailleText("");
    setCurrentMethod(reverseMode ? "braille" : "text");
  };

  return (
    <div className="min-h-screen gradient-mesh relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-10 fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="gradient-text text-shadow-soft">Translation Tool</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                {reverseMode ? "Convert Braille to text" : "Convert text to Braille"}
              </p>
            </div>
            <Button onClick={toggleMode} variant="outline" size="lg" className="gap-3 h-14 px-8 border-2">
              <ArrowRightLeft className="w-5 h-5" />
              {reverseMode ? "Text → Braille" : "Braille → Text"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            
{/* AI Enhancement Toolbar */}
{!reverseMode && (
  <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-card border-2 rounded-xl">
    <div className="flex gap-3">
      {/* Fix Grammar Button */}
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleFixGrammar}
        // Both buttons are disabled if isProcessing is true
        disabled={isProcessing || !inputText}
        className="gap-2"
      >
        {/* Both buttons show the loader if isProcessing is true */}
        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
        Fix Grammar
      </Button>

      {/* Summarize Button */}
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={handleSummarize}
        // Both buttons are disabled if isProcessing is true
        disabled={isProcessing || !inputText}
        className="gap-2"
      >
        {/* Both buttons show the loader if isProcessing is true */}
        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlignLeft className="w-4 h-4" />}
        Summarize
      </Button>
    </div>

    {/* Grade-2 Braille Switch */}
    <div className="flex items-center gap-3 px-2">
      <span className="text-sm font-medium text-muted-foreground">Grade-2 Braille</span>
      <Switch 
        checked={isGrade2} 
        onCheckedChange={setIsGrade2} 
        // Also disable the switch while the AI is processing
        disabled={isProcessing} 
      />
    </div>
  </div>
)}
            <Card className="glass-card border-2 hover:border-primary/30 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{reverseMode ? "Braille Input" : "Input"}</CardTitle>
              </CardHeader>
              <CardContent>
                {reverseMode ? (
                  <BrailleInput value={brailleText} onChange={handleBrailleInput} />
                ) : (
                  <Tabs defaultValue={tabFromUrl || "text"} value={currentMethod === "braille" ? "text" : currentMethod} onValueChange={(v) => setCurrentMethod(v as any)}>
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="file">File</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                      <TabsTrigger value="audio">Audio</TabsTrigger>
                      <TabsTrigger value="microphone">Mic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="mt-4">
                      <TextInput value={inputText} onChange={setInputText} />
                    </TabsContent>
                    <TabsContent value="file" className="mt-4">
                      <FileUpload onTextExtracted={(t) => handleTextExtracted(t, "file")} />
                    </TabsContent>
                    <TabsContent value="image" className="mt-4">
                      <ImageUpload onTextExtracted={(t) => handleTextExtracted(t, "image")} />
                    </TabsContent>
                    <TabsContent value="audio" className="mt-4">
                      <AudioUpload onTextExtracted={(t) => handleTextExtracted(t, "audio")} />
                    </TabsContent>
                    <TabsContent value="microphone" className="mt-4">
                      <MicrophoneInput onTextExtracted={(t) => handleTextExtracted(t, "microphone")} />
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>

            {reverseMode ? (
              <Card className="glass-card border-2 hover:border-primary/30 transition-all">
                <CardHeader className="pb-4"><CardTitle className="text-2xl">Text Output</CardTitle></CardHeader>
                <CardContent>
                  <div className="min-h-[180px] p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border-2">
                    {inputText ? <p className="text-xl leading-relaxed break-words">{inputText}</p> : <p className="text-muted-foreground text-center text-lg py-12">Converted text will appear here...</p>}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <BrailleDisplay brailleText={brailleText} />
            )}

            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={!brailleText || !inputText || isProcessing} className="btn-gradient flex-1 h-14 text-base">
                <Save className="w-5 h-5 mr-2" /> Save to History
              </Button>
              <Button onClick={handleClear} variant="outline" disabled={(!inputText && !brailleText) || isProcessing} className="h-14 px-8 border-2">
                <Trash2 className="w-5 h-5 mr-2" /> Clear
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {!reverseMode && <AudioPlayer text={inputText} />}
            <Card className="glass-card border-2 hover:border-primary/30 transition-all">
              <CardHeader className="pb-4"><CardTitle className="text-2xl">{reverseMode ? "Braille Preview" : "Input Preview"}</CardTitle></CardHeader>
              <CardContent>
                <div className="min-h-[120px] p-6 bg-gradient-to-br from-muted/50 to-muted rounded-xl border-2">
                  {reverseMode ? (brailleText ? <p className="text-4xl font-mono break-all">{brailleText}</p> : <p className="py-8 text-center text-muted-foreground">Braille input will appear here...</p>) : (inputText ? <p className="text-base leading-relaxed">{inputText}</p> : <p className="py-8 text-center text-muted-foreground">Input text will appear here...</p>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}