require('dotenv').config();
const request = require('request');
const dataManager = require('./data-manager');

let refresher;

function getStatus() {
    request.get({
        url: process.env.NESTIO_SPACE_ENDPOINT,
        json: true
    }, function (error, response, body) {
        if(error) {
            console.log(error);
        } else {
            dataManager.addElement(body);
        }
    });
}

module.exports.startStatusChecker = function () {
    getStatus();
    refresher = setInterval(function(){
        getStatus();
    }, Number(process.env.UPDATE_INTERVAL));
};