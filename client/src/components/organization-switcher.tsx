import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, Check, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Organization {
  id: number;
  name: string;
  type: string;
  themeColor?: string;
}

interface UserOrganization {
  organizationId: number;
  isDefault: boolean;
  organization: Organization;
}

export function OrganizationSwitcher() {
  const { user, refreshUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch user's organizations
  const { data: userOrgs } = useQuery<UserOrganization[]>({
    queryKey: ['/api/organizations/user-organizations'],
    enabled: !!user,
  });

  // Switch organization mutation
  const switchOrgMutation = useMutation({
    mutationFn: async (organizationId: number) => {
      return apiRequest('/api/organizations/switch', 'POST', { organizationId });
    },
    onSuccess: async () => {
      // Refresh user data to get updated organization
      await refreshUser();
      // Invalidate all queries to refetch with new org context
      queryClient.invalidateQueries();
      setIsOpen(false);
      // Note: window.location.reload() is used here to ensure complete state reset
      // TODO: Replace with targeted query invalidations once all backend routes
      // consistently use currentOrganizationId instead of legacy organizationId
      window.location.reload();
    },
  });

  // Don't show switcher if user has only one organization or none
  if (!userOrgs || userOrgs.length <= 1) {
    return null;
  }

  const currentOrg = user?.organization;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          data-testid="dropdown-org-switcher"
        >
          <Building2 className="h-4 w-4 mr-2" />
          <span className="max-w-[150px] truncate">{currentOrg?.name || 'Select Organization'}</span>
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userOrgs.map((userOrg) => (
          <DropdownMenuItem
            key={userOrg.organizationId}
            onClick={() => switchOrgMutation.mutate(userOrg.organizationId)}
            disabled={switchOrgMutation.isPending || currentOrg?.id === userOrg.organizationId}
            className="cursor-pointer"
            data-testid={`org-option-${userOrg.organizationId}`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: userOrg.organization.themeColor || '#3B82F6' }}
                />
                <div>
                  <div className="font-medium">{userOrg.organization.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {userOrg.organization.type}
                  </div>
                </div>
              </div>
              {currentOrg?.id === userOrg.organizationId && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
