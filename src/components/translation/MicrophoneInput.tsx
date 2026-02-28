import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mic, Square, Loader2 } from 'lucide-react';
import { transcribeAudio } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MicrophoneInputProps {
  onTextExtracted: (text: string) => void;
}

export const MicrophoneInput = ({ onTextExtracted }: MicrophoneInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        
        stream.getTracks().forEach(track => track.stop());
        
        setIsProcessing(true);
        try {
          const text = await transcribeAudio(audioFile);
          if (text) {
            onTextExtracted(text);
            toast({
              title: 'Success',
              description: 'Voice recorded and transcribed successfully',
            });
          } else {
            toast({
              title: 'No speech found',
              description: 'Could not transcribe the recording',
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to transcribe recording',
            variant: 'destructive',
          });
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({
        title: 'Recording started',
        description: 'Speak now...',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Mic className="w-4 h-4" />
        Microphone Input
      </Label>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        variant={isRecording ? 'destructive' : 'default'}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : isRecording ? (
          <>
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </>
        )}
      </Button>
    </div>
  );
};
