import { act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';

const STORAGE_KEY = 'healthy-stellar-auth';

const readPersisted = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw).state : null;
};

beforeEach(() => {
  localStorage.clear();
  useAuthStore.setState({
    walletAddress: null,
    role: null,
    isLoading: false,
  });
});

describe('useAuthStore', () => {
  it('initializes with null wallet address and role', () => {
    const { walletAddress, role } = useAuthStore.getState();
    expect(walletAddress).toBeNull();
    expect(role).toBeNull();
  });

  it('sets wallet address', () => {
    act(() => {
      useAuthStore.getState().setWalletAddress('GTEST1234');
    });
    expect(useAuthStore.getState().walletAddress).toBe('GTEST1234');
  });

  it('sets role', () => {
    act(() => {
      useAuthStore.getState().setRole('PATIENT');
    });
    expect(useAuthStore.getState().role).toBe('PATIENT');
  });

  it('sets role to DOCTOR', () => {
    act(() => {
      useAuthStore.getState().setRole('DOCTOR');
    });
    expect(useAuthStore.getState().role).toBe('DOCTOR');
  });

  it('sets isLoading flag', () => {
    act(() => {
      useAuthStore.getState().setIsLoading(true);
    });
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it('clears auth state', () => {
    act(() => {
      useAuthStore.getState().setWalletAddress('GTEST1234');
      useAuthStore.getState().setRole('PATIENT');
    });
    act(() => {
      useAuthStore.getState().clearAuth();
    });
    const { walletAddress, role, isLoading } = useAuthStore.getState();
    expect(walletAddress).toBeNull();
    expect(role).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('does not affect other fields when setting wallet address', () => {
    act(() => {
      useAuthStore.getState().setRole('HOSPITAL');
      useAuthStore.getState().setWalletAddress('GHOSPITAL');
    });
    expect(useAuthStore.getState().role).toBe('HOSPITAL');
    expect(useAuthStore.getState().walletAddress).toBe('GHOSPITAL');
  });

  describe('persistence', () => {
    it('persists wallet address and role to localStorage', () => {
      act(() => {
        useAuthStore.getState().setWalletAddress('GPERSIST');
        useAuthStore.getState().setRole('DOCTOR');
      });
      expect(readPersisted()).toEqual({ walletAddress: 'GPERSIST', role: 'DOCTOR' });
    });

    it('does not persist the loading flag', () => {
      act(() => {
        useAuthStore.getState().setIsLoading(true);
      });
      expect(readPersisted()).not.toHaveProperty('isLoading');
    });

    it('persists cleared state after clearAuth', () => {
      act(() => {
        useAuthStore.getState().setWalletAddress('GPERSIST');
        useAuthStore.getState().setRole('PATIENT');
        useAuthStore.getState().clearAuth();
      });
      expect(readPersisted()).toEqual({ walletAddress: null, role: null });
    });

    it('rehydrates wallet address and role from localStorage', async () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ state: { walletAddress: 'GREHYDRATED', role: 'HOSPITAL' }, version: 0 }),
      );
      await act(async () => {
        await useAuthStore.persist.rehydrate();
      });
      const { walletAddress, role, isLoading } = useAuthStore.getState();
      expect(walletAddress).toBe('GREHYDRATED');
      expect(role).toBe('HOSPITAL');
      expect(isLoading).toBe(false);
    });
  });
});
