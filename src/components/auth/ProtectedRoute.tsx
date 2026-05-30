'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWalletStore } from '@/store/useWalletStore';
import { UserRole } from '@/types';

interface Props {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export default function ProtectedRoute({ requiredRole, children }: Props) {
  const { publicKey, role } = useWalletStore();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey) {
      router.replace('/login');
    } else if (role !== requiredRole) {
      router.replace('/');
    }
  }, [publicKey, role, requiredRole, router]);

  if (!publicKey || role !== requiredRole) return null;

  return <>{children}</>;
}
