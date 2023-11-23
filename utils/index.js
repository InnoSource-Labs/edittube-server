function getLoggedinUID(auth) {
    return auth.payload.sub.split("|")[1];
}

function hetHasOwnership(auth, uid) {
    return getLoggedinUID(auth.payload.sub) === uid;
}

function getTimeStampString() {
    return new Date().toISOString();
}

module.exports = { getLoggedinUID, hetHasOwnership, getTimeStampString };
