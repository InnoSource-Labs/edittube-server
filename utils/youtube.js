const Stream = require("stream");
var { google } = require("googleapis");
const { authorize } = require("./OAuth2");

function uploadVideoOnYouTube(workspaceId, credentialsStr, video) {
    const auth = authorize(credentialsStr, workspaceId);

    if (auth) {
        const { title, description, url } = video;
        const readable = Stream.Readable.from(url);

        google.youtube("v3").videos.insert(
            {
                auth: auth,
                part: "snippet,status",
                requestBody: {
                    snippet: {
                        title,
                        description,
                        defaultLanguage: "en",
                        defaultAudioLanguage: "en",
                    },
                    status: {
                        privacyStatus: "public",
                    },
                },
                media: {
                    body: readable,
                },
            },
            function (err, response) {
                if (err) {
                    return {
                        status: 500,
                        video,
                    };
                }
                console.log("Video uploaded.", response.data);
                return {
                    status: 200,
                    video,
                };
            }
        );
    } else {
        return {
            status: 401,
            video,
        };
    }
}

module.exports = uploadVideoOnYouTube;
