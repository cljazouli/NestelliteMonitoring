// Importing the env file
require('dotenv').config();

// Request package will be used to make http requests to nestio's backend
const request = require('request');

// Import data manager
const dataManager = require('./data-manager');

// Define refresher variable that will hold the interval that is used to call nestio's API.
let refresher;

/**
 * getStatus():
 *
 * Function to get data from Nestio's API
 *
 * No Returns for this function.
 * No Parameters for this function.
 */
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

/**
 * startStatusChecker():
 *
 * Function to start the interval to call regularly Nestio's API to get new data.
 *
 * No Returns for this function.
 * No Parameters for this function.
 */
module.exports.startStatusChecker = function () {
    getStatus();
    refresher = setInterval(function(){
        getStatus();
    }, Number(process.env.UPDATE_INTERVAL));
};