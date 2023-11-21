const Workspace = require("../../models/workspace");

let limit = 5;

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
        .exists("updatedAt")
        .sort("-updatedAt")
        .skip((page - 1) * limit)
        .limit(limit);

    const totalresults = await Workspace.countDocuments(query);

    const workspacesWithRole = workspaces.map((workspace) => ({
        ...workspace,
        role: workspace.creatorId === uid ? "creator" : "editor",
    }));

    return {
        currentpage: page,
        workspaces: workspacesWithRole,
        totalpages: Math.ceil(totalresults / limit),
    };
}

module.exports = { getWorkspaces };
