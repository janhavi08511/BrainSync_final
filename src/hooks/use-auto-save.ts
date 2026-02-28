import { useEffect, useRef } from "react";
import { useDebounce } from "./use-debounce";

interface AutoSaveOptions {
  data: any;
  onSave: (data: any) => void;
  delay?: number;
  enabled?: boolean;
}

export const useAutoSave = ({
  data,
  onSave,
  delay = 2000,
  enabled = true,
}: AutoSaveOptions) => {
  const debouncedData = useDebounce(data, delay);
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Skip first run to avoid saving initial state
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    if (enabled && debouncedData) {
      onSave(debouncedData);
    }
  }, [debouncedData, onSave, enabled]);
};

// Draft management
export const useDraftManagement = (key: string) => {
  const saveDraft = (data: any) => {
    try {
      localStorage.setItem(
        `draft-${key}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(`draft-${key}`);
      if (!saved) return null;

      const { data, timestamp } = JSON.parse(saved);

      // Auto-delete drafts older than 7 days
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (timestamp < sevenDaysAgo) {
        clearDraft();
        return null;
      }

      return data;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(`draft-${key}`);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  return { saveDraft, loadDraft, clearDraft };
};
