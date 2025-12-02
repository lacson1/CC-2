import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings2, 
  GripVertical, 
  RotateCcw,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useTopBarConfig, TopBarIconConfig } from '@/hooks/use-topbar-config';
import { useRole } from '@/components/role-guard';
import { useToast } from '@/hooks/use-toast';

interface TopBarCustomizerProps {
  trigger?: React.ReactNode;
}

export function TopBarCustomizer({ trigger }: TopBarCustomizerProps) {
  const { user } = useRole();
  const { toast } = useToast();
  const {
    getAllIcons,
    toggleIcon,
    updateIcon,
    reorderIcons,
    resetToDefaults,
  } = useTopBarConfig(user?.role || '');
  
  const [open, setOpen] = useState(false);

  const allIcons = getAllIcons();
  const leftIcons = allIcons.filter(i => i.position === 'left').sort((a, b) => a.order - b.order);
  const rightIcons = allIcons.filter(i => i.position === 'right').sort((a, b) => a.order - b.order);

  const handleToggle = (iconId: string) => {
    toggleIcon(iconId);
    toast({
      title: 'TopBar Updated',
      description: 'Your toolbar configuration has been saved.',
      duration: 2000,
    });
  };

  const handleMoveUp = (icon: TopBarIconConfig, icons: TopBarIconConfig[]) => {
    const currentIndex = icons.findIndex(i => i.id === icon.id);
    if (currentIndex > 0) {
      const prevIcon = icons[currentIndex - 1];
      reorderIcons(icon.id, prevIcon.order - 1);
    }
  };

  const handleMoveDown = (icon: TopBarIconConfig, icons: TopBarIconConfig[]) => {
    const currentIndex = icons.findIndex(i => i.id === icon.id);
    if (currentIndex < icons.length - 1) {
      const nextIcon = icons[currentIndex + 1];
      reorderIcons(icon.id, nextIcon.order + 1);
    }
  };

  const handleReset = () => {
    resetToDefaults();
    toast({
      title: 'TopBar Reset',
      description: 'Toolbar has been restored to default settings.',
      duration: 2000,
    });
  };

  const IconRow = ({ icon, icons }: { icon: TopBarIconConfig; icons: TopBarIconConfig[] }) => {
    const Icon = icon.icon;
    const currentIndex = icons.findIndex(i => i.id === icon.id);
    
    return (
      <div 
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
          icon.enabled 
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
            : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'
        }`}
      >
        <GripVertical className="h-4 w-4 text-slate-400 cursor-move flex-shrink-0" />
        
        <div className={`p-2 rounded-md ${
          icon.enabled 
            ? 'bg-blue-100 dark:bg-blue-800/50' 
            : 'bg-slate-200 dark:bg-slate-700'
        }`}>
          <Icon className={`h-4 w-4 ${
            icon.enabled 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 dark:text-slate-400'
          }`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${
              icon.enabled 
                ? 'text-slate-900 dark:text-slate-100' 
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              {icon.name}
            </span>
            {icon.action === 'dropdown' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Menu
              </Badge>
            )}
            {icon.action === 'toggle' && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Toggle
              </Badge>
            )}
          </div>
          {icon.tooltip && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {icon.tooltip}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleMoveUp(icon, icons)}
            disabled={currentIndex === 0}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => handleMoveDown(icon, icons)}
            disabled={currentIndex === icons.length - 1}
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Switch
          checked={icon.enabled}
          onCheckedChange={() => handleToggle(icon.id)}
          className="flex-shrink-0"
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Settings2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-600" />
            Customize TopBar
          </DialogTitle>
          <DialogDescription>
            Add, remove, and reorder icons in your toolbar. Changes are saved automatically.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Right Side Icons */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Action Icons
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {rightIcons.filter(i => i.enabled).length} / {rightIcons.length} enabled
                </Badge>
              </div>
              <div className="space-y-2">
                {rightIcons.map(icon => (
                  <IconRow key={icon.id} icon={icon} icons={rightIcons} />
                ))}
              </div>
            </div>

            <Separator />

            {/* Preview */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Preview
              </h4>
              <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="text-xs text-slate-500 mr-auto">TopBar icons:</span>
                {rightIcons
                  .filter(i => i.enabled)
                  .sort((a, b) => a.order - b.order)
                  .map(icon => {
                    const Icon = icon.icon;
                    return (
                      <div
                        key={icon.id}
                        className="p-1.5 bg-white dark:bg-slate-700 rounded shadow-sm"
                        title={icon.name}
                      >
                        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TopBarCustomizer;

