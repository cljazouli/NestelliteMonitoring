// Import env file
require('dotenv').config();

// Import moment library to manage time and timezone
let moment = require('moment-timezone');

// Defining the danger altitude (160km)
let dangerousAltitude = Number(process.env.DANGEROUS_ALTITUDE);

// Define the possible warnings
let healthStatuses = [
    'WARNING: RAPID ORBITAL DECAY IMMINENT',
    'Sustained Low Earth Orbit Resumed',
    'Altitude is A-OK',
    'Not Enough Data'
];

// Initializing the satellite stats
let stats = {
    minimum: null,
    maximum: null,
    average: null
};

// Initializing satellite health
let currentHealth = healthStatuses[3];

// Initializing the arrays that will hold satellite data
let satelliteData = []; // Satellite data for the last 5 min
let lastMinuteData = []; // Satellite data for the last 1 min

// Define the refresher that will hold the interval for updating the health
let refresher;

/**
 * updateStats():
 *
 * Function to update the stats according to the values in satelliteData array.
 * When calling this function, satelliteData contains updated data only for the last 5 minutes.
 *
 * This function loops through the satelliteData and defines the max and min and calculate the average altitude.
 *
 * No Returns for this function.
 * No Parameters for this function.
 */
function updateStats() {
    if (satelliteData.length > 0) { // Can only calculate stats if satelliteData have values inside.
        let max = satelliteData[0].altitude; // Init max as first element in array.
        let min = satelliteData[0].altitude; // Init min as first element in array.
        let totalAltitude = 0; // Init totalAltitude that will be used to calculate the average altitude.
        for (let i=0; i < satelliteData.length; i++ ) {
            totalAltitude = totalAltitude + satelliteData[i].altitude; // Adding altitudes.
            if (max < satelliteData[i].altitude) { max = satelliteData[i].altitude;} // Defining new max if applicable.
            if (min > satelliteData[i].altitude) { min = satelliteData[i].altitude;} // Defining new min if applicable.
            if(i === satelliteData.length -1) { // Executed at the end of the for loop.
                stats.minimum = min; // Assign the final min altitude.
                stats.maximum = max; // Assign the final max altitude.
                stats.average = totalAltitude/satelliteData.length; // Calculate the average altitude.
            }
        }
    } else {
        // If satelliteData is empty, null values will be assigned
        stats.minimum = null;
        stats.maximum = null;
        stats.average = null;
    }
}

/**
 * removeOldData():
 *
 * Function that compares the values of the objects with the current time, and remove the elements if the difference in
 * minutes is bigger than the value of the parameter minutes.
 *
 * The array passed in parameter is a sorted array. The first element will always be the oldest. If the first difference
 * with the first element is less than defined minute value, the function stops.
 *
 * No Returns for this function.
 *
 * @param {Object[]}    array       Array of objects containing altitudes and last_updated values.
 * @param {number}      minutes     The difference in minutes between the current time and all the last_updated elements.
 * @param {function}    callback    Callback function to be executed.
 */
function removeOldData(array, minutes, callback) {
    let arrayUpdated = false; // The array is assumed to have old elements
    let now = moment.tz(moment(),"UTC"); // Defining the current datetime in UTC
    do { // function to be executed as long as the array is not updated and have elements
        let firstElementDate =  moment.tz(array[0].last_updated, "UTC"); // Defining the first element update time.
        let difference = now.diff(firstElementDate, 'minutes'); // Getting the difference in minutes
        if(difference < minutes) { // Comparing the difference with the passed minutes value.
            // If the difference is smaller, the array is updated and the check can stop
            arrayUpdated = true;
            callback();
        } else {
            // If the first element is old, it is removed and the do while  will restart with a new first element.
            array.shift();
        }
    } while (arrayUpdated === false && array.length > 0);
}

