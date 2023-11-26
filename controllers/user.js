const User = require("../models/user");
const { getTimeStampString } = require("../utils/helper");

async function updateLoggedinUser(loggedinUser) {
    const {
        sub,
        name,
        email,
        email_verified: emailVerified,
        updated_at: updatedAt,
        nickname,
        picture,
    } = loggedinUser;
    const uid = sub.split("|")[1];
    const user = await User.findOne({ uid });

    if (user) {
        if (user.updatedAt !== updatedAt) {
            const updatedUser = await User.findOneAndUpdate(
                { uid },
                {
                    updatedAt,
                    name,
                    email,
                    emailVerified,
                    nickname,
                    picture,
                },
                { new: true }
            );

            return { status: 200, user: updatedUser };
        }

        return { status: 200, user };
    } else {
        const timestamp = getTimeStampString();

        const newUser = new User({
            uid,
            name,
            email,
            emailVerified: emailVerified || false,
            createdAt: updatedAt || timestamp,
            updatedAt: updatedAt || timestamp,
            nickname,
            picture,
        });
        await newUser.save();

        return { status: 201, user: newUser };
    }
}

module.exports = { updateLoggedinUser };
