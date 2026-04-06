import * as staffService from '../services/staff.js';
import { supabase } from '../utils/supabase.js';

jest.mock('../utils/supabase.js', () => {
  const mSupabase = {
    from: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
  };

  mSupabase.then = jest.fn();
  return { supabase: mSupabase };
});

describe('Staff Services - White Box', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('cancelAppointment', () => {
    test('Should return success message when appointment is deleted', async () => {
      const fakeDeletedData = [{ id: 'app-1' }];
      supabase.then.mockImplementationOnce((resolve) => resolve({ data: fakeDeletedData, error: null }));

      const result = await staffService.cancelAppointment('app-1');

      expect(supabase.from).toHaveBeenCalledWith('Appointment');
      expect(supabase.delete).toHaveBeenCalled();
      expect(supabase.eq).toHaveBeenCalledWith('id', 'app-1');
      expect(result.message).toBe('Appointment deleted successfully.');
    });

    test('Should return "No such appointment" if data array is empty', async () => {
      // Simulate successful query, but no rows deleted
      supabase.then.mockImplementationOnce((resolve) => resolve({ data: [], error: null }));

      const result = await staffService.cancelAppointment('invalid-id');

      expect(result.message).toBe('No such appointment exists.');
    });
  });

  describe('toggleEmergency', () => {
    test('Should toggle emergency status successfully', async () => {

      // Checks current status
      supabase.then.mockImplementationOnce((resolve) => resolve({ data: { isEmergency: false }, error: null }));

      // Performs the update
      supabase.then.mockImplementationOnce((resolve) => resolve({ data: { id: 'app-1' }, error: null }));

      const result = await staffService.toggleEmergency('app-1');

      expect(supabase.update).toHaveBeenCalledWith({ isEmergency: true });
      expect(result.message).toBe('Appointment Emergency status toggled successfully.');
    });
  });
});
