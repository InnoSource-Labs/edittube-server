const User = require("../../models/user");
const { getTimeStampString } = require("../../utils");

async function updateLoggedinUser(loggedinUser) {
    const { uid, name, email, emailVerified, updatedAt, nickname, picture } =
        loggedinUser;

    const user = await User.findOne({ uid });

    if (user) {
        if (user.updatedAt !== updatedAt) {
            user.updatedAt = updatedAt;
            if (name) user.name = name;
            if (email) user.email = email;
            user.emailVerified = emailVerified;
            user.nickname = nickname;
            user.picture = picture;

            await user.save();
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
