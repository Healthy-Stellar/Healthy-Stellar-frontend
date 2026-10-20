import { act } from '@testing-library/react';
import { useWalletStore } from '@/store/useWalletStore';

const STORAGE_KEY = 'wallet-store';

const readPersisted = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw).state : null;
};

beforeEach(() => {
  localStorage.clear();
  useWalletStore.setState({
    publicKey: null,
    role: null,
    network: 'testnet',
  });
});

describe('useWalletStore', () => {
  it('initializes with null publicKey and role', () => {
    const { publicKey, role } = useWalletStore.getState();
    expect(publicKey).toBeNull();
    expect(role).toBeNull();
  });

  it('sets wallet with publicKey and role', () => {
    act(() => {
      useWalletStore.getState().setWallet('GPUBLIC123', 'PATIENT');
    });
    const { publicKey, role } = useWalletStore.getState();
    expect(publicKey).toBe('GPUBLIC123');
    expect(role).toBe('PATIENT');
  });

  it('sets wallet with DOCTOR role', () => {
    act(() => {
      useWalletStore.getState().setWallet('GDOCTOR456', 'DOCTOR');
    });
    expect(useWalletStore.getState().role).toBe('DOCTOR');
    expect(useWalletStore.getState().publicKey).toBe('GDOCTOR456');
  });

  it('disconnects and clears publicKey and role', () => {
    act(() => {
      useWalletStore.getState().setWallet('GPUBLIC123', 'PATIENT');
    });
    act(() => {
      useWalletStore.getState().disconnect();
    });
    expect(useWalletStore.getState().publicKey).toBeNull();
    expect(useWalletStore.getState().role).toBeNull();
  });

  it('preserves network after disconnect', () => {
    act(() => {
      useWalletStore.getState().setWallet('GPUBLIC', 'PATIENT');
      useWalletStore.getState().disconnect();
    });
    expect(useWalletStore.getState().network).toBe('testnet');
  });

  it('setWallet overwrites previous wallet', () => {
    act(() => {
      useWalletStore.getState().setWallet('GFIRST', 'PATIENT');
      useWalletStore.getState().setWallet('GSECOND', 'DOCTOR');
    });
    expect(useWalletStore.getState().publicKey).toBe('GSECOND');
    expect(useWalletStore.getState().role).toBe('DOCTOR');
  });

  describe('persistence', () => {
    it('persists wallet state to localStorage', () => {
      act(() => {
        useWalletStore.getState().setWallet('GPERSIST', 'PATIENT');
      });
      expect(readPersisted()).toEqual({
        publicKey: 'GPERSIST',
        role: 'PATIENT',
        network: 'testnet',
      });
    });

    it('persists cleared wallet after disconnect', () => {
      act(() => {
        useWalletStore.getState().setWallet('GPERSIST', 'PATIENT');
        useWalletStore.getState().disconnect();
      });
      expect(readPersisted()).toEqual({ publicKey: null, role: null, network: 'testnet' });
    });

    it('rehydrates wallet state from localStorage', async () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          state: { publicKey: 'GREHYDRATED', role: 'DOCTOR', network: 'mainnet' },
          version: 0,
        }),
      );
      await act(async () => {
        await useWalletStore.persist.rehydrate();
      });
      const { publicKey, role, network } = useWalletStore.getState();
      expect(publicKey).toBe('GREHYDRATED');
      expect(role).toBe('DOCTOR');
      expect(network).toBe('mainnet');
    });
  });
});
