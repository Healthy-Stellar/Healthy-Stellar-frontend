import { act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';

beforeEach(() => {
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
});
