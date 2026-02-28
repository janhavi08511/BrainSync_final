import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioPlayerProps {
  text: string;
}

export const AudioPlayer = ({ text }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const handlePlay = () => {
    if (!text) {
      toast({
        title: 'No text',
        description: 'Please enter text first',
        variant: 'destructive',
      });
      return;
    }

    if (isPlaying) {
      // Stop current speech
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (event) => {
      setIsPlaying(false);
      toast({
        title: 'Error',
        description: `Speech synthesis error: ${event.error}`,
        variant: 'destructive',
      });
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Audio Playback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={handlePlay}
            disabled={!text}
            className="flex-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
          {isPlaying && (
            <Button
              onClick={handleStop}
              variant="outline"
              size="icon"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
