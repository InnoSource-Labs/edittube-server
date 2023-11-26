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

        oauth2Client.getToken(code, async function (err, token) {
            if (err) {
                return 500;
            }

            oauth2Client.credentials = token;
            credentials.token = token;
            await Workspace.findByIdAndUpdate(
                { _id: id },
                { youtubeSecret: JSON.stringify(credentials) },
                { new: true }
            );
            return 200;
        });
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
        state: id,
    });

    return authUrl;
}

function authorize(credentialsStr, id) {
    const credentials = JSON.parse(credentialsStr);

    const oauth2Client = getOauth2Client(credentials);

    if (credentials.token) {
        oauth2Client.credentials = JSON.parse(credentials.token);
        return oauth2Client;
    } else {
        getVerifyURI(credentialsStr, id);
        return null;
    }
}

module.exports = { getNewToken, getVerifyURI, authorize };
