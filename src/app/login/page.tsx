'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRoleRedirect } from '@/hooks/useRoleRedirect';
import api from '@/services/api.service';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const { walletAddress, role, setWalletAddress, setRole, setIsLoading } =
    useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Once wallet + role are resolved, redirect automatically
  useRoleRedirect(walletAddress, role);

  async function handleConnect() {
    setError(null);
    setConnecting(true);
    setIsLoading(true);

    try {
      // Freighter wallet integration (window.freighter is injected by the extension)
      const freighter =
        typeof window !== 'undefined'
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).freighter
          : null;

      if (!freighter) {
        setError(
          'Freighter wallet extension not found. Please install it from https://freighter.app.'
        );
        return;
      }

      const { publicKey } = await freighter.getPublicKey();

      if (!publicKey) {
        setError('Could not retrieve public key from wallet.');
        return;
      }

      setWalletAddress(publicKey);

      // Query the backend to resolve the on-chain role for this wallet
      const response = await api.get<{ role: UserRole }>(
        `/users/${publicKey}/role`
      );
      setRole(response.data.role);
    } catch (err: unknown) {
      // 404 means wallet has no registered role
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        // walletAddress is already set; useRoleRedirect will send to /role-not-registered
        setRole(null);
      } else {
        setError('Failed to connect wallet. Please try again.');
        setWalletAddress(null);
        setRole(null);
      }
    } finally {
      setConnecting(false);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-3xl font-bold text-slate-900">Connect Your Wallet</h1>
      <p className="mt-4 text-base text-slate-600 max-w-md">
        Connect your Freighter wallet to access your role-specific dashboard on
        the Healthy-Stellar platform.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 max-w-md"
        >
          {error}
        </div>
      )}

      <button
        onClick={handleConnect}
        disabled={connecting}
        className="mt-8 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {connecting ? 'Connecting…' : 'Connect Freighter Wallet'}
      </button>
    </div>
  );
}
