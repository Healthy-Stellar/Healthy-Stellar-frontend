'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/useWalletStore';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';

export default function LoginPage() {
  const { publicKey, role } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (publicKey && role) {
      router.replace(role === 'DOCTOR' ? '/dashboard/doctor' : '/dashboard/patient');
    }
  }, [publicKey, role, router]);

  return (
    <ConnectWalletModal onClose={() => router.replace('/')} />
  );
}
