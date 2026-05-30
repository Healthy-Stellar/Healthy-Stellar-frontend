'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';

export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  PATIENT: '/dashboard/patient',
  DOCTOR: '/dashboard/doctor',
  HOSPITAL: '/dashboard/hospital',
  ADMIN: '/dashboard/admin',
};

/**
 * Redirects an authenticated user to their role-specific dashboard.
 * If no role is assigned, redirects to /role-not-registered.
 */
export function useRoleRedirect(
  walletAddress: string | null,
  role: UserRole | null
) {
  const router = useRouter();

  useEffect(() => {
    if (!walletAddress) return;

    if (!role) {
      router.replace('/role-not-registered');
      return;
    }

    router.replace(ROLE_DASHBOARD_MAP[role]);
  }, [walletAddress, role, router]);
}
