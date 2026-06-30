export const useRouter = jest.fn(() => ({ replace: jest.fn(), push: jest.fn() }));
export const usePathname = jest.fn(() => '/');
export const useSearchParams = jest.fn(() => new URLSearchParams());
