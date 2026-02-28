import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Music, Upload, Loader2 } from 'lucide-react';
import { transcribeAudio } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadProps {
  onTextExtracted: (text: string) => void;
}

export const AudioUpload = ({ onTextExtracted }: AudioUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an audio file',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Audio file must be smaller than 100MB',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an audio file first',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await transcribeAudio(selectedFile);
      if (text) {
        onTextExtracted(text);
        toast({
          title: 'Success',
          description: 'Audio transcribed successfully',
        });
        setSelectedFile(null);
      } else {
        toast({
          title: 'No speech found',
          description: 'Could not transcribe audio',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to transcribe audio',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Music className="w-4 h-4" />
        Audio Upload
      </Label>
      <div className="flex gap-2">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
        >
          <Upload className="w-4 h-4" />
          {selectedFile ? selectedFile.name : 'Choose Audio'}
        </label>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Transcribing...
            </>
          ) : (
            'Transcribe'
          )}
        </Button>
      </div>
    </div>
  );
};
