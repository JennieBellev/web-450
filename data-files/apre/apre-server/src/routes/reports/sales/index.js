/**
 * Author: Professor Krasso / Modified by Jennifer (Jennie) Snyder
 * Date: 28 October 2026
 * File: index.js
 * Description: Apre sales report API for the sales reports (Added Task m-065: Sales by Product)
 */

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});

/**
 * ============================================================================
 * JENNIE'S WEEK 2 (ASSIGNMENT 2.3) MAJOR DEVELOPMENT TASK — TASK M-065
 * ============================================================================
 * @description
 * GET /products
 *
 * Fetches aggregated sales data grouped by product and sorted alphabetically.
 * Built for Sprint 1 Major Task M-065 ("Create an API to fetch sales data by
 * product and build an Angular component to display sales by product").
 *
 * Example:
 * fetch('/api/reports/sales/products')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 * ============================================================================
 */
router.get('/products', (req, res, next) => {
  try {
    mongo(async db => {
      const salesByProduct = await db.collection('sales').aggregate([
        {
          $group: {
            _id: '$product',
            totalSales: { $sum: '$amount' }
          }
        },
        {
          $project: {
            _id: 0,
            product: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { product: 1 }
        }
      ]).toArray();

      res.send(salesByProduct);
    }, next);
  } catch (err) {
    console.error('Error getting sales data by product: ', err);
    next(err);
  }
});

module.exports = router;