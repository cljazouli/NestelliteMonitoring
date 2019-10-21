let dataManager = require('./../services/data-manager');

module.exports.getHealth = function (req, res) {
    res.status(200)
        .send(dataManager.getHealth());
};