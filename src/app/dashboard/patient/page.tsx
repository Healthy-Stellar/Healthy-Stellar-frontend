import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function PatientDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900">Patient Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome. Manage your medical records and appointments here.
        </p>
      </div>
    </ProtectedRoute>
  );
}
