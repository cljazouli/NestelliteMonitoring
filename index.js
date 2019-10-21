/**
 * The following application contains a health API for the Nestio Satellite.
 * Realtime information about the satellite is available from the 'nestio.space/api/satellite/data' endpoint.
 * Written by Chakib Ljazouli <ljazouli.c@gmail.com>, 2019
 */

const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const app = express();
let routes = require('./routes/routes');
let statusChecker = require('./services/status-checker');
let dataManager = require('./services/data-manager');

app.use(helmet());
routes(app);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Nestio Space app is listening on port ${process.env.PORT || 8080}!`);
    statusChecker.startStatusChecker();
    dataManager.startHealthChecker();
});

app.options('*', cors());
