import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import PrescriptionDocument from './PrescriptionDocument';
import { Loader2 } from 'lucide-react';

interface PrescriptionPrintModalProps {
  prescription: any;
  patient: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PrescriptionPrintModal({
  prescription,
  patient,
  isOpen,
  onClose
}: PrescriptionPrintModalProps) {
  const { user } = useAuth();
  const [isPrinting, setIsPrinting] = useState(false);

  const { data: doctor, isLoading: doctorLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!user
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    // Future: Implement PDF generation
    console.log('Download functionality to be implemented');
  };

  if (doctorLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Prescription...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const prescriptionData = {
    id: prescription.id,
    medications: [{
      id: 1,
      name: prescription.medicationName || 'Medication',
      dosage: prescription.dosage || 'As prescribed',
      frequency: prescription.frequency || 'As directed',
      duration: prescription.duration || 'As needed',
      instructions: prescription.instructions || 'Take as directed',
      quantity: prescription.quantity
    }],
    notes: prescription.notes,
    createdAt: prescription.startDate || prescription.createdAt || new Date().toISOString()
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Prescription Document</DialogTitle>
        </DialogHeader>
        
        <div className="prescription-print-content">
          <PrescriptionDocument
            prescription={prescriptionData}
            patient={patient}
            doctor={doctor}
            onPrint={handlePrint}
            onDownload={handleDownload}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4 no-print">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting}>
            {isPrinting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Printing...
              </>
            ) : (
              'Print'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}