import { PatientCommunicationHub } from '@/components/patient-communication-hub';

export default function PatientCommunicationPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Communication</h1>
        <p className="text-sm text-gray-600">Manage patient messages and communication</p>
      </div>
      
      <PatientCommunicationHub />
    </div>
  );
}

