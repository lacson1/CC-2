import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import {
  Bell, Plus, Shield, Settings, User, Heart, Search,
  Moon, Sun, Globe, HelpCircle, LogOut, RefreshCw,
  MessageSquare, Calendar, Activity, Zap
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TopBarIconConfig {
  id: string;
  name: string;
  icon: LucideIcon;
  enabled: boolean;
  position: 'left' | 'right';
  order: number;
  roles: string[]; // Which roles can see this icon
  action?: 'link' | 'dropdown' | 'toggle' | 'custom';
  href?: string;
  tooltip?: string;
}

// Default icon configurations
export const defaultTopBarIcons: TopBarIconConfig[] = [
  // Left side icons
  {
    id: 'brand',
    name: 'Brand Logo',
    icon: Heart,
    enabled: true,
    position: 'left',
    order: 0,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'link',
    href: '/dashboard',
    tooltip: 'Go to Dashboard',
  },

  // Right side icons
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    icon: Plus,
    enabled: true,
    position: 'right',
    order: 10,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist'],
    action: 'dropdown',
    tooltip: 'Quick Actions',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    enabled: true,
    position: 'right',
    order: 20,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'dropdown',
    tooltip: 'View Notifications',
  },
  {
    id: 'messages',
    name: 'Staff Messages',
    icon: MessageSquare,
    enabled: false,
    position: 'right',
    order: 25,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist'],
    action: 'link',
    href: '/staff-messages',
    tooltip: 'Staff Messages',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: Calendar,
    enabled: false,
    position: 'right',
    order: 26,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'receptionist'],
    action: 'link',
    href: '/appointments',
    tooltip: 'Appointments',
  },
  {
    id: 'activity',
    name: 'Activity Monitor',
    icon: Activity,
    enabled: false,
    position: 'right',
    order: 27,
    roles: ['superadmin', 'admin'],
    action: 'link',
    href: '/performance',
    tooltip: 'System Activity',
  },
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    icon: Shield,
    enabled: true,
    position: 'right',
    order: 30,
    roles: ['superadmin', 'admin'],
    action: 'link',
    href: '/super-admin-control-panel',
    tooltip: 'System Administration',
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode Toggle',
    icon: Moon,
    enabled: false,
    position: 'right',
    order: 40,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'toggle',
    tooltip: 'Toggle Dark Mode',
  },
  {
    id: 'search',
    name: 'Global Search',
    icon: Search,
    enabled: false,
    position: 'right',
    order: 5,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'custom',
    tooltip: 'Search (Ctrl+K)',
  },
  {
    id: 'help',
    name: 'Help & Support',
    icon: HelpCircle,
    enabled: false,
    position: 'right',
    order: 45,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'link',
    href: '/help',
    tooltip: 'Help & Support',
  },
  {
    id: 'refresh',
    name: 'Refresh Data',
    icon: RefreshCw,
    enabled: false,
    position: 'right',
    order: 35,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'custom',
    tooltip: 'Refresh Page Data',
  },
  {
    id: 'user-profile',
    name: 'User Profile',
    icon: User,
    enabled: true,
    position: 'right',
    order: 100,
    roles: ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacist', 'physiotherapist', 'receptionist'],
    action: 'dropdown',
    tooltip: 'Your Profile',
  },
];

// Storage key for local persistence
const STORAGE_KEY = 'topbar-config';

// Merge stored config with defaults (handles new icons)
function mergeWithDefaults(stored: Partial<TopBarIconConfig>[]): TopBarIconConfig[] {
  const storedMap = new Map(stored.map(i => [i.id, i]));
  return defaultTopBarIcons.map(defaultIcon => {
    const storedIcon = storedMap.get(defaultIcon.id);
    if (storedIcon) {
      return { ...defaultIcon, ...storedIcon, icon: defaultIcon.icon };
    }
    return defaultIcon;
  });
}

// Load initial icons from localStorage
function loadInitialIcons(): TopBarIconConfig[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return mergeWithDefaults(parsed);
    } catch {
      return defaultTopBarIcons;
    }
  }
  return defaultTopBarIcons;
}

// Context for sharing TopBar config across components
interface TopBarConfigContextType {
  icons: TopBarIconConfig[];
  setIcons: React.Dispatch<React.SetStateAction<TopBarIconConfig[]>>;
}

const TopBarConfigContext = createContext<TopBarConfigContextType | null>(null);

/**
 * Provider component for TopBar configuration
 * Wrap your app with this to share TopBar config state
 */
export function TopBarConfigProvider({ children }: { children: ReactNode }) {
  const [icons, setIcons] = useState<TopBarIconConfig[]>(loadInitialIcons);

  // Save to localStorage whenever icons change
  useEffect(() => {
    const toStore = icons.map(({ icon, ...rest }) => rest); // Don't store icon component
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [icons]);

  return (
    <TopBarConfigContext.Provider value={{ icons, setIcons }}>
      {children}
    </TopBarConfigContext.Provider>
  );
}

/**
 * Hook for managing TopBar icon configuration
 * Uses shared context so changes propagate to all consumers
 */
export function useTopBarConfig(userRole: string = '') {
  const context = useContext(TopBarConfigContext);

  // Fallback to local state if not wrapped in provider (backwards compatibility)
  const [localIcons, setLocalIcons] = useState<TopBarIconConfig[]>(loadInitialIcons);

  const icons = context?.icons ?? localIcons;
  const setIcons = context?.setIcons ?? setLocalIcons;

  // Save to localStorage whenever icons change (only for fallback mode)
  useEffect(() => {
    if (!context) {
      const toStore = icons.map(({ icon, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    }
  }, [icons, context]);

  // Get visible icons for the current role
  const getVisibleIcons = useCallback((position: 'left' | 'right') => {
    return icons
      .filter(icon =>
        icon.enabled &&
        icon.position === position &&
        icon.roles.includes(userRole)
      )
      .sort((a, b) => a.order - b.order);
  }, [icons, userRole]);

  // Toggle an icon's enabled state
  const toggleIcon = useCallback((iconId: string) => {
    setIcons(prev => prev.map(icon =>
      icon.id === iconId ? { ...icon, enabled: !icon.enabled } : icon
    ));
  }, [setIcons]);

  // Update icon configuration
  const updateIcon = useCallback((iconId: string, updates: Partial<TopBarIconConfig>) => {
    setIcons(prev => prev.map(icon =>
      icon.id === iconId ? { ...icon, ...updates } : icon
    ));
  }, [setIcons]);

  // Reorder icons
  const reorderIcons = useCallback((iconId: string, newOrder: number) => {
    setIcons(prev => prev.map(icon =>
      icon.id === iconId ? { ...icon, order: newOrder } : icon
    ));
  }, [setIcons]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setIcons(defaultTopBarIcons);
    localStorage.removeItem(STORAGE_KEY);
  }, [setIcons]);

  // Get all icons (for configuration UI)
  const getAllIcons = useCallback(() => {
    return icons.filter(icon => icon.roles.includes(userRole));
  }, [icons, userRole]);

  return {
    icons,
    getVisibleIcons,
    toggleIcon,
    updateIcon,
    reorderIcons,
    resetToDefaults,
    getAllIcons,
  };
}

export default useTopBarConfig;
