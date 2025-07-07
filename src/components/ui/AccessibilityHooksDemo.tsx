import React, { useState } from 'react';
import { Button } from './Button';
import { useFocusTrap, useAnnouncement, useEscapeKey, useReducedMotion } from '@/hooks/useAccessibility';

/**
 * Component that demonstrates the usage of accessibility hooks
 */
export function AccessibilityHooksDemo() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const { announce } = useAnnouncement();
  const dialogRef = useFocusTrap();
  
  // Use escape key to close dialog
  useEscapeKey(() => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
      announce('Dialog closed', 'assertive');
    }
  });
  
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    announce('Dialog opened', 'assertive');
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    announce('Dialog closed', 'assertive');
  };
  
  const handleAnnounce = () => {
    const message = `Announcement at ${new Date().toLocaleTimeString()}`;
    announce(message);
    setAnnouncements((prev) => [...prev, message]);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">useReducedMotion</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            User prefers reduced motion: <span className="font-medium">{prefersReducedMotion ? 'Yes' : 'No'}</span>
          </div>
          <div 
            className={`w-12 h-12 bg-primary-500 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`}
            aria-hidden="true"
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          This component respects the user's motion preference setting.
          The animation is disabled when reduced motion is preferred.
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">useAnnouncement</h3>
        <div className="flex items-center space-x-4">
          <Button onClick={handleAnnounce} size="sm">
            Make Announcement
          </Button>
        </div>
        {announcements.length > 0 && (
          <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm max-h-24 overflow-y-auto">
            <h4 className="text-xs font-medium mb-1">Recent Announcements:</h4>
            <ul className="space-y-1">
              {announcements.map((msg, i) => (
                <li key={i} className="text-xs">{msg}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs text-gray-500">
          Announcements are read by screen readers but not visually displayed to users.
        </p>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">useFocusTrap & useEscapeKey</h3>
        <Button onClick={handleOpenDialog} size="sm">
          Open Dialog
        </Button>
        <p className="text-xs text-gray-500">
          When the dialog opens, focus is trapped inside it.
          Press Escape or the close button to close it.
        </p>
      </div>
      
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div 
            ref={dialogRef}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
          >
            <h2 id="dialog-title" className="text-lg font-semibold mb-4">Focus Trapped Dialog</h2>
            <p className="mb-4">
              Focus is trapped within this dialog. Try tabbing through the elements - 
              you won't be able to focus elements outside the dialog.
            </p>
            <div className="space-y-2">
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                placeholder="Focus trap test input"
              />
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleCloseDialog}>
                  Close Dialog
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}