require('dotenv').config();
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

let refresher;


function updateStats() {
    if (satelliteData.length > 0) {
        let max = satelliteData[0].altitude;
        let min = satelliteData[0].altitude;
        let totalAltitude = 0;
        for (let i=0; i < satelliteData.length; i++ ) {
            totalAltitude = totalAltitude + satelliteData[i].altitude;
            if (max < satelliteData[i].altitude) { max = satelliteData[i].altitude;}
            if (min > satelliteData[i].altitude) { min = satelliteData[i].altitude;}
            if(i === satelliteData.length -1) {
                stats.minimum = min;
                stats.maximum = max;
                stats.average = totalAltitude/satelliteData.length;
            }
        }
    } else {
        stats.minimum = null;
        stats.maximum = null;
        stats.average = null;
    }
}

function removeOldData(array, minutes, callback) {
    let arrayUpdated = false;
    let now = moment.tz(moment(),"UTC");
    do {
        let firstElementDate =  moment.tz(array[0].last_updated, "UTC");
        let difference = now.diff(firstElementDate, 'minutes');
        if(difference < minutes) {
            arrayUpdated = true;
            callback();
        } else {
            array.shift();
        }
    } while (arrayUpdated === false && array.length > 0);
}

function updateHealth () {
    removeOldData(lastMinuteData, 1, () => {
        if (lastMinuteData.length > 0) {
            let totalAltitude = 0;
            for (let i=0; i < lastMinuteData.length; i++ ) {
                totalAltitude = totalAltitude + lastMinuteData[i].altitude;
                if(i === lastMinuteData.length -1) {
                    let newAverage = totalAltitude/lastMinuteData.length;
                    if (newAverage >= dangerousAltitude) {
                        if (currentHealth === healthStatuses [0]) {
                            currentHealth = healthStatuses [1];
                        } else if (currentHealth === healthStatuses [0]) {
                            currentHealth = healthStatuses [2];
                        }
                    } else {
                        currentHealth = healthStatuses [0];
                    }
                }
            }
        }
    });
}

module.exports.startHealthChecker = function () {
    refresher = setInterval(function(){
        updateHealth();
    }, Number(process.env.UPDATE_HEALTH_INTERVAL));
};


module.exports.addElement = function (element) {
    if (satelliteData.length === 0) {
        satelliteData.push(element);
        updateStats();
    }
    else {
        let newElementDate = moment.tz(element.last_updated, "UTC");
        let lastInsertedDate =  moment.tz(satelliteData[satelliteData.length-1], "UTC");
        if(newElementDate.isAfter(lastInsertedDate)) {
            satelliteData.push(element);
            removeOldData(satelliteData, 5, () => {
                updateStats();
            });
        }
    }

    if (lastMinuteData.length === 0) {
        lastMinuteData.push(element);
    } else {
        let newElementDate = moment.tz(element.last_updated, "UTC");
        let lastInsertedDate =  moment.tz(lastMinuteData[lastMinuteData.length-1], "UTC");
        if(newElementDate.isAfter(lastInsertedDate)) {
            lastMinuteData.push(element);
            removeOldData(lastMinuteData, 1, () => {});
        }
    }
};

module.exports.getStats = function (){ return stats};
module.exports.getHealth = function (){ return currentHealth};