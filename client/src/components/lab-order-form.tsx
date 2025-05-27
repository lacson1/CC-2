import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, TestTube, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface LabOrderFormProps {
  patientId: number;
  onOrderCreated?: () => void;
}

interface LabTest {
  id: number;
  name: string;
  category: string;
  referenceRange?: string;
}

export default function LabOrderForm({ patientId, onOrderCreated }: LabOrderFormProps) {
  const [selectedTests, setSelectedTests] = useState<number[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labTests = [], isLoading: testsLoading } = useQuery<LabTest[]>({
    queryKey: ['/api/lab-tests']
  });

  const createOrderMutation = useMutation({
    mutationFn: async (tests: number[]) => {
      return apiRequest(`/api/patients/${patientId}/lab-orders`, {
        method: 'POST',
        body: { tests }
      });
    },
    onSuccess: () => {
      toast({
        title: "Lab Order Created",
        description: "Laboratory tests have been ordered successfully."
      });
      setSelectedTests([]);
      queryClient.invalidateQueries({ queryKey: ['/api/patients', patientId, 'lab-orders'] });
      onOrderCreated?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create lab order. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleTestToggle = (testId: number) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No Tests Selected",
        description: "Please select at least one test to order.",
        variant: "destructive"
      });
      return;
    }
    createOrderMutation.mutate(selectedTests);
  };

  const testsByCategory = labTests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

  if (testsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading lab tests...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Order Laboratory Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(testsByCategory).map(([category, tests]) => (
          <div key={category} className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="grid gap-2">
              {tests.map(test => (
                <div
                  key={test.id}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`test-${test.id}`}
                    checked={selectedTests.includes(test.id)}
                    onCheckedChange={() => handleTestToggle(test.id)}
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`test-${test.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {test.name}
                    </label>
                    {test.referenceRange && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Reference: {test.referenceRange}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedTests.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Selected Tests ({selectedTests.length})</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTests.map(testId => {
                const test = labTests.find(t => t.id === testId);
                return test ? (
                  <Badge key={testId} variant="secondary">
                    {test.name}
                  </Badge>
                ) : null;
              })}
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={createOrderMutation.isPending}
              className="w-full"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Lab Order
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}