import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  Search,
  Download,
  Filter,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Clock,
  Activity,
  Eye
} from "lucide-react";
import { exportActivityLog } from "@/utils/export-utils";

interface AuditLog {
  id: number;
  userId: number;
  username: string;
  action: string;
  entityType: string;
  entityId: number | null;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

export default function AuditLogsEnhanced() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [filterEntityType, setFilterEntityType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');
  const [limit, setLimit] = useState('100');

  // Fetch audit logs
  const { data: auditLogs = [], isLoading, refetch } = useQuery<AuditLog[]>({
    queryKey: ['/api/audit-logs/enhanced', { 
      limit,
      user: filterUser !== 'all' ? filterUser : undefined,
      action: filterAction !== 'all' ? filterAction : undefined,
      entityType: filterEntityType !== 'all' ? filterEntityType : undefined,
      dateFrom,
      dateTo
    }],
  });

  // Fetch available filters
  const { data: filterOptions } = useQuery<{
    users: Array<{ id: number; username: string }>;
    actions: string[];
    entityTypes: string[];
  }>({
    queryKey: ['/api/audit-logs/filter-options'],
  });

  // Filter logs based on search and filters
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" ||
      log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleExport = () => {
    exportActivityLog(filteredLogs.map(log => ({
      timestamp: new Date(log.timestamp).toLocaleString(),
      user: log.username,
      description: log.action,
      type: log.entityType,
      severity: log.severity || 'info'
    })));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterUser("all");
    setFilterAction("all");
    setFilterEntityType("all");
    setFilterSeverity("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      {/* Header */}
      <div className="healthcare-header px-6 py-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Shield className="h-8 w-8" />
                Audit Trail & Activity Logs
              </h1>
              <p className="text-white/90 text-lg">
                Complete audit trail of all system activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Export ({filteredLogs.length})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
            <CardDescription>
              Filter audit logs by user, action, date range, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>User</Label>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {filterOptions?.users.map(user => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {filterOptions?.actions.map(action => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Entity Type</Label>
                <Select value={filterEntityType} onValueChange={setFilterEntityType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {filterOptions?.entityTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Results Limit</Label>
                <Select value={limit} onValueChange={setLimit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 records</SelectItem>
                    <SelectItem value="100">100 records</SelectItem>
                    <SelectItem value="500">500 records</SelectItem>
                    <SelectItem value="1000">1000 records</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredLogs.length} of {auditLogs.length} records
              </div>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="table">
              <FileText className="h-4 w-4 mr-2" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Timeline View
            </TabsTrigger>
          </TabsList>

          {/* Table View */}
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        </TableCell>
                      </TableRow>
                    ) : filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-slate-50">
                          <TableCell>
                            {getSeverityIcon(log.severity)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {log.username}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getSeverityBadge(log.severity)}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {log.entityType}
                              {log.entityId && ` #${log.entityId}`}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.ipAddress}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredLogs.map((log, index) => (
                    <div key={log.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${log.severity === 'error' ? 'bg-red-100' : log.severity === 'warning' ? 'bg-orange-100' : log.severity === 'success' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {getSeverityIcon(log.severity)}
                        </div>
                        {index < filteredLogs.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-200 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{log.action}</span>
                            <Badge variant="outline" className={getSeverityBadge(log.severity)}>
                              {log.entityType}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          by <span className="font-medium">{log.username}</span> from {log.ipAddress}
                        </p>
                        {log.details && (
                          <p className="text-sm bg-slate-50 p-2 rounded border">
                            {log.details}
                          </p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getSeverityIcon(selectedLog?.severity)}
              Audit Log Details
            </DialogTitle>
            <DialogDescription>
              Complete information about this system activity
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="font-medium">{selectedLog.username}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity Type</Label>
                  <p className="font-medium">{selectedLog.entityType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Entity ID</Label>
                  <p className="font-medium">{selectedLog.entityId || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">IP Address</Label>
                  <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">User Agent</Label>
                <p className="text-sm font-mono bg-slate-50 p-2 rounded mt-1">
                  {selectedLog.userAgent}
                </p>
              </div>
              
              {selectedLog.details && (
                <div>
                  <Label className="text-muted-foreground">Details</Label>
                  <pre className="text-sm bg-slate-50 p-3 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(JSON.parse(selectedLog.details || '{}'), null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

