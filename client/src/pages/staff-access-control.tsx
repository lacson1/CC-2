import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { UserCog, Shield, Search, Filter, X, CheckCircle2, XCircle, Lock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export default function StaffAccessControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff members
  const { data: staff = [], isLoading: staffLoading } = useQuery<StaffMember[]>({
    queryKey: ["/api/access-control/staff"],
  });

  // Fetch roles
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["/api/access-control/roles"],
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

  // Bulk assign roles mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async (data: { userIds: number[]; roleId: number | null }) => {
      return apiRequest("/api/access-control/bulk-assign-roles", "POST", data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/access-control/staff"] });
      setBulkMode(false);
      setSelectedStaffIds([]);
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

      return matchesSearch && matchesRole;
    });
  }, [staff, searchTerm, filterRole]);

  const handleAssignRole = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setSelectedRoleId(staffMember.roleId?.toString() || "");
    setAssignDialogOpen(true);
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

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '??';
  };

  if (staffLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCog className="h-8 w-8" />
            Staff Access Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign roles and manage access permissions for staff members
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={bulkMode ? "default" : "outline"}
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedStaffIds([]);
            }}
            data-testid="button-toggle-bulk-mode"
          >
            {bulkMode ? "Exit Bulk Mode" : "Bulk Assign"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  data-testid="input-search-staff"
                  placeholder="Search by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Label htmlFor="role-filter">Filter by Role</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger id="role-filter" data-testid="select-role-filter">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="no-role">No role assigned</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || filterRole !== "all") && (
              <div className="flex items-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {bulkMode && (
        <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                  onCheckedChange={toggleSelectAll}
                  data-testid="checkbox-select-all"
                />
                <span className="text-sm font-medium">
                  {selectedStaffIds.length} staff member(s) selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                  <SelectTrigger className="w-48" data-testid="select-bulk-role">
                    <SelectValue placeholder="Select role" />
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
                  data-testid="button-confirm-bulk-assign"
                >
                  {bulkAssignMutation.isPending ? "Assigning..." : "Assign Role"}
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
              <TableRow>
                {bulkMode && <TableHead className="w-12"></TableHead>}
                <TableHead>Staff Member</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id} data-testid={`row-staff-${member.id}`}>
                  {bulkMode && (
                    <TableCell>
                      <Checkbox
                        checked={selectedStaffIds.includes(member.id)}
                        onCheckedChange={() => toggleStaffSelection(member.id)}
                        data-testid={`checkbox-staff-${member.id}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.photoUrl || undefined} />
                        <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.title} {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">@{member.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{member.email}</p>
                      <p className="text-muted-foreground">{member.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {member.roleDetails ? (
                      <div>
                        <Badge variant="secondary" data-testid={`badge-role-${member.id}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {member.roleDetails.name}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {member.roleDetails.description}
                        </p>
                      </div>
                    ) : (
                      <Badge variant="outline">No role assigned</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.roleDetails ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>{member.roleDetails.permissions.length} permissions</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span>No access</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.isActive ? "default" : "secondary"}>
                      {member.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignRole(member)}
                      data-testid={`button-assign-role-${member.id}`}
                    >
                      {member.roleId ? "Change Role" : "Assign Role"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={bulkMode ? 7 : 6} className="text-center py-8 text-muted-foreground">
                    No staff members found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Role Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedStaff?.firstName} {selectedStaff?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">
                {selectedStaff?.title} {selectedStaff?.firstName} {selectedStaff?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{selectedStaff?.email}</p>
            </div>

            <div>
              <Label htmlFor="role-select">Select Role</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger id="role-select" data-testid="select-assign-role">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No role (Remove access)</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedRoleId && roles.find(r => r.id.toString() === selectedRoleId) && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Permissions Preview</Label>
                <ScrollArea className="h-48 border rounded-md p-3">
                  <div className="space-y-1">
                    {roles.find(r => r.id.toString() === selectedRoleId)?.permissions.map((perm) => (
                      <div key={perm.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        <span>{perm.name}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAssignDialogOpen(false);
                  setSelectedStaff(null);
                  setSelectedRoleId("");
                }}
                data-testid="button-cancel-assign"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssign}
                disabled={assignRoleMutation.isPending}
                data-testid="button-confirm-assign"
              >
                {assignRoleMutation.isPending ? "Assigning..." : "Assign Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
