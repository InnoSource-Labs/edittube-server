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
                        selfDeclaredMadeForKids: false,
                    },
                },
                media: {
                    body: readable,
                },
            },
            function (err, res) {
                if (err || !res.data.id) {
                    return {
                        status: err.status || 403,
                        video,
                    };
                }

                const id = res.data.id;
                return {
                    status: err.status,
                    video: {
                        ...video,
                        url: `https://www.youtube.com/watch?v=${id}`,
                        publicId: id,
                    },
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
