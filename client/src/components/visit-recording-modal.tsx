import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedVisitRecording } from "@/components/enhanced-visit-recording";

interface VisitRecordingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: number;
}

export function VisitRecordingModal({ open, onOpenChange, patientId }: VisitRecordingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Patient Visit</DialogTitle>
          <DialogDescription>
            Complete comprehensive visit documentation including vital signs, examination, and treatment plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <EnhancedVisitRecording 
            patientId={patientId}
            onSave={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VisitRecordingModal;