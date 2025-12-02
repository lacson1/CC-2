import { useEffect } from 'react';
import { useLocation } from 'wouter';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
  category?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs (except for specific global shortcuts)
      const target = event.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable;

      // Guard against undefined event.key (can happen with some special keys)
      if (!event.key) return;

      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === (event.ctrlKey || event.metaKey) && // Support Cmd on Mac
        !!s.shiftKey === event.shiftKey &&
        !!s.altKey === event.altKey
      );

      if (shortcut) {
        // Allow certain global shortcuts even in input fields
        const globalShortcuts = ['k', 's', 'n', 'p'];
        const isGlobalShortcut = globalShortcuts.includes(shortcut.key.toLowerCase()) && 
                                (event.ctrlKey || event.metaKey);
        
        if (!isInputField || isGlobalShortcut) {
          event.preventDefault();
          shortcut.action();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts() {
  const [, setLocation] = useLocation();

  const shortcuts: KeyboardShortcut[] = [
    // Quick Actions
    {
      key: 'n',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('open-consultation-modal');
        window.dispatchEvent(event);
      },
      description: 'New Consultation',
      category: 'Quick Actions'
    },
    {
      key: 'n',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        const event = new CustomEvent('open-patient-modal');
        window.dispatchEvent(event);
      },
      description: 'New Patient Registration',
      category: 'Quick Actions'
    },
    {
      key: 'p',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        const event = new CustomEvent('open-prescription-modal');
        window.dispatchEvent(event);
      },
      description: 'New Prescription',
      category: 'Quick Actions'
    },
    {
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        const event = new CustomEvent('open-lab-order-modal');
        window.dispatchEvent(event);
      },
      description: 'New Lab Order',
      category: 'Quick Actions'
    },
    {
      key: 'm',
      ctrlKey: true,
      shiftKey: true,
      action: () => setLocation('/staff-messages'),
      description: 'Open Staff Messages',
      category: 'Quick Actions'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => {
        const event = new CustomEvent('save-current-form');
        window.dispatchEvent(event);
      },
      description: 'Save Current Form',
      category: 'Quick Actions'
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => {
        window.print();
      },
      description: 'Print Current Page',
      category: 'Quick Actions'
    },

    // Search & Find
    {
      key: 'k',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('[data-global-search]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        } else {
          // If no global search, open patient search
          setLocation('/patients');
          setTimeout(() => {
            const patientSearch = document.querySelector('input[type="search"]') as HTMLInputElement;
            patientSearch?.focus();
          }, 100);
        }
      },
      description: 'Quick Patient Search',
      category: 'Search'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => {
        // Trigger browser's find in page
        // This is handled by browser, but we register it for documentation
      },
      description: 'Find in Page',
      category: 'Search'
    },

    // Navigation - Alt + Number
    {
      key: '1',
      altKey: true,
      action: () => setLocation('/dashboard'),
      description: 'Go to Dashboard',
      category: 'Navigation'
    },
    {
      key: '2',
      altKey: true,
      action: () => setLocation('/patients'),
      description: 'Go to Patients',
      category: 'Navigation'
    },
    {
      key: '3',
      altKey: true,
      action: () => setLocation('/appointments'),
      description: 'Go to Appointments',
      category: 'Navigation'
    },
    {
      key: '4',
      altKey: true,
      action: () => setLocation('/lab-results'),
      description: 'Go to Lab Results',
      category: 'Navigation'
    },
    {
      key: '5',
      altKey: true,
      action: () => setLocation('/pharmacy'),
      description: 'Go to Pharmacy',
      category: 'Navigation'
    },
    {
      key: '6',
      altKey: true,
      action: () => setLocation('/billing'),
      description: 'Go to Billing',
      category: 'Navigation'
    },
    {
      key: '7',
      altKey: true,
      action: () => setLocation('/inventory'),
      description: 'Go to Inventory',
      category: 'Navigation'
    },
    {
      key: '8',
      altKey: true,
      action: () => setLocation('/admin-dashboard-enhanced'),
      description: 'Go to Reports',
      category: 'Navigation'
    },
    {
      key: '9',
      altKey: true,
      action: () => setLocation('/settings'),
      description: 'Go to Settings',
      category: 'Navigation'
    },

    // General
    {
      key: ',',
      ctrlKey: true,
      action: () => setLocation('/settings'),
      description: 'Open Settings',
      category: 'General'
    },
    {
      key: 'Escape',
      action: () => {
        const event = new CustomEvent('close-modal');
        window.dispatchEvent(event);
      },
      description: 'Close Modal/Dialog',
      category: 'General'
    }
  ];

  useKeyboardShortcuts(shortcuts);
  
  return shortcuts;
}

// Hook to show tooltip hints for keyboard shortcuts
export function useShortcutHint(shortcutKey: string) {
  const shortcuts = useGlobalShortcuts();
  const shortcut = shortcuts.find(s => 
    s.description.toLowerCase().includes(shortcutKey.toLowerCase())
  );
  
  if (!shortcut) return null;

  const keys = [];
  if (shortcut.ctrlKey) keys.push('Ctrl');
  if (shortcut.shiftKey) keys.push('Shift');
  if (shortcut.altKey) keys.push('Alt');
  if (shortcut.metaKey) keys.push('Cmd');
  keys.push(shortcut.key.toUpperCase());

  return keys.join('+');
}
