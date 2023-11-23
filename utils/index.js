function getLoggedinUID(auth) {
    return auth.payload.sub.split("|")[1];
}

function getTimeStampString() {
    return new Date().toISOString();
}

module.exports = { getLoggedinUID, getTimeStampString };
