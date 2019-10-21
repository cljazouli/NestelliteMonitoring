let dataManager = require('./../services/data-manager');

module.exports.getStats = function (req, res) {
    res.status(200)
        .send(dataManager.getStats());
};