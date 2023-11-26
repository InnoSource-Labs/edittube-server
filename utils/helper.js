function getLoggedinUID(auth) {
    return auth.payload.sub.split("|")[1];
}

function getTimeStampString() {
    return new Date().toISOString();
}

function getWorkspaceHasVerification(youtubeSecret) {
    const youtubeSecretJSON = JSON.parse(youtubeSecret);

    return !!youtubeSecretJSON.token;
}

function removeWorkshopToken(youtubeSecret) {
    const youtubeSecretJSON = JSON.parse(youtubeSecret);

    delete youtubeSecretJSON.token;
    return JSON.stringify(youtubeSecretJSON);
}

module.exports = {
    getLoggedinUID,
    getTimeStampString,
    getWorkspaceHasVerification,
    removeWorkshopToken,
};
