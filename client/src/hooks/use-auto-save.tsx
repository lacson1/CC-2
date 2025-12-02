import { useEffect, useRef, useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveOptions {
  key: string;
  data: any;
  enabled?: boolean;
  debounceMs?: number;
  onSave?: (data: any) => void | Promise<void>;
  onRestore?: (data: any) => void;
}

export function useAutoSave({
  key,
  data,
  enabled = true,
  debounceMs = 30000, // Auto-save every 30 seconds
  onSave,
  onRestore
}: AutoSaveOptions) {
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const previousDataRef = useRef<string>();

  // Save to localStorage
  const saveToStorage = useCallback(async (dataToSave: any) => {
    try {
      const storageKey = `autosave_${key}`;
      const saveData = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      
      localStorage.setItem(storageKey, JSON.stringify(saveData));
      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      if (onSave) {
        await onSave(dataToSave);
      }

      // Silent save - don't show toast for auto-saves
      console.log(`Auto-saved: ${key} at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: 'Auto-save failed',
        description: 'Your work may not be saved. Please save manually.',
        variant: 'destructive'
      });
    }
  }, [key, onSave, toast]);

  // Restore from localStorage
  const restoreFromStorage = useCallback(() => {
    try {
      const storageKey = `autosave_${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const { data: savedData, timestamp } = JSON.parse(stored);
        const savedDate = new Date(timestamp);
        
        // Only restore if saved within last 24 hours
        const hoursSinceSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSave < 24) {
          if (onRestore) {
            onRestore(savedData);
          }
          setLastSaved(savedDate);
          return { data: savedData, timestamp: savedDate };
        } else {
          // Clear old data
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Failed to restore auto-saved data:', error);
    }
    return null;
  }, [key, onRestore]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      const storageKey = `autosave_${key}`;
      localStorage.removeItem(storageKey);
      setLastSaved(null);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to clear saved data:', error);
    }
  }, [key]);

  // Manual save
  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    await saveToStorage(data);
  }, [data, saveToStorage]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Check if data actually changed
    if (currentData === previousDataRef.current) {
      return;
    }

    previousDataRef.current = currentData;
    setHasUnsavedChanges(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveToStorage(data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, saveToStorage]);

  // Save on page unload
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Save immediately
        saveToStorage(data);
        
        // Show warning
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, hasUnsavedChanges, data, saveToStorage]);

  return {
    lastSaved,
    hasUnsavedChanges,
    saveNow,
    restoreFromStorage,
    clearSaved
  };
}

// Hook to show restore banner
export function useRestoreBanner(key: string) {
  const [showBanner, setShowBanner] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  useEffect(() => {
    try {
      const storageKey = `autosave_${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        const savedDate = new Date(timestamp);
        
        // Only show if saved within last 24 hours
        const hoursSinceSave = (Date.now() - savedDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceSave < 24) {
          setShowBanner(true);
          setSavedData({ data, timestamp: savedDate });
        }
      }
    } catch (error) {
      console.error('Failed to check for saved data:', error);
    }
  }, [key]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    const storageKey = `autosave_${key}`;
    localStorage.removeItem(storageKey);
  }, [key]);

  return {
    showBanner,
    savedData,
    dismissBanner
  };
}
