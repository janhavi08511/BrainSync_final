import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  Check,
  Download,
  CheckCircle2,
  XCircle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Eye,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    try {
      await navigator.clipboard.writeText(brailleText);
      setCopied(true);

      // Add success animation to button
      const button = document.activeElement as HTMLElement;
      if (button) {
        button.classList.add("success-pulse");
        setTimeout(() => button.classList.remove("success-pulse"), 600);
      }

      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Copied</span>
          </div>
        ),
        description: "Braille text copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>Error</span>
          </div>
        ),
        description:
          "Failed to copy text. Please try again or check clipboard permissions.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (format: "txt" | "brf") => {
    try {
      const blob = new Blob([brailleText], {
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
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span>Downloaded</span>
          </div>
        ),
        description: `Braille text downloaded as .${format} file`,
      });
    } catch (error) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>Error</span>
          </div>
        ),
        description:
          "Failed to download file. Please check your browser permissions and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg font-semibold">
            Braille Output
          </CardTitle>
          {brailleText && (
            <Badge variant="secondary" className="text-xs">
              {brailleText.length} characters
            </Badge>
          )}
        </div>
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDots(!showDots)}
                  disabled={!brailleText}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle dot visualization</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cycleBrailleSize}
                  disabled={!brailleText}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Change Braille size ({brailleSize})</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFocusMode(true)}
                  disabled={!brailleText}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Focus Mode (fullscreen)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!brailleText}
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Braille text to clipboard</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!brailleText}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download as .txt or .brf file</p>
                </TooltipContent>
              </Tooltip>
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
          {brailleText ? (
            <div
              className={`${sizeClasses[brailleSize]} leading-relaxed break-all font-mono transition-all duration-300`}
            >
              {showDots ? (
                <div className="grid gap-4">
                  {brailleText.split("").map((char, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 p-2 bg-background rounded border"
                    >
                      <span>{char}</span>
                      <span className="text-xs text-muted-foreground">⠿</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="braille-text">{brailleText}</p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              Braille output will appear here...
            </p>
          )}
        </div>
      </CardContent>

      {/* Focus Mode Dialog */}
      <Dialog open={focusMode} onOpenChange={setFocusMode}>
        <DialogContent className="max-w-screen-xl w-full h-[90vh] p-8">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Focus Mode</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={cycleBrailleSize}>
                  <ZoomIn className="w-4 h-4 mr-2" />
                  {brailleSize}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDots(!showDots)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {showDots ? "Hide" : "Show"} Dots
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFocusMode(false)}
                >
                  <Minimize2 className="w-4 h-4 mr-2" />
                  Exit
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-muted rounded-lg">
              <div
                className={`${sizeClasses[brailleSize]} leading-relaxed font-mono text-center`}
              >
                {showDots ? (
                  <div className="flex flex-wrap justify-center gap-4">
                    {brailleText.split("").map((char, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border-2 shadow-sm"
                      >
                        <span className="text-6xl">{char}</span>
                        <span className="text-sm text-muted-foreground">
                          ⠿ Pattern
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="braille-text">{brailleText}</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
