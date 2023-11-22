const Workspace = require("../../models/workspace");

const limit = 5;

function getWorkspaceReadOnly(workspaces, uid) {
    return workspaces.map((workspace) => {
        const role = workspace.creatorId === uid ? "creator" : "editor";
        workspace._doc.role = role;

        if (role === "editor") {
            delete workspace._doc.clientId;
            delete workspace._doc.clientSecret;
        }

        return workspace;
    });
}

async function getWorkspaces(uid, filter, page) {
    const isCreator = { creatorId: uid };
    const isEditor = {
        editors: {
            $elemMatch: {
                uid,
            },
        },
    };

    const query =
        filter === "creator"
            ? isCreator
            : filter === "editor"
              ? isEditor
              : { $or: [isCreator, isEditor] };

    const workspaces = await Workspace.find(query)
        .sort("-updatedAt")
        .skip((page - 1) * limit)
        .limit(limit);

    const totalresults = await Workspace.countDocuments(query);

    const workspacesReadOnly = getWorkspaceReadOnly(workspaces, uid);

    return {
        currentpage: page,
        workspaces: workspacesReadOnly,
        totalpages: Math.ceil(totalresults / limit),
    };
}

module.exports = { getWorkspaces };
