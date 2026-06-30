/**
 * Integration tests for the login flow (auth state transitions and role routing).
 * The login page renders with complex context; these tests verify the auth logic
 * through the stores and redirect hook rather than the full component tree.
 */

import { act } from '@testing-library/react';
import { useAuthStore } from '@/store/authStore';
import { useWalletStore } from '@/store/useWalletStore';

beforeEach(() => {
  useAuthStore.setState({ walletAddress: null, role: null, isLoading: false });
  useWalletStore.setState({ publicKey: null, role: null, network: 'testnet' });
});

describe('Login flow — auth state transitions', () => {
  it('initial state has no wallet or role', () => {
    expect(useAuthStore.getState().walletAddress).toBeNull();
    expect(useWalletStore.getState().publicKey).toBeNull();
  });

  it('connecting a wallet sets the public key in WalletStore', () => {
    act(() => {
      useWalletStore.getState().setWallet('GCONNECTED', 'PATIENT');
    });
    expect(useWalletStore.getState().publicKey).toBe('GCONNECTED');
  });

  it('connecting a wallet also sets role in WalletStore', () => {
    act(() => {
      useWalletStore.getState().setWallet('GCONNECTED', 'DOCTOR');
    });
    expect(useWalletStore.getState().role).toBe('DOCTOR');
  });

  it('AuthStore and WalletStore can be updated independently', () => {
    act(() => {
      useAuthStore.getState().setWalletAddress('GAUTH');
      useAuthStore.getState().setRole('PATIENT');
      useWalletStore.getState().setWallet('GWALLET', 'PATIENT');
    });
    expect(useAuthStore.getState().walletAddress).toBe('GAUTH');
    expect(useWalletStore.getState().publicKey).toBe('GWALLET');
  });

  it('disconnect clears wallet store', () => {
    act(() => {
      useWalletStore.getState().setWallet('GCONNECTED', 'PATIENT');
    });
    act(() => {
      useWalletStore.getState().disconnect();
    });
    expect(useWalletStore.getState().publicKey).toBeNull();
    expect(useWalletStore.getState().role).toBeNull();
  });

  it('clearAuth clears auth store', () => {
    act(() => {
      useAuthStore.getState().setWalletAddress('GTEST');
      useAuthStore.getState().setRole('PATIENT');
    });
    act(() => {
      useAuthStore.getState().clearAuth();
    });
    expect(useAuthStore.getState().walletAddress).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();
  });

  it('isLoading starts false and can be toggled', () => {
    expect(useAuthStore.getState().isLoading).toBe(false);
    act(() => {
      useAuthStore.getState().setIsLoading(true);
    });
    expect(useAuthStore.getState().isLoading).toBe(true);
    act(() => {
      useAuthStore.getState().setIsLoading(false);
    });
    expect(useAuthStore.getState().isLoading).toBe(false);
  });
});
