import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Type } from "lucide-react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput = ({ value, onChange }: TextInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="text-input" className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          Text Input
        </Label>
        <Badge variant="secondary" className="text-xs">
          {value.length} characters
        </Badge>
      </div>
      <Textarea
        id="text-input"
        placeholder="Enter text to convert to Braille..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[150px] resize-none"
      />
    </div>
  );
};
