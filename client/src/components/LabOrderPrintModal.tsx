import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import LabOrderDocument from './LabOrderDocument';
import { Loader2 } from 'lucide-react';

interface LabOrderPrintModalProps {
  labOrder: any;
  patient: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function LabOrderPrintModal({
  labOrder,
  patient,
  isOpen,
  onClose
}: LabOrderPrintModalProps) {
  const { user } = useAuth();
  const [isPrinting, setIsPrinting] = useState(false);

  const { data: doctor, isLoading: doctorLoading } = useQuery({
    queryKey: ['/api/profile'],
    enabled: !!user
  });

  const { data: labOrderItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/lab-orders', labOrder?.id, 'items'],
    enabled: !!labOrder?.id
  });

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleDownload = () => {
    console.log('Download functionality to be implemented');
  };

  if (doctorLoading || itemsLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Lab Order...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const labOrderData = {
    id: labOrder.id,
    tests: labOrderItems?.map((item: any) => ({
      id: item.id,
      name: item.testName,
      category: item.category || 'General Tests',
      description: item.description,
      urgency: item.urgency || labOrder.urgency
    })) || [],
    clinicalNotes: labOrder.clinicalNotes,
    urgency: labOrder.urgency || 'routine',
    createdAt: labOrder.createdAt || new Date().toISOString(),
    status: labOrder.status
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lab Order Document</DialogTitle>
        </DialogHeader>
        
        <div className="lab-order-print-content">
          <LabOrderDocument
            labOrder={labOrderData}
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