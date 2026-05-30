import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRole } from '@/types';

interface WalletState {
  publicKey: string | null;
  role: UserRole | null;
  network: string;
  setWallet: (publicKey: string, role: UserRole) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      publicKey: null,
      role: null,
      network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
      setWallet: (publicKey, role) => set({ publicKey, role }),
      disconnect: () => set({ publicKey: null, role: null }),
    }),
    { name: 'wallet-store' }
  )
);
