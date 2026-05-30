'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function RoleNotRegisteredPage() {
  const { clearAuth } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="rounded-full bg-yellow-100 p-4 mb-6">
        <svg
          className="h-10 w-10 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-slate-900">Role Not Registered</h1>
      <p className="mt-4 text-base text-slate-600 max-w-md">
        Your wallet is connected, but no role has been assigned to it on the
        Healthy-Stellar platform. Please contact the platform administrator to
        have your role assigned.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          onClick={clearAuth}
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Disconnect &amp; Go Home
        </Link>
        <a
          href="mailto:support@healthy-stellar.io"
          className="text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
