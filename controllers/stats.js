let dataManager = require('./../services/data-manager');

// Returns the current stats message previously defined.
module.exports.getStats = function (req, res) {
    res.status(200)
        .send(dataManager.getStats());
};