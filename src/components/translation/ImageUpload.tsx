import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image, Upload, Loader2 } from "lucide-react";
import { extractTextFromImage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
}

export const ImageUpload = ({ onTextExtracted }: ImageUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description:
            "Please select a valid image file (.jpg, .png, .gif, etc.)",
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
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromImage(selectedFile);
      if (text) {
        onTextExtracted(text);
        toast({
          title: "Success",
          description: "Text extracted from image successfully",
        });
        setSelectedFile(null);
      } else {
        toast({
          title: "No text found",
          description:
            "Could not find readable text in the image. Try a clearer image with better contrast.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process image. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Image className="w-4 h-4" />
        Image Upload
      </Label>
      <div className="flex gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
        >
          <Upload className="w-4 h-4" />
          {selectedFile ? selectedFile.name : "Choose Image"}
        </label>
        <Button onClick={handleUpload} disabled={!selectedFile || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Extract Text"
          )}
        </Button>
      </div>
    </div>
  );
};
