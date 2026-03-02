import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BrailleDisplayProps {
  brailleText: string;
}

export const BrailleDisplay = ({ brailleText }: BrailleDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [brailleSize, setBrailleSize] = useState<
    "small" | "medium" | "large" | "xlarge"
  >("medium");
  const [showDots, setShowDots] = useState(false);

  const { toast } = useToast();
  const safeText = brailleText ?? "";

  const sizeClasses = {
    small: "text-2xl",
    medium: "text-4xl",
    large: "text-6xl",
    xlarge: "text-8xl",
  };

  const cycleBrailleSize = () => {
    const sizes: Array<"small" | "medium" | "large" | "xlarge"> = [
      "small",
      "medium",
      "large",
      "xlarge",
    ];
    const currentIndex = sizes.indexOf(brailleSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setBrailleSize(sizes[nextIndex]);
  };

  const handleCopy = async () => {
    if (!safeText) return;

    try {
      await navigator.clipboard.writeText(safeText);
      setCopied(true);

      toast({
        title: "Copied",
        description: "Braille text copied to clipboard",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (format: "txt" | "brf") => {
    if (!safeText) return;

    const blob = new Blob([safeText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `braille-output.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `Downloaded as .${format}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <CardTitle>Braille Output</CardTitle>
          {safeText && (
            <Badge variant="secondary" className="text-xs">
              {safeText.length} characters
            </Badge>
          )}
        </div>

        <TooltipProvider>
          <div className="flex gap-2">
            {/* Toggle Dots */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDots(!showDots)}
                  disabled={!safeText}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle dot visualization</TooltipContent>
            </Tooltip>

            {/* Resize */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleBrailleSize}
                  disabled={!safeText}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Change size</TooltipContent>
            </Tooltip>

            {/* Focus */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFocusMode(true)}
                  disabled={!safeText}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Focus Mode</TooltipContent>
            </Tooltip>

            {/* Copy */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!safeText}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>

            {/* Download */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={!safeText}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownload("txt")}>
                  Download as .txt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("brf")}>
                  Download as .brf
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      </CardHeader>

      <CardContent>
        <div className="min-h-[150px] p-4 bg-muted rounded-lg">
          {safeText ? (
            <div
              className={`${sizeClasses[brailleSize]} leading-relaxed break-all font-mono`}
            >
              {showDots ? (
                <div className="flex flex-wrap gap-4">
                  {safeText.split("").map((char, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-2 bg-background rounded border"
                    >
                      <span>{char}</span>
                      <span className="text-xs text-muted-foreground">⠿</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>{safeText}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Braille output will appear here...
            </p>
          )}
        </div>
      </CardContent>

      {/* Focus Mode */}
      <Dialog open={focusMode} onOpenChange={setFocusMode}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-8">
          <div className="flex flex-col h-full">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold">Focus Mode</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFocusMode(false)}
              >
                <Minimize2 className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-muted rounded-lg text-center">
              <div
                className={`${sizeClasses[brailleSize]} font-mono leading-relaxed`}
              >
                {safeText}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};