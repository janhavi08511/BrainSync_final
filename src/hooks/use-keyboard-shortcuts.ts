import { useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[]) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch =
          shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch =
          shortcut.shiftKey === undefined ||
          shortcut.shiftKey === event.shiftKey;
        const altMatch =
          shortcut.altKey === undefined || shortcut.altKey === event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};

export const useTranslationShortcuts = (
  brailleText: string,
  onCopy?: () => void,
  onSave?: () => void
) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const shortcuts: ShortcutConfig[] = [
    {
      key: "c",
      ctrlKey: true,
      description: "Copy Braille output",
      action: () => {
        if (brailleText && onCopy) {
          onCopy();
        }
      },
    },
    {
      key: "s",
      ctrlKey: true,
      description: "Save translation",
      action: () => {
        if (brailleText && onSave) {
          onSave();
        }
      },
    },
    {
      key: "h",
      ctrlKey: true,
      description: "View history",
      action: () => {
        navigate("/history");
      },
    },
    {
      key: "d",
      ctrlKey: true,
      description: "Go to dashboard",
      action: () => {
        navigate("/dashboard");
      },
    },
    {
      key: "t",
      ctrlKey: true,
      description: "New translation",
      action: () => {
        navigate("/translate");
      },
    },
    {
      key: "/",
      ctrlKey: true,
      description: "Show shortcuts",
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description:
            "Ctrl+C: Copy • Ctrl+S: Save • Ctrl+H: History • Ctrl+D: Dashboard • Ctrl+T: Translate • Ctrl+/: Help",
        });
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);
};
