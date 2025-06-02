import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText, TestTube } from 'lucide-react';
import PrescriptionPrintModal from './PrescriptionPrintModal';
import LabOrderPrintModal from './LabOrderPrintModal';

interface DocumentActionButtonsProps {
  patient: any;
  prescriptions?: any[];
  labOrders?: any[];
}

export default function DocumentActionButtons({
  patient,
  prescriptions = [],
  labOrders = []
}: DocumentActionButtonsProps) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabOrderModal, setShowLabOrderModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedLabOrder, setSelectedLabOrder] = useState(null);

  const handlePrintPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handlePrintLabOrder = (labOrder: any) => {
    setSelectedLabOrder(labOrder);
    setShowLabOrderModal(true);
  };

  return (
    <div className="document-actions space-y-4">
      {/* Prescription Documents */}
      {prescriptions.length > 0 && (
        <div className="prescription-documents">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Print Prescriptions with Letterhead
          </h4>
          <div className="grid gap-2">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{prescription.medicationName}</p>
                  <p className="text-sm text-gray-600">
                    {prescription.dosage} - {prescription.frequency}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrintPrescription(prescription)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-100"
                >
                  <Printer className="w-3 h-3 mr-1" />
                  Print
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lab Order Documents */}
      {labOrders.length > 0 && (
        <div className="lab-order-documents">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Print Lab Orders with Letterhead
          </h4>
          <div className="grid gap-2">
            {labOrders.map((labOrder) => (
              <div key={labOrder.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">Lab Order #{labOrder.id}</p>
                  <p className="text-sm text-gray-600">
                    Status: {labOrder.status} | Ordered: {new Date(labOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePrintLabOrder(labOrder)}
                  className="text-green-600 border-green-200 hover:bg-green-100"
                >
                  <Printer className="w-3 h-3 mr-1" />
                  Print
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedPrescription && (
        <PrescriptionPrintModal
          prescription={selectedPrescription}
          patient={patient}
          isOpen={showPrescriptionModal}
          onClose={() => {
            setShowPrescriptionModal(false);
            setSelectedPrescription(null);
          }}
        />
      )}

      {selectedLabOrder && (
        <LabOrderPrintModal
          labOrder={selectedLabOrder}
          patient={patient}
          isOpen={showLabOrderModal}
          onClose={() => {
            setShowLabOrderModal(false);
            setSelectedLabOrder(null);
          }}
        />
      )}
    </div>
  );
}