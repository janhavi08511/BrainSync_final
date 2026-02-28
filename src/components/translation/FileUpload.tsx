import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
}

export const FileUpload = ({ onTextExtracted }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
        toast({
          title: "Invalid file type",
          description: "Please select a text file (.txt)",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a text file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await selectedFile.text();
      if (text) {
        onTextExtracted(text);
        toast({
          title: "Success",
          description: "Text loaded from file successfully",
        });
        setSelectedFile(null);
      } else {
        toast({
          title: "Empty file",
          description: "The file appears to be empty",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to read text file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Text File Upload
      </Label>
      <div className="flex gap-2">
        <input
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
        >
          <Upload className="w-4 h-4" />
          {selectedFile ? selectedFile.name : "Choose Text File"}
        </label>
        <Button onClick={handleUpload} disabled={!selectedFile || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            "Load Text"
          )}
        </Button>
      </div>
    </div>
  );
};
