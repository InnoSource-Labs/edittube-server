const User = require("../../models/user");

async function updateLoggedinUser(loggedinUser) {
    const { uid, name, email, emailVerified, updatedAt, nickname, picture } =
        loggedinUser;

    const user = await User.findOne({ uid });

    if (user) {
        if (user.updatedAt !== updatedAt) {
            await user.updateOne({
                updatedAt,
                name: name || user.name,
                email: email || user.email,
                emailVerified,
                nickname,
                picture,
            });
        }
        return { status: 200, user };
    } else {
        const timestamp = new Date();
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
