const stream = require("stream");
var { google } = require("googleapis");
const { authorize } = require("./OAuth2");

async function uploadVideoOnYouTube(workspaceId, credentialsStr, video) {
    const auth = authorize(credentialsStr, workspaceId);

    if (auth) {
        try {
            const { title, description, url } = video;
            const readable = await fetch(url).then((r) =>
                stream.Readable.fromWeb(r.body)
            );

            let res = await google.youtube("v3").videos.insert({
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
            });
            const id = res.data.id;
            return {
                status: res.status,
                video: {
                    ...video,
                    url: `https://www.youtube.com/watch?v=${id}`,
                    publicId: id,
                },
            };
        } catch (err) {
            return {
                status: err.status || 403,
                video,
            };
        }
    } else {
        return {
            status: 401,
            video,
        };
    }
}

module.exports = uploadVideoOnYouTube;
