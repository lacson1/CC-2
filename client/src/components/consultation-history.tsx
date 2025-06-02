import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

interface ConsultationRecord {
  id: number;
  patientId: number;
  formId: number;
  filledBy: number;
  formData: Record<string, any>;
  createdAt: string;
  formName: string;
  specialistRole: string;
  formDescription: string;
}

interface ConsultationHistoryProps {
  patientId: number;
}

export default function ConsultationHistory({ patientId }: ConsultationHistoryProps) {
  const [expandedRecords, setExpandedRecords] = useState<Set<number>>(new Set());

  const { data: consultations = [], isLoading } = useQuery<ConsultationRecord[]>({
    queryKey: ['/api/patients', patientId, 'consultations'],
  });

  const toggleExpanded = (recordId: number) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRecords(newExpanded);
  };

  const renderFieldValue = (key: string, value: any) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value || "Not provided");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Consultation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading consultation history...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}