import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface ComparisonViewProps {
  inputText: string;
  brailleText: string;
}

export const ComparisonView = ({
  inputText,
  brailleText,
}: ComparisonViewProps) => {
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const countChars = (text: string) => {
    return text.length;
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Input Text</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{countWords(inputText)} words</Badge>
              <Badge variant="outline">{countChars(inputText)} chars</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg max-h-96 overflow-auto">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {inputText || "No input text..."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card relative">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hidden md:flex">
          <ArrowRight className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Braille Output</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">{countChars(brailleText)} chars</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded-lg max-h-96 overflow-auto">
            <p className="text-4xl font-mono leading-relaxed break-all braille-text">
              {brailleText || "No Braille output..."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
