'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWalletStore } from '@/store/useWalletStore';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';

function truncate(key: string) {
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export default function Navbar() {
  const { publicKey, role, disconnect } = useWalletStore();
  const [showModal, setShowModal] = useState(false);

  const dashboardHref = role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient';

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="font-bold text-blue-600 text-lg">HealthyStella</Link>

          <div className="flex items-center gap-3">
            {publicKey ? (
              <>
                <Link href={dashboardHref} className="text-sm text-slate-600 hover:text-slate-900">
                  Dashboard
                </Link>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono text-slate-700">
                  {truncate(publicKey)}
                </span>
                <button
                  onClick={disconnect}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </nav>

      {showModal && <ConnectWalletModal onClose={() => setShowModal(false)} />}
    </>
  );
}
