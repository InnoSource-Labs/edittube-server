var { google } = require("googleapis");
const Workspace = require("../models/workspace");

var SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

function getOauth2Client(credentials) {
    const clientId = credentials.web.client_id;
    const clientSecret = credentials.web.client_secret;
    const redirectUrl = credentials.web.redirect_uris[0];

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
    );

    return oauth2Client;
}

async function getNewToken(id, code) {
    const workspace = await Workspace.findById(id);

    if (workspace) {
        const credentials = JSON.parse(workspace.youtubeSecret);
        const oauth2Client = getOauth2Client(credentials);

        const { res, tokens } = await oauth2Client.getToken(code);

        credentials.token = tokens;

        await Workspace.findByIdAndUpdate(
            { _id: id },
            { youtubeSecret: JSON.stringify(credentials) },
            { new: true }
        );

        return res.status;
    } else {
        return 404;
    }
}

function getVerifyURI(credentialsStr, id) {
    const credentials = JSON.parse(credentialsStr);

    const oauth2Client = getOauth2Client(credentials);

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
        state: id,
    });

    return authUrl;
}

function authorize(credentialsStr, id) {
    const credentials = JSON.parse(credentialsStr);
    const oauth2Client = getOauth2Client(credentials);

    if (credentials.token) {
        oauth2Client.credentials = credentials.token;
        return oauth2Client;
    } else {
        getVerifyURI(credentialsStr, id);
        return null;
    }
}

module.exports = { getNewToken, getVerifyURI, authorize };
