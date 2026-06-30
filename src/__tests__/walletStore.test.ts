import { act } from '@testing-library/react';
import { useWalletStore } from '@/store/useWalletStore';

beforeEach(() => {
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
});
