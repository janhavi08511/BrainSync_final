import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BrailleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const BrailleInput = ({ value, onChange }: BrailleInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="braille-input">Enter Braille Text</Label>
      <Textarea
        id="braille-input"
        placeholder="Paste or type Braille characters here (e.g., ⠓⠑⠇⠇⠕)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px] text-3xl font-mono leading-relaxed"
      />
      <p className="text-xs text-muted-foreground">
        Supports Braille Unicode characters (⠀-⠿)
      </p>
    </div>
  );
};
