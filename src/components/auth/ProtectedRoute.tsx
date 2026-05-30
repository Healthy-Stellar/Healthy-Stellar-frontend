'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** The role(s) allowed to access this route. If omitted, any authenticated user is allowed. */
  allowedRoles?: UserRole[];
}

/**
 * Wraps a page to enforce authentication and optional role-based access.
 * - Unauthenticated visitors are redirected to the home page.
 * - Authenticated users whose role is not in allowedRoles are redirected to their own dashboard.
 */
export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { walletAddress, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // Not connected → send to home
    if (!walletAddress) {
      router.replace('/');
      return;
    }

    // Connected but no role → role-not-registered page
    if (!role) {
      router.replace('/role-not-registered');
      return;
    }

    // Role restriction check
    if (allowedRoles && !allowedRoles.includes(role)) {
      // Redirect to their own dashboard instead of a 403
      const dashboardMap: Record<UserRole, string> = {
        PATIENT: '/dashboard/patient',
        DOCTOR: '/dashboard/doctor',
        HOSPITAL: '/dashboard/hospital',
        ADMIN: '/dashboard/admin',
      };
      router.replace(dashboardMap[role]);
    }
  }, [walletAddress, role, isLoading, allowedRoles, router]);

  // While loading or redirecting, render nothing to avoid flash
  if (isLoading || !walletAddress || !role) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
