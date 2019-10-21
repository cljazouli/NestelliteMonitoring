module.exports.RESPONSES = {
    // Returned whenever the average altitude of the satellite goes below 160km for more than 1 minute.
    WARNING: {
        CODE: 200,
        BODY: {
            status: 'WARNING: RAPID ORBITAL DECAY IMMINENT'
        }
    },
    // Returned once the average altitude of the satellite returns to 160km or above.
    RESUMED: {
        CODE: 200,
        BODY: {
            status: 'Sustained Low Earth Orbit Resumed'
        }
    },
    // Returned when the altitude is safe.
    OK: {
        CODE: 200,
        BODY: {
            status: 'Altitude is A-OK'
        }
    },
    // Returned when there is an error, to avoid panic.
    INTERNAL_SERVER_ERROR: {
        STATUS: 500,
        RESPONSE: {
            status: 'Unable to provide a response. Please do not panic!'
        }
    }
};