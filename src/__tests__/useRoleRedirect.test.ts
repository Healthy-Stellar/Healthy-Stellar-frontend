import { renderHook } from '@testing-library/react';
import { useRoleRedirect, ROLE_DASHBOARD_MAP } from '@/hooks/useRoleRedirect';

const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

beforeEach(() => {
  mockReplace.mockClear();
});

describe('useRoleRedirect', () => {
  it('redirects PATIENT to patient dashboard', () => {
    renderHook(() => useRoleRedirect('GWALLET', 'PATIENT'));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard/patient');
  });

  it('redirects DOCTOR to doctor dashboard', () => {
    renderHook(() => useRoleRedirect('GWALLET', 'DOCTOR'));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard/doctor');
  });

  it('redirects HOSPITAL to hospital dashboard', () => {
    renderHook(() => useRoleRedirect('GWALLET', 'HOSPITAL'));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard/hospital');
  });

  it('redirects ADMIN to admin dashboard', () => {
    renderHook(() => useRoleRedirect('GWALLET', 'ADMIN'));
    expect(mockReplace).toHaveBeenCalledWith('/dashboard/admin');
  });

  it('redirects to /role-not-registered when role is null', () => {
    renderHook(() => useRoleRedirect('GWALLET', null));
    expect(mockReplace).toHaveBeenCalledWith('/role-not-registered');
  });

  it('does not redirect when walletAddress is null', () => {
    renderHook(() => useRoleRedirect(null, 'PATIENT'));
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('ROLE_DASHBOARD_MAP has correct entries', () => {
    expect(ROLE_DASHBOARD_MAP.PATIENT).toBe('/dashboard/patient');
    expect(ROLE_DASHBOARD_MAP.DOCTOR).toBe('/dashboard/doctor');
    expect(ROLE_DASHBOARD_MAP.HOSPITAL).toBe('/dashboard/hospital');
    expect(ROLE_DASHBOARD_MAP.ADMIN).toBe('/dashboard/admin');
  });
});
