import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DoctorDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['DOCTOR']}>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900">Doctor Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Welcome. View patient records and manage consultations here.
        </p>
      </div>
    </ProtectedRoute>
  );
}
