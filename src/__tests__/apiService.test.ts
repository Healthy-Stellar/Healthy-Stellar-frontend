import axios from 'axios';
import {
  fetchRecords,
  fetchDoctors,
  fetchAppointments,
  createAppointment,
  cancelAppointment,
  updateAppointmentStatus,
  createRecord,
} from '@/services/api.service';

jest.mock('axios', () => {
  const mockGet  = jest.fn();
  const mockPost = jest.fn();
  const mockPatch = jest.fn();
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        get:   mockGet,
        post:  mockPost,
        patch: mockPatch,
      })),
    },
  };
});

const getMock    = jest.fn();
const postMock   = jest.fn();
const patchMock  = jest.fn();

beforeAll(() => {
  const created = (axios.create as jest.Mock).mock.results[0]?.value ?? {};
  if (created.get)   getMock.mockImplementation(created.get);
  if (created.post)  postMock.mockImplementation(created.post);
  if (created.patch) patchMock.mockImplementation(created.patch);
});

describe('api.service', () => {
  describe('fetchRecords', () => {
    it('is a function', () => {
      expect(typeof fetchRecords).toBe('function');
    });
  });

  describe('fetchDoctors', () => {
    it('is a function', () => {
      expect(typeof fetchDoctors).toBe('function');
    });
  });

  describe('fetchAppointments', () => {
    it('is a function', () => {
      expect(typeof fetchAppointments).toBe('function');
    });
  });

  describe('createAppointment', () => {
    it('is a function', () => {
      expect(typeof createAppointment).toBe('function');
    });
  });

  describe('cancelAppointment', () => {
    it('is a function', () => {
      expect(typeof cancelAppointment).toBe('function');
    });
  });

  describe('updateAppointmentStatus', () => {
    it('is a function', () => {
      expect(typeof updateAppointmentStatus).toBe('function');
    });
  });

  describe('createRecord', () => {
    it('is a function', () => {
      expect(typeof createRecord).toBe('function');
    });
  });
});