/**
 * updateHealth():
 *
 * Function that takes the array of data for the last minutes and defines what is the health status of the satellite.
 *
 * The lastMinuteData array is first double checked to make sure it is updated, then the average altitude is calculated.
 *  When The average altitude is calculated, the new health is defined according to the previous one.
 *
 * No Returns for this function.
 * No Parameters for this function.
 */
function updateHealth () {
    removeOldData(lastMinuteData, 1, () => { // Making sure the array is updated
        if (lastMinuteData.length > 0) { // Health is only defined if data is available
            let totalAltitude = 0; // Initializing the total altitude that will be used to calculate the average.
            for (let i=0; i < lastMinuteData.length; i++ ) { // looping through the array
                totalAltitude = totalAltitude + lastMinuteData[i].altitude; // adding altitudes
                if(i === lastMinuteData.length -1) { // executed when last element reached
                    let newAverage = totalAltitude/lastMinuteData.length; // defining the new average altitude
                    if (newAverage >= dangerousAltitude) { // comparing with the danger altitude.
                        if (currentHealth === healthStatuses [0]) {  // case when warning altitude returns to normal.
                            currentHealth = healthStatuses [1];
                        } else if (currentHealth === healthStatuses [0]) { // case when normal altitude stays normal.
                            currentHealth = healthStatuses [2];
                        }
                    } else { // case when currently in a warning altitude.
                        currentHealth = healthStatuses [0];
                    }
                }
            }
        } else { // if not enough data, the 'not enough' data message will be returned.
            currentHealth = healthStatuses [3];
        }
    });
}

/**
 * startHealthChecker():
 *
 * Function that will run the health checker function every defined interval in the env file (In this case 1 min).
 *
 *
 * No Returns for this function.
 * No Parameters for this function.
 */
module.exports.startHealthChecker = function () {
    refresher = setInterval(function(){
        updateHealth();
    }, Number(process.env.UPDATE_HEALTH_INTERVAL));
};

/**
 * addElement():
 *
 * Function called when nestio API returns an object.
 * We first make sure the element returned is not already existent (bast on last_updated value).
 * When the element is new, it is added to the last minute array data and the last 5 min array data.
 * The satelliteData and lastMinuteData are then checked for old values and the stats are updated.
 *
 *
 * No Returns for this function.
 *
 * @param {Object}    element       Objects containing altitude and last_updated value.
 */
module.exports.addElement = function (element) {
    if (satelliteData.length === 0) { // If no element in satelliteData, the object is necessarily new.
        satelliteData.push(element); // Adding element to the 5 min data array.
        updateStats(); // Updating the stats since the array changed.
    }
    else {
        let newElementDate = moment.tz(element.last_updated, "UTC"); // Defining new element time in UTC
        let lastInsertedDate =  moment.tz(satelliteData[satelliteData.length-1], "UTC"); // Last element inserted in UTC
        if(newElementDate.isAfter(lastInsertedDate)) { // Defining if the element is after the last inserted element.
            satelliteData.push(element); // Adding element to the array
            removeOldData(satelliteData, 5, () => { // Checking if array is updated
                updateStats(); // Updating stats
            });
        }
    }
    if (lastMinuteData.length === 0) {  // If no element in lastMinuteData, the object is necessarily new.
        lastMinuteData.push(element); // Adding element lastMinuteData array.
    } else {
        let newElementDate = moment.tz(element.last_updated, "UTC"); // Defining new element time in UTC
        let lastInsertedDate =  moment.tz(lastMinuteData[lastMinuteData.length-1], "UTC"); // Last element inserted in UTC
        if(newElementDate.isAfter(lastInsertedDate)) { // Defining if the element is after the last inserted element.
            lastMinuteData.push(element); // Adding element to the array
            removeOldData(lastMinuteData, 1, () => {}); // Checking if array is updated
        }
    }
};

// Function that returns the value of the stats
module.exports.getStats = function (){ return stats};

// Function that returns the value of the health
module.exports.getHealth = function (){ return currentHealth};