// Import third party components
let cors = require('cors');

// Import Endpoint manager with the defined routes
let endpointsManager = require('./../utils/endpoints');

// Import the controllers
let statsController = require('./../controllers/stats');
let healthController = require('./../controllers/health');

let router = function (application) {
    /**
     * @api         {get}       /stats      Get Nestio's satellite stats.
     * @apiVersion  1.0.0
     * @apiName     getStats
     * @apiGroup    Stats
     *
     * @apiDescription          Returns the minimum, maximum and average altitude for the last 5 minutes.
     *
     * @apiSuccess {Number}     minimum     Minimum altitude for the last 5 minutes.
     * @apiSuccess {Number}     maximum     Maximum altitude for the last 5 minutes.
     * @apiSuccess {Number}     average     Average altitude for the last 5 minutes.
     *
     * @apiError    InternalError           The request failed due to an internal error.
     *
     * @apiSuccessExample       {json}      Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "minimum": 213.001,
     *       "maximum": 312.007,
     *       "average": 250.999
     *     }
     */
    application.get(
        endpointsManager.ENDPOINTS.STATS,
        cors(),
        statsController.getStats
    );


    /**
     * @api         {get}       /health     Get Nestio's satellite health.
     * @apiVersion  1.0.0
     * @apiName     getHealth
     * @apiGroup    Health
     *
     * @apiDescription          Returns the current health of the satellite.
     *
     * @apiSuccess {String}     status      Current health status of the satellite.
     *
     * @apiError   InternalError            The request failed due to an internal error.
     *
     * @apiSuccessExample       {json}      Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "WARNING: RAPID ORBITAL DECAY IMMINENT"
     *     }
     */
    application.get(
        endpointsManager.ENDPOINTS.HEALTH,
        cors(),
        healthController.getHealth
    );
};

// Exporting the router
module.exports = router;