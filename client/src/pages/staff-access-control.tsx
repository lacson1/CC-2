import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  UserCog, Shield, Search, Filter, X, CheckCircle2, XCircle, Lock, 
  Users, UserCheck, UserX, AlertTriangle, Activity, Clock, 
  MoreVertical, Eye, Edit, Power, Download, RefreshCw,
  ChevronRight, Calendar, MapPin, Mail, Phone, Building2,
  TrendingUp, PieChart, BarChart3, History
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  userCount?: number;
}

interface RoleDetails {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

interface StaffMember {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  roleId: number | null;
  isActive: boolean;
  photoUrl: string | null;
  title: string | null;
  organizationId: number;
  lastLoginAt: string | null;
  roleDetails?: RoleDetails;
}

interface StaffStats {
  total: number;
  active: number;
  inactive: number;
  noRole: number;
  recentLogins: number;
  roleDistribution: { roleId: number | null; roleName: string; count: number }[];
}

interface ActivityLog {
  id: number;
  action: string;
  entityType: string;
  details: string;
  createdAt: string;
  ipAddress: string;
}

// Statistics Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "blue",
  onClick 
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  trend?: string;
  color?: "blue" | "green" | "red" | "amber" | "purple";
  onClick?: () => void;
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
    red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${onClick ? 'hover:border-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Role Distribution Chart (Simple visual)
function RoleDistribution({ data }: { data: { roleName: string; count: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 
    'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500'
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-4 w-4 text-muted-foreground" />
          Role Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex h-3 rounded-full overflow-hidden bg-muted">
          {data.map((item, idx) => (
            <div
              key={item.roleName}
              className={`${colors[idx % colors.length]} transition-all`}
              style={{ width: `${(item.count / total) * 100}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, idx) => (
            <div key={item.roleName} className="flex items-center gap-2 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${colors[idx % colors.length]}`} />
              <span className="text-muted-foreground truncate">{item.roleName}</span>
              <span className="font-medium ml-auto">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Staff Row Component
function StaffRow({ 
  member, 
  bulkMode, 
  isSelected, 
  onToggleSelect, 
  onAssignRole, 
  onViewDetails,
  onToggleStatus,
  isTogglingStatus 
}: { 
  member: StaffMember;
  bulkMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAssignRole: () => void;
  onViewDetails: () => void;
  onToggleStatus: () => void;
  isTogglingStatus: boolean;
}) {
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '??';
  };

  const formatLastLogin = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TableRow 
      className={`group transition-colors ${!member.isActive ? 'bg-muted/30' : ''}`}
      data-testid={`row-staff-${member.id}`}
    >
      {bulkMode && (
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            data-testid={`checkbox-staff-${member.id}`}
          />
        </TableCell>
      )}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarImage src={member.photoUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                {getInitials(member.firstName, member.lastName)}
              </AvatarFallback>
            </Avatar>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${member.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
          </div>
          <div>
            <p className="font-medium leading-none mb-1">
              {member.title && <span className="text-muted-foreground">{member.title} </span>}
              {member.firstName} {member.lastName}
            </p>
            <p className="text-sm text-muted-foreground">@{member.username}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {member.email && (
            <div className="flex items-center gap-1.5 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate max-w-[180px]">{member.email}</span>
            </div>
          )}
          {member.phone && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              <span>{member.phone}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {member.roleDetails ? (
          <div className="space-y-1">
            <Badge variant="secondary" className="font-medium">
              <Shield className="h-3 w-3 mr-1" />
              {member.roleDetails.name}
            </Badge>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {member.roleDetails.permissions.length} permissions
            </p>
          </div>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertTriangle className="h-3 w-3 mr-1" />
            No role assigned
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm">{formatLastLogin(member.lastLoginAt)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {member.lastLoginAt 
                  ? `Last login: ${new Date(member.lastLoginAt).toLocaleString()}`
                  : 'Never logged in'
                }
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={member.isActive}
            onCheckedChange={onToggleStatus}
            disabled={isTogglingStatus}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className={`text-sm font-medium ${member.isActive ? 'text-emerald-600' : 'text-muted-foreground'}`}>
            {member.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onViewDetails}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAssignRole}>
                  <Shield className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{member.roleId ? 'Change Role' : 'Assign Role'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAssignRole}>
                <Shield className="h-4 w-4 mr-2" />
                {member.roleId ? 'Change Role' : 'Assign Role'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onToggleStatus} className={member.isActive ? 'text-red-600' : 'text-emerald-600'}>
                <Power className="h-4 w-4 mr-2" />
                {member.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Staff Details Sheet
function StaffDetailsSheet({ 
  staff, 
  open, 
  onOpenChange,
  roles,
  onAssignRole 
}: { 
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onAssignRole: () => void;
}) {
  const { data: activity = [], isLoading: activityLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/access-control/users", staff?.id, "activity"],
    queryFn: () => apiRequest(`/api/access-control/users/${staff?.id}/activity`),
    enabled: !!staff?.id && open,
  });

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '??';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'LOGIN': 'Logged in',
      'LOGOUT': 'Logged out',
      'CREATE_PATIENT': 'Created patient',
      'UPDATE_PATIENT': 'Updated patient',
      'CREATE_PRESCRIPTION': 'Created prescription',
      'VIEW_PATIENT': 'Viewed patient',
      'ASSIGN_ROLE': 'Role assigned',
    };
    return labels[action] || action.replace(/_/g, ' ').toLowerCase();
  };

  if (!staff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
              <AvatarImage src={staff.photoUrl || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-medium">
                {getInitials(staff.firstName, staff.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-xl">
                {staff.title && <span className="text-muted-foreground font-normal">{staff.title} </span>}
                {staff.firstName} {staff.lastName}
              </SheetTitle>
              <SheetDescription className="text-base">@{staff.username}</SheetDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={staff.isActive ? "default" : "secondary"} className={staff.isActive ? "bg-emerald-500" : ""}>
                  {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
                {staff.roleDetails && (
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {staff.roleDetails.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Contact Information</h4>
              <div className="space-y-2">
                {staff.email && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.email}</span>
                  </div>
                )}
                {staff.phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Account Details</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Organization ID</p>
                    <p className="font-medium">{staff.organizationId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {staff.lastLoginAt ? new Date(staff.lastLoginAt).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">System Role</p>
                    <p className="font-medium capitalize">{staff.role}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={onAssignRole}>
              <Shield className="h-4 w-4 mr-2" />
              {staff.roleId ? 'Change Role' : 'Assign Role'}
            </Button>
          </TabsContent>

          <TabsContent value="permissions" className="mt-4">
            {staff.roleDetails ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">{staff.roleDetails.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{staff.roleDetails.description}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Granted Permissions ({staff.roleDetails.permissions.length})
                  </h4>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-1">
                      {staff.roleDetails.permissions.map((perm) => (
                        <div key={perm.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted/50">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{perm.name}</p>
                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h4 className="font-medium mb-1">No Role Assigned</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  This staff member doesn't have any permissions yet.
                </p>
                <Button onClick={onAssignRole}>
                  <Shield className="h-4 w-4 mr-2" />
                  Assign Role
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            {activityLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : activity.length > 0 ? (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {activity.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="p-2 bg-background rounded-full shadow-sm">
                        <History className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{getActionLabel(log.action)}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</p>
                        {log.ipAddress && (
                          <p className="text-xs text-muted-foreground">IP: {log.ipAddress}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h4 className="font-medium mb-1">No Activity Yet</h4>
                <p className="text-sm text-muted-foreground">
                  No recent activity recorded for this user.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default function StaffAccessControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [detailsStaff, setDetailsStaff] = useState<StaffMember | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingStatusToggle, setPendingStatusToggle] = useState<{ id: number; newStatus: boolean } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff members
  const { data: staff = [], isLoading: staffLoading, refetch: refetchStaff } = useQuery<StaffMember[]>({
    queryKey: ["/api/access-control/staff"],
  });

  // Fetch roles
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["/api/access-control/roles"],
  });

  // Fetch stats
  const { data: stats } = useQuery<StaffStats>({
    queryKey: ["/api/access-control/staff/stats"],
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async (data: { userId: number; roleId: number | null }) => {
      return apiRequest(`/api/access-control/users/${data.userId}/role`, "PUT", {
        roleId: data.roleId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff/stats"] });
      setAssignDialogOpen(false);
      setSelectedStaff(null);
      setSelectedRoleId("");
      toast({
        title: "Success",
        description: "Role assigned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign role",
        variant: "destructive",
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { userId: number; isActive: boolean }) => {
      return apiRequest(`/api/access-control/users/${data.userId}/toggle-status`, "PATCH", {
        isActive: data.isActive,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff/stats"] });
      toast({
        title: "Success",
        description: variables.isActive ? "User activated successfully" : "User deactivated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  // Bulk assign roles mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async (data: { userIds: number[]; roleId: number | null }) => {
      return apiRequest("/api/access-control/bulk-assign-roles", "POST", data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff"] });
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff/stats"] });
      setBulkMode(false);
      setSelectedStaffIds([]);
      setSelectedRoleId("");
      toast({
        title: "Success",
        description: data.message || "Roles assigned successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to bulk assign roles",
        variant: "destructive",
      });
    },
  });

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch = 
        member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = 
        filterRole === "all" || 
        (filterRole === "no-role" && !member.roleId) ||
        member.roleDetails?.name === filterRole;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && member.isActive) ||
        (filterStatus === "inactive" && !member.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, searchTerm, filterRole, filterStatus]);

  const handleAssignRole = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setSelectedRoleId(staffMember.roleId?.toString() || "");
    setAssignDialogOpen(true);
  };

  const handleViewDetails = (staffMember: StaffMember) => {
    setDetailsStaff(staffMember);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (staffMember: StaffMember) => {
    setPendingStatusToggle({ id: staffMember.id, newStatus: !staffMember.isActive });
    setConfirmDialogOpen(true);
  };

  const confirmToggleStatus = () => {
    if (pendingStatusToggle) {
      toggleStatusMutation.mutate({
        userId: pendingStatusToggle.id,
        isActive: pendingStatusToggle.newStatus,
      });
    }
    setConfirmDialogOpen(false);
    setPendingStatusToggle(null);
  };

  const handleConfirmAssign = () => {
    if (!selectedStaff) return;

    assignRoleMutation.mutate({
      userId: selectedStaff.id,
      roleId: selectedRoleId && selectedRoleId !== "none" ? parseInt(selectedRoleId) : null,
    });
  };

  const handleBulkAssign = () => {
    if (selectedStaffIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select staff members to assign roles",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRoleId) {
      toast({
        title: "No Role Selected",
        description: "Please select a role to assign",
        variant: "destructive",
      });
      return;
    }

    bulkAssignMutation.mutate({
      userIds: selectedStaffIds,
      roleId: selectedRoleId === "none" ? null : parseInt(selectedRoleId),
    });
  };

  const toggleStaffSelection = (staffId: number) => {
    setSelectedStaffIds(prev =>
      prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedStaffIds.length === filteredStaff.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(filteredStaff.map(s => s.id));
    }
  };

  const exportStaffData = () => {
    const csvContent = [
      ['Name', 'Username', 'Email', 'Phone', 'Role', 'Status', 'Last Login'].join(','),
      ...filteredStaff.map(s => [
        `${s.firstName} ${s.lastName}`,
        s.username,
        s.email || '',
        s.phone || '',
        s.roleDetails?.name || 'No Role',
        s.isActive ? 'Active' : 'Inactive',
        s.lastLoginAt || 'Never'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-access-control-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${filteredStaff.length} staff member(s) to CSV`,
    });
  };

  if (staffLoading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCog className="h-7 w-7 text-primary" />
            </div>
            Staff Access Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage roles, permissions, and access for your team members
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchStaff()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportStaffData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant={bulkMode ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedStaffIds([]);
              setSelectedRoleId("");
            }}
          >
            {bulkMode ? "Exit Bulk Mode" : "Bulk Assign"}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Total Staff" 
            value={stats.total} 
            icon={Users} 
            color="blue"
            onClick={() => setFilterStatus("all")}
          />
          <StatCard 
            title="Active" 
            value={stats.active} 
            icon={UserCheck} 
            color="green"
            trend={`${Math.round((stats.active / stats.total) * 100)}% of total`}
            onClick={() => setFilterStatus("active")}
          />
          <StatCard 
            title="Inactive" 
            value={stats.inactive} 
            icon={UserX} 
            color="red"
            onClick={() => setFilterStatus("inactive")}
          />
          <StatCard 
            title="No Role" 
            value={stats.noRole} 
            icon={AlertTriangle} 
            color="amber"
            onClick={() => { setFilterRole("no-role"); setFilterStatus("all"); }}
          />
          <StatCard 
            title="Recent Logins" 
            value={stats.recentLogins} 
            icon={Activity} 
            color="purple"
            trend="Last 7 days"
          />
        </div>
      )}

      {/* Role Distribution */}
      {stats && stats.roleDistribution.length > 0 && (
        <RoleDistribution data={stats.roleDistribution} />
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="no-role">No Role Assigned</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-40">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                  setFilterStatus("all");
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {bulkMode && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedStaffIds.length} of {filteredStaff.length} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Remove all roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleBulkAssign}
                  disabled={selectedStaffIds.length === 0 || !selectedRoleId || bulkAssignMutation.isPending}
                >
                  {bulkAssignMutation.isPending ? "Assigning..." : "Apply to Selected"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staff Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {bulkMode && <TableHead className="w-12"></TableHead>}
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <StaffRow
                  key={member.id}
                  member={member}
                  bulkMode={bulkMode}
                  isSelected={selectedStaffIds.includes(member.id)}
                  onToggleSelect={() => toggleStaffSelection(member.id)}
                  onAssignRole={() => handleAssignRole(member)}
                  onViewDetails={() => handleViewDetails(member)}
                  onToggleStatus={() => handleToggleStatus(member)}
                  isTogglingStatus={toggleStatusMutation.isPending}
                />
              ))}
              {filteredStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={bulkMode ? 7 : 6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="h-8 w-8 mb-2" />
                      <p className="font-medium">No staff members found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Assign Role
            </DialogTitle>
            <DialogDescription>
              Select a role to assign to {selectedStaff?.firstName} {selectedStaff?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {selectedStaff?.firstName?.[0]}{selectedStaff?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedStaff?.title} {selectedStaff?.firstName} {selectedStaff?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{selectedStaff?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      Remove role (No access)
                    </div>
                  </SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">{role.name}</p>
                          <p className="text-xs text-muted-foreground">{role.permissions?.length || 0} permissions</p>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoleId && selectedRoleId !== "none" && roles.find(r => r.id.toString() === selectedRoleId) && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Permissions Preview</Label>
                <ScrollArea className="h-40 border rounded-lg p-3">
                  <div className="space-y-1">
                    {roles.find(r => r.id.toString() === selectedRoleId)?.permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center gap-2 text-sm py-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{perm.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignDialogOpen(false);
                  setSelectedStaff(null);
                  setSelectedRoleId("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssign}
                disabled={assignRoleMutation.isPending}
              >
                {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Details Sheet */}
      <StaffDetailsSheet
        staff={detailsStaff}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        roles={roles}
        onAssignRole={() => {
          setDetailsOpen(false);
          if (detailsStaff) {
            handleAssignRole(detailsStaff);
          }
        }}
      />

      {/* Confirm Status Toggle Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusToggle?.newStatus ? 'Activate User' : 'Deactivate User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusToggle?.newStatus 
                ? 'This will restore the user\'s access to the system. They will be able to log in and use their assigned permissions.'
                : 'This will prevent the user from logging in and accessing the system. Their data will be preserved.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmToggleStatus}
              className={pendingStatusToggle?.newStatus ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {pendingStatusToggle?.newStatus ? 'Activate' : 'Deactivate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
