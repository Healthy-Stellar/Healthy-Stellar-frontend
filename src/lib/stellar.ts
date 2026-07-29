import { Networks } from '@stellar/stellar-sdk';
import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  passphrase: Networks.TESTNET,
};

export class HorizonRequestError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'HorizonRequestError';
  }
}

/**
 * Normalizes Horizon network errors, rate limits, and invalid responses into a
 * single HorizonRequestError instead of letting them throw unhandled/crash the UI.
 */
export async function callHorizon<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (err instanceof TypeError) {
      throw new HorizonRequestError('Unable to reach the Stellar network. Check your connection and try again.', err);
    }
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 429) {
      throw new HorizonRequestError('Stellar network rate limit reached. Please try again shortly.', err);
    }
    if (status && status >= 500) {
      throw new HorizonRequestError('Stellar Horizon service is temporarily unavailable.', err);
    }
    if (status && status >= 400) {
      throw new HorizonRequestError('Invalid request sent to the Stellar network.', err);
    }
    throw new HorizonRequestError('Unexpected error communicating with the Stellar network.', err);
  }
}

/** Runs a Horizon call and surfaces any failure via the toast system instead of failing silently. */
export function useHorizonCall() {
  const { toast } = useToast();

  return useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | undefined> => {
      try {
        return await callHorizon(fn);
      } catch (err) {
        const message = err instanceof HorizonRequestError ? err.message : 'Failed to communicate with the Stellar network.';
        toast(message, 'error');
        return undefined;
      }
    },
    [toast]
  );
}
