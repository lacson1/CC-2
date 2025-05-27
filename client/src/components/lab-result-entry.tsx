import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TestTube, Save, User, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LabResultEntryProps {
  className?: string;
}

interface LabOrder {
  id: number;
  patientId: number;
  orderedBy: number;
  createdAt: string;
  patient?: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
}

interface LabOrderItem {
  id: number;
  labOrderId: number;
  labTestId: number;
  result?: string;
  remarks?: string;
  completedAt?: string;
  testName: string;
}

export default function LabResultEntry({ className }: LabResultEntryProps) {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [resultValues, setResultValues] = useState<Record<number, { result: string; remarks: string }>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get all pending lab orders
  const { data: pendingOrders = [], isLoading: ordersLoading } = useQuery<LabOrder[]>({
    queryKey: ['/api/lab-orders/pending']
  });

  // Get items for selected order
  const { data: orderItems = [], isLoading: itemsLoading } = useQuery<LabOrderItem[]>({
    queryKey: ['/api/lab-orders', selectedOrder, 'items'],
    enabled: !!selectedOrder
  });

  const updateResultMutation = useMutation({
    mutationFn: async ({ itemId, result, remarks }: { itemId: number; result: string; remarks: string }) => {
      return apiRequest(`/api/lab-order-items/${itemId}`, {
        method: 'PATCH',
        body: { result, remarks }
      });
    },
    onSuccess: () => {
      toast({
        title: "Result Updated",
        description: "Lab test result has been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/lab-orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/lab-orders/pending'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save result. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleResultChange = (itemId: number, field: 'result' | 'remarks', value: string) => {
    setResultValues(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSaveResult = (itemId: number) => {
    const values = resultValues[itemId];
    if (!values?.result?.trim()) {
      toast({
        title: "Missing Result",
        description: "Please enter a test result before saving.",
        variant: "destructive"
      });
      return;
    }

    updateResultMutation.mutate({
      itemId,
      result: values.result,
      remarks: values.remarks || ''
    });
  };

  if (ordersLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading pending orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Pending Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Pending Lab Orders ({pendingOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending lab orders at this time.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingOrders.map(order => (
                <div
                  key={order.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrder === order.id 
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">
                        {order.patient ? `${order.patient.firstName} ${order.patient.lastName}` : `Patient ID: ${order.patientId}`}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">Order #{order.id}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results Entry */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Test Results - Order #{selectedOrder}</CardTitle>
          </CardHeader>
          <CardContent>
            {itemsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading test details...</span>
              </div>
            ) : (
              <div className="space-y-6">
                {orderItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-lg">{item.testName}</h4>
                        {item.completedAt ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Completed
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            Pending
                          </Badge>
                        )}
                      </div>

                      {item.completedAt ? (
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="font-medium text-sm text-muted-foreground mb-2">Completed Result:</p>
                          <p className="font-mono text-blue-600 dark:text-blue-400 mb-2">{item.result}</p>
                          {item.remarks && (
                            <>
                              <p className="font-medium text-sm text-muted-foreground mb-1">Notes:</p>
                              <p className="text-sm">{item.remarks}</p>
                            </>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed: {format(new Date(item.completedAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Test Result *
                            </label>
                            <Input
                              placeholder="Enter test result (e.g., 120/80, Normal, 5.2 mg/dL)"
                              value={resultValues[item.id]?.result || ''}
                              onChange={(e) => handleResultChange(item.id, 'result', e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Remarks (Optional)
                            </label>
                            <Textarea
                              placeholder="Additional notes or observations..."
                              rows={2}
                              value={resultValues[item.id]?.remarks || ''}
                              onChange={(e) => handleResultChange(item.id, 'remarks', e.target.value)}
                            />
                          </div>

                          <Button
                            onClick={() => handleSaveResult(item.id)}
                            disabled={updateResultMutation.isPending}
                            className="w-full"
                          >
                            {updateResultMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Result
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                    {index < orderItems.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}