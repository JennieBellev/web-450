/**
 ===========================================================================
  // JENNIFER SNYDER'S UNIT TESTS FOR TASK M-097 (/performance-by-region-supervisor)
  // ============================================================================
 * Author: Professor Krasso
 * Date: 10 September 2024
 * Modified by: Jennifer Snyder
 * Date: 11/06/2026
 * File: index.spec.js
 * Description: Test the agent performance API
 */
// Test 1: Successful response (200 OK) with valid query parameters
  it('should fetch agent performance data when region and supervisorId are provided', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              agent: 'Olivia Garcia',
              callDuration: 350,
              resolutionTime: 130
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get(
      '/api/reports/agent-performance/performance-by-region-supervisor?region=Australia&supervisorId=650c1f1e1c9d440000a1b1c3'
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        agent: 'Olivia Garcia',
        callDuration: 350,
        resolutionTime: 130
      }
    ]);
  });

  // Test 2: Missing parameters validation (400 Bad Request)
  it('should return 400 if region or supervisorId is missing', async () => {
    const response = await request(app).get(
      '/api/reports/agent-performance/performance-by-region-supervisor?region=Australia'
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Region and supervisor ID are required',
      status: 400,
      type: 'error'
    });
  });

  // Test 3: Invalid endpoint check (404 Not Found)
  it('should return 404 for an invalid agent-performance endpoint', async () => {
    const response = await request(app).get(
      '/api/reports/agent-performance/invalid-route-m97'
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });