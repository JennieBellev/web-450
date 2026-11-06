/**
 * ============================================================================
 * JENNIFER SNYDER SPRINT 2 MAJOR DEVELOPMENT TASK — TASK M-097
 * ============================================================================@description
 * GET /performance-by-region-supervisor
 *
 * Fetches agent performance data filtered by region and supervisor ID.
 * Built for Sprint 2 Major Task M-097 ("Create an API to fetch agent performance
 * data by region and supervisor and build an Angular component to display it").
 *
 * Why this was added:
 * Allows the frontend to query specific agent performance metrics dynamically
 * based on selected region and supervisor filters instead of fetching all records.
 * ============================================================================
 */
router.get('/performance-by-region-supervisor', (req, res, next) => {
  try {
    // Extract region and supervisorId from the incoming query parameters
    const { region, supervisorId } = req.query;

    // Validate inputs: Return a 400 Bad Request error if either parameter is missing
    if (!region || !supervisorId) {
      return next(createError(400, 'Region and supervisor ID are required'));
    }

    // Open connection to MongoDB Atlas using the shared mongo helper utility
    mongo(async db => {
      const data = await db.collection('agentPerformance').aggregate([
        {
          // Step 1: Filter documents matching the requested region and supervisor ID
          $match: {
            region: region,
            supervisorId: new ObjectId(supervisorId)
          }
        },
        {
          // Step 2: Join the 'agents' collection to pull in agent names using agentId
          $lookup: {
            from: 'agents',
            localField: 'agentId',
            foreignField: 'agentId',
            as: 'agentDetails'
          }
        },
        {
          // Step 3: Flatten the joined agentDetails array into an object
          $unwind: '$agentDetails'
        },
        {
          // Step 4: Group records by agent name and calculate metrics
          $group: {
            _id: '$agentDetails.name',
            totalCallDuration: { $sum: '$callDuration' },
            avgResolutionTime: { $avg: '$resolutionTime' }
          }
        },
        {
          // Step 5: Reshape output fields and remove the default MongoDB _id
          $project: {
            _id: 0,
            agent: '$_id',
            callDuration: '$totalCallDuration',
            resolutionTime: '$avgResolutionTime'
          }
        },
        {
          // Step 6: Sort results alphabetically by agent name for clean UI display
          $sort: { agent: 1 }
        }
      ]).toArray();

      // Send the aggregated data back to the Angular client as JSON
      res.send(data);
    }, next);
  } catch (err) {
    console.error('Error in /performance-by-region-supervisor:', err);
    next(err);
  }
});