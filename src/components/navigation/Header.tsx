'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ROLE_DASHBOARD_MAP } from '@/hooks/useRoleRedirect';

/**
 * Global header with navigation links conditionally rendered by role.
 */
export function Header() {
  const { walletAddress, role, clearAuth } = useAuthStore();

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
    : null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Global"
      >
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-bold text-blue-600 hover:text-blue-500"
        >
          Healthy-Stellar
        </Link>

        {/* Role-specific nav links */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          {role === 'PATIENT' && (
            <>
              <Link href="/dashboard/patient" className="hover:text-blue-600">
                My Records
              </Link>
              <Link href="/dashboard/patient" className="hover:text-blue-600">
                Appointments
              </Link>
            </>
          )}

          {role === 'DOCTOR' && (
            <>
              <Link href="/dashboard/doctor" className="hover:text-blue-600">
                Patients
              </Link>
              <Link href="/dashboard/doctor" className="hover:text-blue-600">
                Consultations
              </Link>
            </>
          )}

          {role === 'HOSPITAL' && (
            <>
              <Link href="/dashboard/hospital" className="hover:text-blue-600">
                Staff
              </Link>
              <Link href="/dashboard/hospital" className="hover:text-blue-600">
                Departments
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <Link href="/dashboard/admin" className="hover:text-blue-600">
                Users
              </Link>
              <Link href="/dashboard/admin" className="hover:text-blue-600">
                Settings
              </Link>
            </>
          )}

          {/* Dashboard shortcut for any authenticated user */}
          {role && (
            <Link
              href={ROLE_DASHBOARD_MAP[role]}
              className="rounded-md bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-100"
            >
              Dashboard
            </Link>
          )}

          {/* Auth actions */}
          {walletAddress ? (
            <button
              onClick={clearAuth}
              className="text-slate-500 hover:text-red-600"
              title={walletAddress}
            >
              {shortAddress} · Disconnect
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-blue-600 px-3.5 py-2 text-white hover:bg-blue-500"
            >
              Connect Wallet
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
