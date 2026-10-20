import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// Smoke test validating the Jest + React Testing Library setup end-to-end:
// TSX transform, `@/` path alias, jsdom rendering and jest-dom matchers.
describe('test infrastructure', () => {
  it('renders a component and supports jest-dom matchers', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    render(
      <ConfirmDialog
        title="Example dialog"
        message="Testing setup works"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Testing setup works')).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });
});
