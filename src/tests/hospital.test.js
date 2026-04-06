import * as hospitalService from '../services/hospital.js';
import { supabase } from '../utils/supabase.js';

jest.mock('../utils/supabase.js', () => {
  const mSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
  };

 // Acts like a Promise
  mSupabase.then = jest.fn();

  return { supabase: mSupabase };
});

describe('Hospital Services - White Box', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getall should return data when successful', async () => {
    const fakeData = [{ id: 1, name: 'Apollo Hospital' }];

    // Instead of mocking select, we just mock the final awaited resolution
    supabase.then.mockImplementationOnce((resolve) => resolve({ data: fakeData, error: null }));

    const result = await hospitalService.getall();

    expect(supabase.from).toHaveBeenCalledWith('Hospital');
    expect(supabase.select).toHaveBeenCalledWith('*');
    expect(result).toEqual(fakeData);
  });

  test('getApprovalRequests should fetch pending requests for a specific hospital', async () => {
    const fakeRequests = [{ id: 'req-1', status: 'PENDING' }];

    supabase.then.mockImplementationOnce((resolve) => resolve({ data: fakeRequests, error: null }));

    const result = await hospitalService.getApprovalRequests('hospital-123');

    expect(supabase.from).toHaveBeenCalledWith('Approval_Requests');
    expect(supabase.eq).toHaveBeenCalledWith('hospital_id', 'hospital-123');
    expect(supabase.eq).toHaveBeenCalledWith('status', 'PENDING');
    expect(result).toEqual(fakeRequests);
  });

  test('saveOpd should throw an error if the database insert fails', async () => {
    const fakeError = new Error('Insert failed');
    supabase.then.mockImplementationOnce((resolve) => resolve({ data: null, error: fakeError }));

    await expect(hospitalService.saveOpd('hospital-123', { patients: 50 }))
      .rejects
      .toThrow('Insert failed');
  });
});
