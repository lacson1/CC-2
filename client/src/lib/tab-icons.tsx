import * as LucideIcons from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'LayoutGrid': LucideIcons.LayoutGrid,
  'Calendar': LucideIcons.Calendar,
  'TestTube': LucideIcons.TestTube,
  'Pill': LucideIcons.Pill,
  'Activity': LucideIcons.Activity,
  'FileText': LucideIcons.FileText,
  'CreditCard': LucideIcons.CreditCard,
  'Shield': LucideIcons.Shield,
  'CalendarDays': LucideIcons.CalendarDays,
  'History': LucideIcons.History,
  'FileCheck': LucideIcons.FileCheck,
  'MessageSquare': LucideIcons.MessageSquare,
  'Syringe': LucideIcons.Syringe,
  'Clock': LucideIcons.Clock,
  'Stethoscope': LucideIcons.Stethoscope,
  'Monitor': LucideIcons.Monitor,
  'Heart': LucideIcons.Heart,
  'User': LucideIcons.User,
  'AlertTriangle': LucideIcons.AlertTriangle,
  'Scan': LucideIcons.Scan,
  'Scissors': LucideIcons.Scissors,
};

export function getTabIcon(iconName: string): React.ComponentType<{ className?: string }> {
  return iconMap[iconName] || LucideIcons.FileText;
}
