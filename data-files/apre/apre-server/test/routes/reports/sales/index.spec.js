/**
 * Author: Professor Krasso / Modified by Jennifer (Jennie) Snyder
 * Date: 28 October 2026
 * File: index.spec.js
 * Description: Test the sales report API (Added 3 unit tests for Task m-065: Sales by Product)
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the sales report API
describe('Apre Sales Report API - Regions', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the sales/regions endpoint
  it('should fetch a list of distinct sales regions', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue(['North', 'South', 'East', 'West'])
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/sales/regions'); // Send a GET request to the sales/regions endpoint

    expect(response.status).toBe(200); // Expect a 200 status code
    expect(response.body).toEqual(['North', 'South', 'East', 'West']); // Expect the response body to match the expected data
  });

  // Test the sales/regions endpoint with no regions found
  it('should return 404 for an invalid endpoint', async () => {
    const response = await request(app).get('/api/reports/sales/invalid-endpoint'); // Send a GET request to an invalid endpoint
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });

  // Test the sales/regions endpoint with no regions found
  it('should return 200 with an empty array if no regions are found', async () => {
    // Mock the MongoDB implementation
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockResolvedValue([])
      };
      await callback(db);
    });

    // Make a request to the endpoint
    const response = await request(app).get('/api/reports/sales/regions');

    expect(response.status).toBe(200); // Expect a 200 status code
    expect(response.body).toEqual([]); // Expect the response body to match the expected data
  });
});

// Test the sales report API
describe('Apre Sales Report API - Sales by Region', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the sales/regions/:region endpoint
  it('should fetch sales data for a specific region, grouped by salesperson', async () => {
    mongo.mockImplementation(async (callback) => {
      // Mock the MongoDB collection
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              salesperson: 'John Doe',
              totalSales: 1000
            },
            {
              salesperson: 'Jane Smith',
              totalSales: 1500
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/sales/regions/north'); // Send a GET request to the sales/regions/:region endpoint
    expect(response.status).toBe(200); // Expect a 200 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        salesperson: 'John Doe',
        totalSales: 1000
      },
      {
        salesperson: 'Jane Smith',
        totalSales: 1500
      }
    ]);
  });

  it('should return 200 and an empty array if no sales data is found for the region', async () => {
    // Mock the MongoDB implementation
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      };
      await callback(db);
    });

    // Make a request to the endpoint
    const response = await request(app).get('/api/reports/sales/regions/unknown-region');

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 404 for an invalid endpoint', async () => {
    // Make a request to an invalid endpoint
    const response = await request(app).get('/api/reports/sales/invalid-endpoint');

    // Assert the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});

/**
 * ============================================================================
 * JENNIE'S WEEK 2 (ASSIGNMENT 2.3) SERVER UNIT TESTS — TASK M-065
 * Testing GET /api/reports/sales/products with 3 distinct unit tests:
 *  1. Returns 200 and aggregated sales data grouped by product
 *  2. Returns 200 and an empty array when no product sales records exist
 *  3. Returns 404 Not Found when requesting an invalid products sub-route
 * ============================================================================
 */
describe('Apre Sales Report API - Sales by Product (Task M-065)', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Unit Test 1: Successfully fetches aggregated sales date by product
  it('should fetch aggregated sales data grouped by product', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            { product: 'Laptop', totalSales: 5000 },
            { product: 'Smartphone', totalSales: 3200 }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/sales/products'); // Send a GET request to the sales/products endpoint

    expect(response.status).toBe(200); // Expect a 200 status code
    expect(response.body).toEqual([
      { product: 'Laptop', totalSales: 5000 },
      { product: 'Smartphone', totalSales: 3200 }
    ]); // Expect the response body to match the expected data
  });

  // Unit Test 2: Returns 200 and an empty array when no product sales records exist
  it('should return 200 and an empty array if no product sales records exist', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/sales/products'); // Send a GET request to the sales/products endpoint

    expect(response.status).toBe(200); // Expect a 200 status code
    expect(response.body).toEqual([]); // Expect the response body to be an empty array
  });

  // Unit Test 3: Returns 404 Not Found when requesting an invalid products endpoint
  it('should return 404 Not Found for an invalid products endpoint', async () => {
    const response = await request(app).get('/api/reports/sales/products/invalid-endpoint'); // Send a GET request to an invalid products endpoint

    expect(response.status).toBe(404); // Expect a 404 status code
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    }); // Expect the response body to match the expected error message
  });
});