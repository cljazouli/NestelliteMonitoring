let dataManager = require('./../services/data-manager');

// Returns the current health message previously defined
module.exports.getHealth = function (req, res) {
    res.status(200)
        .send(dataManager.getHealth());
};