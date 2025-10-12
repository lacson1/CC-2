import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

export default function OrganizationSelector() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: organizations, isLoading } = useQuery<UserOrganization[]>({
    queryKey: ["/api/organizations/user-organizations"],
  });

  const switchOrganization = useMutation({
    mutationFn: async (organizationId: number) => {
      return await apiRequest(`/api/organizations/switch`, 'POST', { organizationId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/current"] });
      toast({
        title: "Organization switched",
        description: "You are now working in the selected organization",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to switch organization",
        description: error.message || "An error occurred",
      });
    },
  });

  const setDefault = useMutation({
    mutationFn: async (organizationId: number) => {
      return await apiRequest(`/api/organizations/set-default/${organizationId}`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/organizations/user-organizations"] });
      toast({
        title: "Default organization updated",
        description: "This organization will be selected automatically on login",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Organizations Found</CardTitle>
            <CardDescription>
              You are not currently associated with any organization. Please contact your administrator.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // If user has only one organization, automatically select it
  if (organizations.length === 1) {
    switchOrganization.mutate(organizations[0].organizationId);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Select Organization</CardTitle>
          <CardDescription>
            Choose which organization you want to work in
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {organizations.map((userOrg) => (
            <Card
              key={userOrg.organizationId}
              className="hover:border-primary transition-colors cursor-pointer"
              data-testid={`org-card-${userOrg.organizationId}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${userOrg.organization.themeColor}20` }}
                    >
                      <Building2 
                        className="w-6 h-6" 
                        style={{ color: userOrg.organization.themeColor || '#3B82F6' }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {userOrg.organization.name}
                        {userOrg.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {userOrg.organization.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!userOrg.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefault.mutate(userOrg.organizationId);
                        }}
                        disabled={setDefault.isPending}
                        data-testid={`button-set-default-${userOrg.organizationId}`}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button
                      onClick={() => switchOrganization.mutate(userOrg.organizationId)}
                      disabled={switchOrganization.isPending}
                      data-testid={`button-select-org-${userOrg.organizationId}`}
                    >
                      Select
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
