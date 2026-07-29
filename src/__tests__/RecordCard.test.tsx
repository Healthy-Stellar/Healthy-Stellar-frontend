import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecordCard from '@/components/records/RecordCard';
import { MedicalRecord } from '@/types';
import { shareRecord } from '@/services/api.service';

jest.mock('@/services/api.service', () => ({
  shareRecord: jest.fn(),
}));

jest.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockRecord: MedicalRecord = {
  id: 'rec1',
  date: '2026-07-28T00:00:00.000Z',
  doctorName: 'Sarah Smith',
  diagnosis: 'Hypertension',
  prescription: 'Lisinopril 10mg',
  notes: 'Check blood pressure daily',
  patientAddress: 'GPATIENT123',
};

describe('RecordCard component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders record fields correctly', () => {
    render(<RecordCard record={mockRecord} />);
    
    expect(screen.getByText('Hypertension')).toBeInTheDocument();
    expect(screen.getByText('Dr. Sarah Smith')).toBeInTheDocument();
    expect(screen.getByText(new Date(mockRecord.date).toLocaleDateString())).toBeInTheDocument();
  });

  it('opens details drawer when view button is clicked', () => {
    render(<RecordCard record={mockRecord} />);
    
    // Drawer should not be in document initially
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);

    // Drawer should open and display title & prescription details
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Record Details')).toBeInTheDocument();
    expect(screen.getByText('Lisinopril 10mg')).toBeInTheDocument();
  });

  it('handles sharing record flow successfully', async () => {
    const mockPrompt = jest.spyOn(window, 'prompt').mockReturnValue('GPROVIDER456');
    const mockShareResponse = {
      token: 'ST-ABC123XYZ',
      expiresAt: '2026-07-29T12:00:00.000Z',
      providerAddress: 'GPROVIDER456',
    };
    (shareRecord as jest.Mock).mockResolvedValue(mockShareResponse);

    render(<RecordCard record={mockRecord} />);

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    expect(screen.getByRole('button', { name: /sharing…/i })).toBeDisabled();

    expect(mockPrompt).toHaveBeenCalledWith('Enter provider Stellar address:');
    expect(shareRecord).toHaveBeenCalledWith('rec1', 'GPROVIDER456');

    await waitFor(() => {
      expect(screen.getByText(/Token:/)).toBeInTheDocument();
      expect(screen.getByText('ST-ABC123XYZ')).toBeInTheDocument();
      expect(screen.getByText(/Expires:/)).toBeInTheDocument();
    });

    mockPrompt.mockRestore();
  });
});
