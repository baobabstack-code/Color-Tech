// src/hooks/use-toast.ts
// Simple placeholder implementation for useToast. Replace with your preferred toast logic or library.
import { useCallback } from 'react';

export function useToast() {
  const toast = useCallback((options: { title: string; description?: string; status?: string }) => {
    // You can replace this with a real toast library (e.g., react-hot-toast, sonner, etc.)
    alert(`${options.title}${options.description ? ': ' + options.description : ''}`);
  }, []);

  return { toast };
}
